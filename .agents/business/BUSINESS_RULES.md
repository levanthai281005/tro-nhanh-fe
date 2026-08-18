# Business Rules (BR-001 → BR-035)

Toàn bộ quy tắc nghiệp vụ của hệ thống. Đây là nguồn chân lý khi triển khai; mọi tài liệu
khác tham chiếu theo mã BR ở đây.

---

> BR-001 → BR-021 giữ mã cũ (một số được **sửa nội dung**); BR-026 → BR-031 là **rule mới**. Các BR có ảnh hưởng kiến trúc có mục riêng kèm lý do.

| BR | Nội dung |
|---|---|
| **BR-001** | Vòng đời tin: `Draft → PendingApproval → Active → (Expired/Rented/Hidden/Rejected)`; áp dụng cả tin cho thuê và tin nhu cầu thuê. |
| **BR-002** | Trạng thái phòng: `Available ⇄ Deposited ⇄ Rented; Available ⇄ Hidden`; đồng bộ với Contract theo BR-031. |
| **BR-003** | Sửa nội dung quan trọng của tin (giá, địa chỉ, ảnh) → duyệt lại; **tin ẨN TẠM trong lúc chờ duyệt** (V1 chấp nhận, versioning giữ bản cũ hiển thị = V2); UI cảnh báo trước khi lưu. Gia hạn không sửa nội dung → KHÔNG duyệt lại. |
| **BR-004** | Trạng thái hóa đơn **suy tự động từ ΣPayment**: `Unpaid → PartiallyPaid → Paid`; qua `dueDate` chưa đủ → `Overdue`; từ `Overdue`: thu đủ → `Paid`, thu một phần → vẫn `Overdue`. |
| **BR-005** | Chỉ hiển thị tin Active; tin boost (`boostExpireAt` còn hạn) xếp trước. Chỉ boost được tin Active. |
| **BR-006** | Trạng thái hợp đồng: `Draft → Active → (Expired/Terminated)`. **Mỗi Room tối đa 1 Contract Active; chặn chồng lấn khoảng thời gian; job tự chuyển `Expired` khi qua `endDate` (+ Notification).** |
| **BR-007** | Dữ liệu SaaS riêng tư tuyệt đối theo `sellerId`; Renter linked chỉ xem dữ liệu của mình; Admin truy cập ghi audit. |
| **BR-008** | Scan hợp đồng & file riêng tư: private bucket + signed URL ≤ 15 phút; chỉ Seller sở hữu + Renter liên quan (Confirmed). |
| **BR-009** | Tin nhu cầu thuê hiển thị 30 ngày → tự `Expired`; gia hạn +30 ngày (không duyệt lại nếu không sửa). |
| **BR-010** | Mỗi Renter tối đa 2 tin Active mỗi loại (tìm phòng / ở ghép). |
| **BR-011** | Không xóa Property còn Room Rented/Deposited hoặc Contract Active; xóa hợp lệ là xóa mềm. |
| **BR-012** | Dashboard: "Số phòng trống" luôn hiện; **"Tổng số phòng", "Số khách đang ở" VÀ "Doanh thu" theo toggle, mặc định TẮT**. Lý do: dashboard tuy riêng tư nhưng chủ trọ hay mở nơi công cộng/chia sẻ màn hình — số nhạy cảm để chủ động bật khi cần. |
| **BR-014** | Hai kênh liên hệ: Nhắn tin (in-app, không lộ SĐT) + Gọi (hiện SĐT khi đăng nhập); Guest thấy SĐT che một phần; không Zalo. |
| **BR-016** | `phoneNumber` duy nhất toàn hệ thống, là kênh OTP và định danh đăng ký; email tùy chọn (thêm ở Profile), nếu có cũng duy nhất. |
| **BR-017** | Nhắc gia hạn gói trước `expireDate` 3 mốc: 6/2/1 tháng (kèm `renewalPrice`); nhắc TRIAL sắp hết trước 7 ngày. |
| **BR-018** | Tin ≥ 3 report chưa xử lý → tự chuyển `PendingApproval` (tạm ẩn) để rà soát. |
| **BR-019** | Chỉ user đăng nhập mới nhắn tin; không tạo hội thoại với tin Expired/Rented/Hidden; mỗi cặp (người khởi tạo, tin) một Conversation. |
| **BR-020** | Chặn & báo cáo trong chat; phạm vi chặn V1 = theo Conversation. |
| **BR-021** | Tax Support chỉ tham khảo; **căn cứ doanh thu = ΣPayment ghi nhận trong năm (cash basis)**; thuế suất/ngưỡng cấu hình (`TaxSetting`), cần kiểm chứng theo quy định từ kỳ tính thuế 2026; luôn hiển thị disclaimer. |

