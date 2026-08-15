# Actor và ma trận phân quyền

Năm actor của hệ thống, quyền hạn từng actor và pipeline kiểm tra quyền ở tầng API.
Dùng khi quyết định ẩn/hiện chức năng và khi xử lý lỗi 403.

---

> Chỉ có **5 actor (role)**. "Người ở trọ" KHÔNG phải role — có tài khoản thì là **Renter** được gắn vào phòng; chưa có thì là bản ghi **Occupancy** do chủ trọ quản lý.

| Actor | Mô tả | Quyền chính |
|---|---|---|
| **Guest** | Khách chưa đăng nhập | Xem tin public, tìm kiếm/lọc, xem chi tiết, xem đánh giá khu, xem SĐT che một phần (BR-014), đăng ký/đăng nhập. **Không** nhắn tin, lưu tin, đăng tin, và **không báo cáo tin** (bắt buộc đăng nhập — chống spam và dìm hàng hàng loạt, BR-032) |
| **Renter** | Người dùng đã đăng nhập (mặc định mọi tài khoản) | Quyền Guest + nhắn tin/gọi người đăng, lưu tin yêu thích, đăng/quản lý tin tìm phòng & ở ghép, nhận gợi ý phòng, báo cáo vi phạm. Nếu được gắn vào phòng (liên kết **đã xác nhận** — BR-029, `residencyStatus=ACTIVE`) → vào Residency shell/app: xem tổng quan phòng, xem HĐ & hóa đơn, nhận thông báo, **gửi báo cáo sự cố**, **gửi chỉ số điện nước kèm ảnh** (nếu khu bật tính năng); viết đánh giá khu đã ở |
| **Seller** | Người đăng & quản lý tin cho thuê — Chủ BĐS hoặc người được ủy quyền (cò trọ). Nền tảng không môi giới | Đăng & quản lý `RentalListing`; boost; nhắn tin; (qua gating) quản lý Property/Room/Occupancy/Contract/Invoice/UtilityReading/Payment; thông tin nhận tiền theo khu; công cụ thuế; dashboard; gói SaaS của mình |
| **Admin** | Quản trị hệ thống | Quản lý user, tin, danh mục (loại phòng, tiện ích, khu vực, khoảng giá, gói, cấu hình thuế, **từ khóa cấm**, **cấu hình boost**), báo cáo/khiếu nại, kiểm duyệt đánh giá, gói SaaS, dashboard tổng quan |
| **Moderator/Staff** | Nhân viên vận hành | Kiểm duyệt tin, xử lý báo cáo (tin, tin nhắn, đánh giá), khóa hội thoại, hỗ trợ khách. Không quản lý user/danh mục/gói |

Một tài khoản có thể đồng thời là **Renter** và **Seller** (BR-013, cơ chế ở 1.8). Admin/Moderator là tài khoản nội bộ, không kiêm Renter/Seller (separation of duties).

**Renter vs Occupancy (chống nhầm lẫn):**

| | Renter | Occupancy (người ở) |
|---|---|---|
| Là gì | Một **role/tài khoản** đăng nhập | Một **bản ghi dữ liệu** do Seller tạo |
| Ai tạo | Tự đăng ký | Chủ trọ nhập khi gán người vào phòng |
| Cần tài khoản? | Có | Không bắt buộc — có thể chỉ tên + SĐT |
| Thuộc về | Chính người dùng | Seller sở hữu (BR-007) |
| Liên kết | — | `userId` (nullable) + `linkStatus` (Pending/Confirmed/Rejected — BR-029) |

**Ba tầng trực giao — minh họa bằng người dùng thật:**

| Người dùng | roles | workspaceStatus | residencyStatus | Vào được |
|---|---|---|---|---|
| Sinh viên đang tìm phòng | Renter | NONE | NONE | Marketplace |
| Sinh viên đã thuê qua nền tảng | Renter | NONE | ACTIVE | Marketplace + Residency |
| Cò trọ đăng tin hộ | Renter, Seller | NONE | NONE | Marketplace + zone Tin đăng |
| Chủ trọ đang dùng SaaS | Renter, Seller | ACTIVE | NONE | Marketplace + Workspace đầy đủ |
| Chủ trọ đang đi thuê nhà nơi khác | Renter, Seller | ACTIVE | ACTIVE | Cả ba shell |

Dòng cuối là lý do không tạo role "Resident": người đó không đổi loại tài khoản, chỉ là đồng thời có một Occupancy đã xác nhận.

---

## PHÂN QUYỀN (RBAC)

| Nhóm endpoint | Guest | Renter | Seller | Moderator | Admin |
|---|---|---|---|---|---|
| Xem tin / tìm kiếm / xem review | ✓ | ✓ | ✓ | ✓ | ✓ |
| Nhắn tin, lưu tin, đăng tin nhu cầu | – | ✓ | ✓ | – | – |
| Báo cáo vi phạm (tin/tin nhắn/review) | – | ✓ | ✓ | – | – |
| Viết review (verified) | – | ✓¹ | ✓¹ | – | – |
| Đăng/quản lý tin cho thuê, boost | – | –³ | ✓ | – | – |
| Workspace SaaS (Property…Tax) | – | – | ✓² | – | – |
| Residency (phòng của tôi, sự cố, gửi chỉ số) | – | ✓⁴ | ✓⁴ | – | – |
| Kiểm duyệt tin / report / review, khóa hội thoại | – | – | – | ✓ | ✓ |
| Quản lý user / danh mục / gói / cấu hình | – | – | – | – | ✓ |

¹ Chỉ khi liên kết `Confirmed` + có `Contract` tại Property + không phải chủ khu + đạt điều kiện mở (BR-022). ² Chỉ khi `TRIAL`/`ACTIVE`; `READ_ONLY` chỉ đọc (BR-015). ³ Renter tạo listing đầu tiên → tự nhận role Seller ngay trong request đó (1.8). ⁴ Chỉ khi `residencyStatus ∈ {ACTIVE, PAST}`; `PAST` chỉ đọc lịch sử; gửi chỉ số còn cần khu bật `allowOccupantMeterSubmission` (BR-033). Mọi truy cập dữ liệu SaaS lọc theo `sellerId` (BR-007); dữ liệu Residency lọc theo `Occupancy.userId` của chính người gọi (BR-034); Admin truy cập ghi audit.

**Pipeline kiểm tra endpoint SaaS (thứ tự):** token hợp lệ → role Seller (claims) → ownership `sellerId` (BR-007) → gating `workspaceStatus` (DB).

**Pipeline kiểm tra endpoint Residency:** token hợp lệ → `residencyStatus` (DB) → ownership: bản ghi truy cập phải thuộc một `Occupancy` có `userId` = người gọi và `linkStatus=Confirmed` (BR-034).

---
