# Tổng quan sản phẩm

Hai trụ cột của nền tảng, cơ chế thanh toán, ranh giới hệ thống và các hệ thống ngoài cần
tích hợp. Đây là bối cảnh nền cho mọi quyết định triển khai.

---

## Hai trụ cột của hệ thống

Trọ Nhanh là nền tảng Web/Mobile gồm **hai trụ cột** chạy trên cùng một hệ thống tài khoản và dữ liệu:

**Trụ cột A — Marketplace (đăng tin & tìm kiếm):**
Kết nối nhu cầu thuê và cho thuê bất động sản lưu trú (phòng trọ, căn hộ dịch vụ, căn hộ chung cư). Gồm: tin cho thuê do Seller đăng (`RentalListing`), tin tìm phòng và tin tìm người ở ghép do Renter đăng, cùng tìm kiếm/lọc, yêu thích, **đánh giá khu trọ (verified)**, kiểm duyệt và báo cáo vi phạm. Người dùng liên hệ với người đăng qua **hai kênh: nhắn tin trong app và gọi điện**.

**Trụ cột B — SaaS quản lý vận hành (cho Seller):**
Công cụ quản lý tài sản cho thuê theo cấu trúc hai cấp **Property (khu) → Room (phòng)**. Seller quản lý người ở (`Occupancy`), hợp đồng (`Contract` — lưu scan, không ký điện tử), hóa đơn/chi phí (`Invoice/InvoiceItem`), chỉ số điện nước (`UtilityReading`), ghi nhận thu (`Payment`), nhắc hạn (`Notification`), báo cáo vận hành (Dashboard) và **hỗ trợ thuế (Tax Support)**. Truy cập theo gói SaaS (`UserSubscription`).

Hai trụ cột liên kết qua hành động **"Tạo tin đăng từ phòng trống"** và cơ chế **gắn tin đăng vào khu** (`RentalListing.propertyId`). Room và RentalListing là hai entity độc lập về vòng đời, nhưng có **quy tắc đồng bộ chống tin ảo** (BR-027): phòng đã có người thuê thì tin gắn với phòng đó không được tiếp tục hiển thị như phòng trống.

## Cơ chế thanh toán (nền tảng KHÔNG giữ tiền)

Nền tảng **không cầm, không trung chuyển tiền thuê** giữa người ở và chủ trọ (tránh nghĩa vụ pháp lý của trung gian thanh toán — AS-002). Hai dòng tiền tách bạch bằng **hai entity khác nhau**:

- **Tiền thuê (Renter/người ở → chủ trọ), ngoài nền tảng:** mỗi **Property** lưu thông tin nhận tiền riêng (ngân hàng, STK, tên chủ TK → sinh **VietQR**). Hóa đơn xuất kèm STK + VietQR (QR nhúng **số tiền** và **nội dung chuyển khoản = mã hóa đơn** để chủ trọ đối chiếu tay dễ). Người ở chuyển khoản thẳng hoặc trả tiền mặt; chủ trọ bấm "Đã thu" → ghi bản ghi `Payment` (`Cash`/`BankTransfer`). App chỉ **ghi nhận**, không đối soát ngân hàng (để dành tương lai).
- **Phí nền tảng (Seller → Trọ Nhanh), qua payment gateway:** boost và gói SaaS đi qua VNPay/cổng nội địa, ghi vào entity `PlatformTransaction` (trạng thái `Pending/Success/Failed`, có `idempotencyKey` chống tính phí trùng, kích hoạt quyền lợi **chỉ tại webhook** — mục 4.9).

> **Lý do tách 2 entity:** hai nghiệp vụ khác hẳn nhau — một bên là *ghi chép tay* của chủ trọ (không có gateway, không có trạng thái chờ), một bên là *giao dịch điện tử* (có Pending/Failed, webhook, idempotency). Gộp chung một bảng `Payment` với FK nullable chéo nhau dễ sinh bản ghi "mồ côi" và validation rối.

## Ranh giới hệ thống (System Boundary)

**Trong phạm vi:** 20 module ở Mục 3; web responsive (3 shell) + **app mobile cho người ở**; backend API; database; lưu trữ file (ảnh tin, scan hợp đồng, ảnh sự cố, ảnh chỉ số đồng hồ, file hóa đơn/template thuế); nhắn tin trong app; đánh giá khu trọ; **báo cáo sự cố**; hỗ trợ tính thuế cho thuê cơ bản; hiển thị STK/QR và ghi nhận thanh toán.

**Ngoài phạm vi:** ký hợp đồng điện tử; đặt lịch xem phòng có cấu trúc; cầm/thu hộ tiền thuê và đối soát ngân hàng tự động; eKYC; dịch vụ môi giới; kê khai/nộp thuế chính thức thay người dùng; **tích hợp Zalo** (không nút, không deep link — AS-001).

## Hệ thống ngoài cần tích hợp (External Systems)

| Hệ thống ngoài | Mục đích | Ghi chú |
|---|---|---|
| SMS / Email gateway | OTP; nhắc hạn HĐ/thanh toán/gia hạn gói; báo tin nhắn mới | Bắt buộc cho Notification |
| Map service | Hiển thị vị trí phòng, tính khoảng cách tiện ích | Geocoding địa chỉ khi đăng tin (AS-018) |
| Payment gateway (VNPay/cổng nội địa) | Thu **phí nền tảng** (boost + gói SaaS) từ Seller, qua `PlatformTransaction` + webhook | KHÔNG xử lý tiền thuê (AS-002) |
| Object/Cloud storage | Ảnh tin, scan hợp đồng, file hóa đơn & template thuế | DB chỉ lưu URL; file riêng tư phân quyền |

## Cơ chế liên hệ giữa người dùng

Đúng **hai kênh**: **Nhắn tin** (in-app, không lộ SĐT — kênh khuyến khích) và **Gọi điện** (hiển thị `contactPhone`, chỉ hiện đầy đủ khi đã đăng nhập — BR-014). **Không tích hợp Zalo**; người dùng tự lấy SĐT hiển thị để dùng Zalo bên ngoài nếu muốn. Không được tạo hội thoại với tin của **chính mình** (self-contact, BR-030).