## BR-013 — Đa vai trò & tách Marketplace/Workspace
- Một tài khoản đồng thời Renter & Seller; role **cộng dồn theo hành vi** (cơ chế đầy đủ ở mục 1.8). Đăng tin cho thuê miễn phí, tự kích hoạt Seller. Workspace SaaS sau gating (BR-015). Admin/Moderator nội bộ, tách bạch.

## BR-015 — Gating 4 trạng thái & hết hạn gói
- `UserSubscription.status ∈ {Trial, Active, Expired, Cancelled}` map sang `NONE/TRIAL/ACTIVE/READ_ONLY`. Hạn mức TRIAL lấy từ **plan Trial** (Admin cấu hình). Hết hạn → SaaS read-only, **dữ liệu không mất**; Marketplace & Messaging không ảnh hưởng; gia hạn xong mở quyền ghi ngay. Chạm hạn mức hoặc **over-limit** (gia hạn gói nhỏ hơn dữ liệu hiện có) → chỉ **chặn tạo mới**, không đụng dữ liệu. `Cancelled` chỉ do Admin thao tác (khiếu nại/hoàn tiền). V1 không nâng gói giữa kỳ — đổi gói khi gia hạn.

## BR-022 — Verified review (quyền viết đánh giá)
- Chỉ tài khoản có liên kết Occupancy **`Confirmed`** và **có/từng có `Contract`** tại Property X mới viết được Review cho X.
- **Cấm `authorUserId == property.sellerId`** (chủ khu không tự review khu mình).
- **Điều kiện mở:** Contract đã tồn tại **≥ 30 ngày** HOẶC đã có **≥ 1 `Payment`** ghi nhận trên hợp đồng/phòng đó — nâng chi phí tạo review giả từ "tạo Contract khống là xong" lên "phải duy trì dấu vết vận hành".
- Người ở fallback (`userId` null / chưa Confirmed) không viết được.

## BR-023 — Giới hạn & vòng đời review
- Mỗi `Contract` một review; **sửa được trong 7 ngày** kể từ khi đăng. `Review.status ∈ {Visible, Hidden, Reported}`. Review bị **≥ 3 report** → tự ẩn chờ kiểm duyệt (đồng bộ ngưỡng BR-018).

## BR-024 — Hiển thị review & hồ sơ khu public
- Review lưu gắn `propertyId`; **viết & lưu được bất kể khu bật public hay chưa** — nhưng **chỉ HIỂN THỊ** (badge + trang khu) khi `isPublicProfileEnabled = true`. Tắt public hoặc xóa mềm Property → badge và trang khu ẩn, review giữ trong DB.
- Trang khu public chỉ hiển thị tên khu + khu vực + review + điểm + tin đang cho thuê; **tuyệt đối không** lộ dữ liệu vận hành (BR-007, BR-012).

## BR-025 — Giờ giấc & thời điểm tin
- `RentalListing`/`Room` có `accessPolicy` (Free/Restricted) + `accessOpenTime`/`accessCloseTime`; hiển thị ở chi tiết và làm bộ lọc. Trang chi tiết hiển thị `createdAt`/`updatedAt` dạng tương đối.

## BR-026 — Thời hạn hiển thị & gia hạn tin cho thuê
- Tin cho thuê hiển thị **60 ngày** kể từ `approvedAt` (`expireAt = approvedAt + 60`); quá hạn → job chuyển `Expired`. Gia hạn +60 ngày, không giới hạn số lần, **về thẳng `Active` không cần duyệt lại** nếu không sửa nội dung (sửa trường quan trọng thì theo BR-003).

## BR-027 — Đồng bộ Room ↔ RentalListing (chống tin ảo)
- Với listing có `roomId`: Room chuyển **`Rented`** → hệ thống **tự chuyển listing sang `Rented`** (cùng transaction) + Notification `ListingAutoRented`; Room chuyển **`Deposited`** → Notification gợi ý ẩn tin (1 chạm, không tự động — cọc có thể hủy); Room về `Available` → Seller mở lại tin được.
- **Lý do:** "phòng hết rồi tin vẫn treo" là nỗi đau số 1 sản phẩm tuyên chiến — không thể để chính hệ thống tái tạo nó. Listing không gắn `roomId` (tin tay) không bị ảnh hưởng.

