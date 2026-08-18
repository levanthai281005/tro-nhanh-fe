# Quy tắc validation dữ liệu

Ràng buộc dữ liệu ở tầng nhập liệu. Dùng khi viết Zod schema trong `packages/schemas`.
Backend luôn kiểm tra lại, nhưng client phải chặn sớm để trải nghiệm tốt.

---

- **SĐT** VN hợp lệ, unique; **email** đúng định dạng nếu có; **mật khẩu** ≥ 8 ký tự.
- **RentalListing:** tiêu đề 10–120 ký tự; giá > 0; ảnh ≥ 3; `accessPolicy=Restricted` bắt buộc `accessOpenTime/CloseTime`; **`propertyId`/`roomId` (nếu có) phải thuộc chính `sellerId`**; nội dung qua lọc `BannedKeyword` khi gửi duyệt.
- **Property:** bật public phải có `name` + `district`; `publicSlug` tự sinh, unique. Nhận tiền: STK chỉ số; `bankAccountName` IN HOA không dấu (VietQR hợp lệ).
- **Room:** `roomCode` unique trong Property; giá ≥ 0; diện tích > 0.
- **UtilityReadingSubmission:** `submittedValue ≥ previousReading` của kỳ trước; **ảnh đồng hồ bắt buộc**; mỗi (room, type, period) chỉ một submission `Pending`.
- **Incident:** tiêu đề 5–120 ký tự; mô tả ≤ 2.000 ký tự; tối đa 5 ảnh; chỉ tạo được khi `residencyStatus=ACTIVE`.
- **Occupancy:** `endDate ≥ startDate` (nếu có); `linkStatus` chỉ có nghĩa khi `userId` khác null.
- **Contract:** `endDate > startDate`; chặn Contract Active thứ hai và chồng lấn thời gian trên cùng Room (409).
- **UtilityReading:** `currentReading ≥ previousReading`; `unitPrice ≥ 0`; unique (roomId, type, period).
- **Invoice:** `period` đúng `YYYY-MM`; tổng = Σ InvoiceItem; unique (contractId, period). VietQR sinh kèm amount + addInfo = mã hóa đơn.
- **Payment:** `amount > 0`; Σ Payment không vượt `totalAmount`.
- **PlatformTransaction:** `idempotencyKey` unique; webhook verify chữ ký gateway; xử lý webhook idempotent (nhận trùng không kích hoạt trùng).
- **Review:** `rating ∈ [1,5]`; `content ≤ 1.000`; `contractId` hợp lệ, thuộc `authorUserId` qua Occupancy Confirmed; không phải chủ khu; đạt điều kiện mở (BR-022); chặn trùng theo `contractId` (BR-023).
- **Conversation:** người khởi tạo ≠ người đăng tin (BR-030); tin ở trạng thái cho phép (BR-019).
- **Subscription:** không TRIAL lần 2; `purchase/renew` kiểm `planId` Active.

---
