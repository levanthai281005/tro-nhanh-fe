# Màn hình Management Workspace shell

Danh sách màn hình thuộc `app/(workspace)` — khu quản lý của chủ trọ. Lưu ý cột Zone: zone
Tin đăng miễn phí, zone SaaS chịu gating.

---

## MANAGEMENT WORKSPACE SHELL — route gốc `/chu-tro`

> Shell yêu cầu role **Seller** (entry `/chu-tro` mở cho mọi user đăng nhập — là điểm kích hoạt Seller). Chia 2 zone: **Zone Tin đăng** (B4, B5 — miễn phí, KHÔNG gating) và **Zone SaaS** (còn lại — gating BR-015; `READ_ONLY` ẩn/khóa nút ghi, lỗi `WORKSPACE_READ_ONLY`).

| # | Màn hình | Route | Zone | Mô tả | Giai đoạn |
|---|---|---|---|---|---|
| B1 | Entry / Onboarding | `/chu-tro` | — | **2 lối:** "Đăng tin (miễn phí)" → B5; "Dùng thử bộ quản lý" → TRIAL → B2 | V1 |
| B2 | Onboarding wizard 3 bước | `/chu-tro/bat-dau` | SaaS | Property + nhận tiền (VietQR) → Room → (tùy chọn) Occupancy/Contract | V1 |
| B3 | Dashboard Seller | `/chu-tro/tong-quan` | SaaS | Phòng trống (luôn hiện); lấp đầy, doanh thu/tổng phòng/số khách (toggle, mặc định TẮT — BR-012); sắp hết hạn HĐ; chưa thu | MVP (mock) → V1 |
| B4 | Quản lý tin cho thuê | `/tai-khoan/tin-cho-thue` | **Tin đăng** | Tin của tôi; tạo/sửa/boost/gia hạn/xóa | MVP |
| B5 | Đăng tin cho thuê | `/dang-tin-cho-thue` | **Tin đăng** | Form nhiều bước + bước chọn khu (nếu có Property) | MVP |
| B6 | Danh sách khu trọ | `/chu-tro/khu-tro` | SaaS | Danh sách khu + tổng phòng/trống; thêm khu | MVP (mock) → V1 |
| B7 | Chi tiết khu + nhận tiền + public | `/chu-tro/khu-tro/{id}` | SaaS | Sửa khu; STK/VietQR; bật hồ sơ public | V1 |
| B8 | Quản lý phòng | `/chu-tro/khu-tro/{id}/phong` | SaaS | Lưới phòng theo trạng thái; badge "Có tin đang chạy"; "Tạo tin từ phòng" | MVP (mock) → V1 |
| B9 | Chi tiết phòng | `/chu-tro/phong/{id}` | SaaS | Thông tin, người ở hiện tại (nhiều Occupancy), HĐ, hóa đơn gần đây | V1 |
| B10 | Quản lý người ở | `/chu-tro/phong/{id}/nguoi-o` | SaaS | Thêm theo SĐT (linked Pending/Confirmed hoặc fallback), kết thúc ở (endDate), lịch sử | V1 |
| B11 | Hợp đồng | `/chu-tro/hop-dong`, `…/{id}` | SaaS | Tạo HĐ (chặn chồng lấn), upload scan, nhắc hết hạn, chấm dứt | V1 |
| B12 | Điện nước & Hóa đơn | `/chu-tro/hoa-don` | SaaS | UtilityReading → Invoice → xuất kèm VietQR (amount + mã HĐ) → gửi → "Đã thu" | MVP (demo luồng) → V1 |
| B13 | Chi tiết hóa đơn | `/chu-tro/hoa-don/{id}` | SaaS | Dòng hóa đơn, STK/QR, lịch sử thu | V1 |
| B14 | Hỗ trợ thuế | `/chu-tro/thue` | SaaS | Tính GTGT/TNCN ước tính (cash basis), xuất template | V1 (cơ bản) |
| B15 | Gói SaaS của tôi | `/chu-tro/goi-dich-vu` | SaaS* | Xem hạn, dùng thử, mua, gia hạn, trạng thái giao dịch | V1 |
| B16 | Quản lý đánh giá khu | `/chu-tro/danh-gia` | SaaS* | Xem đánh giá khu của mình (phản hồi = V2) | V1 |
| B17 | Hộp thư sự cố | `/chu-tro/su-co`, `…/{id}` | SaaS | Nhận & xử lý `Incident` từ người ở: đổi trạng thái, trao đổi, xem ảnh (BR-035) | V1 |
| B18 | Duyệt chỉ số từ người ở | `/chu-tro/duyet-chi-so` | SaaS | Hàng đợi `UtilityReadingSubmission`: xem ảnh đồng hồ → xác nhận/sửa số/từ chối (BR-033) | V1 |

\* B15/B16 là màn **đọc** — vẫn xem được ở `READ_ONLY` (B15 phải xem được để còn gia hạn).