## BR-028 — Khóa tài khoản & tin đăng
- `User.status = Locked` → mọi listing/demand post `Active` của user tự chuyển `Hidden`. Mở khóa → tin KHÔNG tự Active lại (Seller tự mở, tránh tin cũ sai lệch bung ra hàng loạt).

## BR-029 — Liên kết Occupancy cần xác nhận (consent)
- Gắn `userId` vào Occupancy tạo trạng thái `linkStatus = Pending` + Notification cho Renter → `Confirmed` (mở "Phòng của tôi", quyền xem HĐ/hóa đơn, quyền review) hoặc `Rejected` (gỡ `userId`, Occupancy về fallback). Renter đã Confirmed có quyền **tự gỡ liên kết** bất kỳ lúc nào.
- **Lý do:** không ai bị "gắn vào phòng" mà không biết — vừa đúng tinh thần Luật 91/2025, vừa chặn cửa gian lận gắn tài khoản chim mồi để mở quyền review.

## BR-030 — Cấm tự tương tác
- Không tạo `Conversation` với tin của chính mình (self-contact); không review khu của chính mình (đã gộp trong BR-022). Validation ở API.

## BR-031 — Đồng bộ RoomStatus ↔ vòng đời Contract
- Tạo Contract `Active` → Room tự chuyển `Rented` (cùng transaction). Contract kết thúc (`Expired`/`Terminated`) và Room không còn Contract Active nào khác → **gợi ý 1 chạm** chuyển Room `Available` (không tự động — chủ có thể đang dọn/sửa phòng). `Deposited` do Seller set tay (nhận cọc ngoài app), bị thay bằng `Rented` khi có Contract Active.

## BR-032 — Báo cáo vi phạm bắt buộc đăng nhập
- **Quy tắc:** chỉ tài khoản đã đăng nhập mới gửi được `Report` (tin, tin nhắn, đánh giá). Guest thấy nút Báo cáo nhưng bấm vào sẽ được mời đăng nhập kèm `?redirect=`.
- **Lý do:** report ẩn danh mở đường cho spam và cho đối thủ dìm hàng loạt; gắn report với tài khoản cho phép truy vết và xử lý người báo cáo sai sự thật.

## BR-033 — Đề xuất chỉ số điện nước từ người ở
- **Quy tắc:** tính năng bật/tắt theo từng khu (`Property.allowOccupantMeterSubmission`, mặc định **tắt**). Người ở tạo `UtilityReadingSubmission` (số + **ảnh đồng hồ bắt buộc**), trạng thái `Pending/Approved/Rejected`. **Chỉ chủ trọ xác nhận mới sinh `UtilityReading` chính thức**; nếu chủ sửa số thì lưu cả `submittedValue` gốc để đối chiếu.
- **Lý do:** người ở có động cơ khai thấp, nên bằng chứng ảnh + quyền duyệt của chủ trọ là bắt buộc. Đặt ở cấp khu vì một chủ có thể muốn dùng cho khu ở xa, không dùng cho khu gần nhà.

## BR-034 — Phạm vi truy cập của người ở
- **Quy tắc:** người ở chỉ đọc được dữ liệu gắn với `Occupancy` đã `Confirmed` của chính mình (phòng đang ở, hợp đồng của mình, hóa đơn của mình) — không thấy phòng khác, không thấy dữ liệu vận hành của khu. `residencyStatus=PENDING` chưa xem được hóa đơn; `PAST` xem được lịch sử.
- **Khi chủ trọ `READ_ONLY`:** người ở **vẫn xem được** hợp đồng/hóa đơn đã phát hành, nhưng **không tạo mới** sự cố hay đề xuất chỉ số.
- **Lý do:** khóa quyền xem của người ở vì chủ trọ quên gia hạn là vô lý và đẻ ra khiếu nại; còn chặn tạo mới là hợp lý vì chủ trọ đang không thao tác được để xử lý.

## BR-035 — Vòng đời sự cố (Incident)
- **Quy tắc:** `Open → Acknowledged → InProgress → Resolved → Closed`; chỉ Seller sở hữu khu chuyển được trạng thái; người ở xác nhận `Closed` hoặc mở lại về `InProgress`. Mỗi chuyển trạng thái sinh Notification cho phía còn lại. Ảnh đính kèm lưu private, phân quyền như scan hợp đồng (BR-008).

---
