# Đề xuất gửi backend

Những chỗ frontend cần dữ liệu mà `DATA_ENTITIES.md` hiện chưa có cột, phát hiện trong lúc
rebuild. **Chưa cái nào được chốt** — đây là đề xuất kèm lý do để bàn với team backend, không
phải quyết định đã duyệt.

Nguyên tắc chung khi xử lý: frontend **không tự thêm cột, không tự sửa `DATA_ENTITIES.md`**,
và tuyệt đối **không nhồi dữ liệu vào trường văn bản** (prototype từng nối JSON vào cuối
`description` — cách đó biến mô tả vừa là nội dung cho người đọc vừa là kho dữ liệu, và đã bị
loại khi port). Trong lúc chờ, các trường này nằm ở type mở rộng riêng, đánh dấu `PROPOSAL:`
ngay tại chỗ khai báo.

---

## 1. Địa chỉ hành chính — quan trọng nhất, ảnh hưởng tìm kiếm

**Hiện tại:** `RentalListing` chỉ có `address` và `district` (một chuỗi tên). Không có mã.

**Vấn đề:**

- Lọc theo khu vực đang là **so sánh chuỗi**. Lệch một ký tự ("Phường Tân Hưng" vs
  "P. Tân Hưng") là mất kết quả.
- Đợt sáp nhập 01/07/2025 đã **bỏ hẳn cấp quận/huyện**. Chỉ lưu tên thì sau lần đổi địa giới
  tiếp theo, tin cũ mang tên đã khai tử và **không có mã để tra ngược** ra đơn vị mới.
- Tên cột `district` đang chứa tên **phường** — sai về nghiệp vụ, gây hiểu nhầm lâu dài cho
  mọi bên tiêu thụ API.

**Đề xuất:**

| Cột | Thay đổi | Lý do |
|---|---|---|
| `provinceCode` (int) | **thêm** | Mã tỉnh/thành, chuẩn Tổng cục Thống kê |
| `wardCode` (int) | **thêm** | Mã phường/xã; dùng để lọc, gom nhóm, đánh index |
| `district` → `wardName` | **đổi tên** | Cấp quận/huyện không còn tồn tại; giữ tên cũ là sai nghiệp vụ |
| `address` | giữ | Chỉ phần số nhà/đường, không lặp lại phường/tỉnh |

Mã và tên trả lời hai câu hỏi khác nhau nên phải lưu **cả hai**: mã cho biết "đơn vị hành
chính nào, một cách chuẩn xác" (tra được sau khi đổi địa giới); tên là **ảnh chụp tại thời
điểm đăng** để hiển thị đúng lịch sử.

**Dùng mã Tổng cục Thống kê, không tự đánh ID mới.** Đây là mã chuẩn quốc gia, mọi nguồn công
khai đều theo. Tự đánh số riêng nghĩa là nhận việc duy trì một bảng ánh xạ vĩnh viễn.

### 1.1 Tên phường phải do backend suy ra, không nhận từ client

Client chỉ gửi `provinceCode` + `wardCode` + `address`. Backend tra tên từ danh mục của mình
rồi mới ghi vào `wardName`, đồng thời kiểm mã phường có tồn tại và có thuộc đúng tỉnh không.

Theo đúng nguyên tắc đã ghi trong `AGENTS.md`: *giá trị suy được thì derive server-side,
không nhận từ client*. Nếu client gửi kèm tên, người ta có thể gửi `wardCode` của một khu rẻ
nhưng `wardName` của khu đắt để lọt vào kết quả tìm kiếm sai — suy ở server thì bịt hẳn.

### 1.2 Danh mục hành chính nên do backend phục vụ

Hiện client dùng file tĩnh (34 tỉnh, 3.321 phường; sinh từ `provinces.open-api.vn`, chốt ngày
2026-08-08) đặt ở `packages/constants/src/vn/`.

Backend **buộc phải** có danh mục này để kiểm dữ liệu ghi vào. Đã có sẵn ở backend rồi thì để
client giữ bản thứ hai là tự tạo rủi ro hai bên lệch nhau — người dùng chọn được phường mà
backend từ chối.

**Đề xuất:** một endpoint trả toàn bộ danh mục kèm `ETag` và cache dài hạn. Client gọi một
lần, lần sau trình duyệt trả từ cache — vẫn giữ được ưu điểm không chờ mạng mỗi lần mở
dropdown.

Phía client đã sẵn đường chuyển: mọi nơi đi qua đúng một hàm `loadVnWards()`, đổi nguồn chỉ
sửa ruột hàm đó.

---

## 2. Bản đồ vị trí

**Thiếu:** `latitude`, `longitude` trên `RentalListing`; và danh sách tiện ích xung quanh
(`nearbyPlaces`: nhóm, tên địa điểm, khoảng cách).

`ASSUMPTIONS.md` **AS-018** đã dự trù *"map dùng bên thứ ba; geocoding khi đăng tin"* — tức
toạ độ vốn nằm trong kế hoạch, chỉ chưa có cột. Toạ độ nên sinh bằng geocoding từ địa chỉ lúc
đăng, không bắt người dùng nhập tay.

---

## 3. Thông tin phòng và chi phí

**Thiếu trên `RentalListing`:**

| Trường | Kiểu | Vì sao cần |
|---|---|---|
| `maxOccupants` | int, null | Nhiều chủ trọ có quy định số người tối đa; người thuê cần biết trước khi liên hệ |
| `waterPricingUnit` | enum `PerPerson` / `PerCubicMeter` | **"100.000đ" vô nghĩa nếu thiếu đơn vị** — theo người hay theo khối là hai con số hoàn toàn khác |
| `otherFees` | danh sách `{ name, amount }` | Phí dịch vụ, rác, mạng… tuỳ khu; không ép nhập, nhưng có thì phải hiện minh bạch |

Ba trường này đang là thứ prototype nhồi vào `description` bằng marker `---METADATA---`.

---

## 4. Số liệu hiệu quả tin đăng

**Thiếu:** số lượt xem tin.

Trang quản lý tin của chủ trọ ở prototype hiển thị "Tổng lượt xem" và "Tổng liên hệ" nhưng
`RentalListing` không có trường đếm nào — bản prototype **điền số cứng**. Bản rebuild đã bỏ
hai ô đó thay vì hiện số không có nguồn.

- **Lượt liên hệ** suy được từ entity `ContactEvent` đã có — chỉ cần endpoint tổng hợp.
- **Lượt xem** thì chưa có chỗ nào ghi; cần quyết định có làm không (cột đếm trên
  `RentalListing`, hoặc bảng sự kiện riêng nếu muốn phân tích theo thời gian).

---

## Thứ tự ưu tiên đề nghị

1. **Mục 1** — chặn được lỗi dữ liệu vĩnh viễn; càng có dữ liệu thật càng khó sửa.
2. **Mục 3** — ảnh hưởng trực tiếp chất lượng tin đăng, người thuê cần để so sánh.
3. **Mục 2** — có thể làm sau, giao diện đã sẵn sàng nhận toạ độ.
4. **Mục 4** — tính năng phụ trợ cho người bán, không chặn luồng chính.
