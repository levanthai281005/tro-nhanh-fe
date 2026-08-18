# Mô hình định danh và vai trò

Role cộng dồn theo hành vi, ba tầng định danh độc lập, cách client biết người dùng là ai.
Dùng khi dựng navigation, guard và điều hướng sau đăng nhập.

---

## Mô hình Role: cộng dồn theo hành vi — không có "đăng nhập theo vai trò"

**Nguyên tắc lõi:** role là **cộng dồn (additive)**, không phải **chuyển đổi (switching)**. Quan hệ `User` ↔ `Role` là n-n; quyền hiệu lực của một phiên = **hợp (union)** quyền của mọi role tài khoản đang có. Vì mọi permission đều là dạng *allow* (không tồn tại permission *deny*), union không bao giờ sinh mâu thuẫn — thêm role chỉ mở thêm quyền.

> **Lý do chọn additive thay vì bắt chọn vai trò lúc đăng ký:** ranh giới Renter/Seller ngoài đời rất mờ (chủ trọ vẫn đi tìm phòng; người thuê có thể đăng tin hộ). Bắt chọn sớm tăng friction đăng ký và đẻ ra luồng "chuyển đổi tài khoản" phức tạp. **Trade-off:** UI phải tự gánh việc phân ngữ cảnh (giải ở 1.6 bằng 2 shell + 2 zone); đổi lại backend RBAC đơn giản và mỗi người chỉ cần một tài khoản.

**1.8.1 Vòng đời role:**

| Bước | Sự kiện | roles sau sự kiện | Ghi chú |
|---|---|---|---|
| 1 | Đăng ký (SĐT + OTP) | `[Renter]` | Mặc định mọi tài khoản |
| 2 | Đăng tin tìm phòng / ở ghép | `[Renter]` — không đổi | Năng lực Renter |
| 3 | **Trigger kích hoạt Seller** (một trong hai): (a) tạo `RentalListing` **đầu tiên, kể cả Draft**; (b) mở Workspace lần đầu | `[Renter, Seller]` | Idempotent. Gán role + tạo listing nằm **cùng transaction** — bất biến: *tồn tại listing có `sellerId = user` ⟹ user có role Seller* |
| 4 | Bấm "Dùng thử"/mua gói | roles không đổi; đổi `workspaceStatus` | Gating là tầng riêng, không phải role |
| 5 | (Hiếm) Admin gán/gỡ role thủ công | Theo thao tác Admin | Đường phụ; đường chính là tự kích hoạt |

**1.8.2 Hệ thống "biết vai trò" qua 3 tầng độc lập:**

| Tầng | Lưu ở đâu | Trả lời | Giá trị |
|---|---|---|---|
| **Trạng thái tài khoản** `User.status` | DB | "Có dùng được hệ thống không?" | `PendingVerification` / `Active` / `Locked` |
| **Role** `roles[]` | Claims trong JWT | "Được vào shell/nhóm endpoint nào?" | `Renter` / `Seller` / `Admin` / `Moderator` |
| **Trạng thái năng lực** | Suy từ DB | "Trong shell đó làm được gì?" | `workspaceStatus`: NONE/TRIAL/ACTIVE/READ_ONLY · `residencyStatus`: NONE/PENDING/ACTIVE/PAST |

Chi tiết trạng thái tài khoản: `PendingVerification` (đã đăng ký, chưa xác thực OTP — chưa làm được gì ngoài xác thực lại); `Active` (bình thường); `Locked` (Admin khóa — không đăng nhập được, tin đăng tự ẩn theo BR-028, dữ liệu SaaS giữ nguyên).

Chi tiết `residencyStatus` (suy từ `Occupancy` + `Contract` của chính user): `NONE` chưa được gắn phòng nào; `PENDING` đã được gắn nhưng **chưa xác nhận** liên kết (BR-029) — chưa xem được hóa đơn; `ACTIVE` đang ở; `PAST` đã rời đi — vẫn xem được lịch sử và vẫn viết được đánh giá khu đã ở.

> **Không nhét `workspaceStatus`/`residencyStatus` vào JWT:** trạng thái đổi theo thời gian trong khi claims "đóng băng" đến khi token hết hạn — nhét vào sẽ có 15–30 phút hệ thống mở/khóa sai. Gating là quyết định tiền bạc, phải luôn tươi. Roles gần như bất biến → để trong token cho stateless.

> **Vì sao KHÔNG tạo role "Resident":** người ở không phải một loại tài khoản khác — họ vẫn là Renter, chỉ khác ở chỗ **có một Occupancy đã xác nhận**. Điều kiện vào Residency shell là *dữ liệu* (`residencyStatus`), y hệt cách Workspace dùng `workspaceStatus`. Nếu làm thành role sẽ mắc câu hỏi "hết hợp đồng có gỡ role không"; dùng trạng thái thì tự chuyển `PAST` một cách tự nhiên. Ba tầng **trực giao** nhau — một chủ trọ đang đi thuê nhà nơi khác có thể đồng thời `roles=[Renter, Seller]`, `workspaceStatus=ACTIVE`, `residencyStatus=ACTIVE` và vào được cả ba shell.

**Xử lý token cũ sau khi thêm role:** sau action kích hoạt Seller thành công, **frontend gọi ngay `POST /auth/refresh`** để nhận access token mới có claims `[Renter, Seller]`, rồi mới điều hướng. (Trade-off đã cân: BE trả token trong response nghiệp vụ = trộn concern; middleware query role mỗi request = phá stateless.)

**`GET /me` là nguồn chân lý phía client:** trả `{ user, profile, roles[], workspaceStatus, residencyStatus }`; frontend (web và app mobile) gọi sau đăng nhập/refresh để render navigation (hiện "Dashboard chủ trọ" không, zone SaaS khóa/mở, có hiện "Phòng của tôi" không). Không suy diễn từ localStorage.

**1.8.3 Route guard (frontend — chỉ là UX, backend luôn kiểm tra lại):**
1. `/chu-tro/*` chưa đăng nhập → `/dang-nhap?redirect=…`.
2. `/chu-tro` (entry) đăng nhập nhưng chưa có Seller → **không chặn**: đây chính là điểm kích hoạt (trigger b).
3. Route con zone SaaS → đọc `workspaceStatus`: `NONE` → B1; `READ_ONLY` → chế độ chỉ đọc. Backend trả 403 mã `WORKSPACE_READ_ONLY` khi ghi bị chặn; FE bắt mã này hiện modal mời gia hạn **không mất dữ liệu form đang nhập**.
4. `/nguoi-o/*` (và app mobile) → đọc `residencyStatus`: `NONE` → màn hình trống hướng dẫn "chủ trọ cần gắn bạn vào phòng"; `PENDING` → màn xác nhận liên kết (BR-029); `ACTIVE`/`PAST` → vào bình thường (PAST chỉ xem lịch sử).

**Quy ước redirect toàn hệ thống:** mọi tình huống Guest bị yêu cầu đăng nhập (nhắn tin, lưu tin, xem SĐT, đăng tin) đều mang `?redirect=` — đăng nhập/đăng ký xong quay về đúng ngữ cảnh (mở lại modal liên hệ, giữ form đang nhập).

---
