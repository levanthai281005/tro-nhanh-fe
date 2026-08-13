# Thuật ngữ nghiệp vụ

Từ điển thuật ngữ dùng thống nhất trong toàn bộ mã nguồn và tài liệu. Đọc file này trước
khi làm việc với bất kỳ phần nghiệp vụ nào.

---

| Thuật ngữ | Giải thích ngắn gọn |
|---|---|
| **Marketplace** | Phần "chợ" đăng tin – tìm kiếm – liên hệ giữa người thuê và người cho thuê. Miễn phí cho người thuê. |
| **SaaS / Workspace** | Bộ phần mềm quản lý vận hành phía chủ trọ (khu, phòng, người ở, hợp đồng, hóa đơn, thuế, báo cáo). Trả phí theo gói. |
| **Domain (bounded context)** | Một *vùng nghiệp vụ* có ranh giới rõ, dữ liệu và quy tắc riêng, hạn chế phụ thuộc chéo. Hệ thống có 2 domain + 1 shared kernel. |
| **Shared Kernel** | Nhóm năng lực **dùng chung** cho cả 2 domain (Auth, Profile, Media, Notification, Messaging). |
| **Gating** | Cơ chế *cổng kiểm soát quyền* — quyết định user được vào dùng tính năng nào dựa trên trạng thái gói (đã mua chưa, còn hạn không). |
| **TRIAL (dùng thử)** | Trạng thái cho chủ trọ dùng Workspace **miễn phí có thời hạn** (mặc định 1 tháng) trước khi mua. |
| **Actor / Role** | *Vai trò* của một tài khoản đăng nhập (Guest/Renter/Seller/Admin/Moderator). Role **cộng dồn**, không loại trừ (mục 1.8). |
| **Entity** | Một *bảng dữ liệu* (vd Room, Contract). "Hệ thống lưu cái gì". Entity KHÁC với Role. |
| **Property (Khu trọ)** | Một khu/tòa nhà chứa nhiều phòng — cấp 1 của SaaS. |
| **Room (Phòng)** | Một phòng cụ thể bên trong Property — cấp 2 của SaaS. |
| **Occupancy (Người ở)** | *Bản ghi* "ai đang ở phòng nào" do chủ trọ quản lý. Có thể gắn tài khoản Renter (`userId`) hoặc chưa gắn (chỉ tên + SĐT). Là **entity, không phải role**. |
| **Renter** | *Tài khoản* người đi thuê. Người đang ở nếu có tài khoản chính là một Renter được gắn vào phòng. |
| **Verified review** | Đánh giá *chỉ người ở đã xác thực* (gắn `Contract` + liên kết đã xác nhận) mới được viết — chống review giả. |
| **Soft delete (xóa mềm)** | Đánh dấu đã xóa (ẩn khỏi danh sách) nhưng giữ trong DB để khôi phục/đối chiếu. |
| **Read-only (chỉ đọc)** | Vẫn xem/xuất được dữ liệu nhưng không tạo/sửa/xóa. |
| **Boost (đẩy tin)** | Trả phí để tin đăng được ưu tiên hiển thị. |
| **Zone** | Vùng chức năng bên trong một shell, phân theo điều kiện truy cập (mục 1.6): zone Tin đăng (free) và zone SaaS (gating). |
| **Consent (liên kết Occupancy)** | Việc gắn tài khoản người ở vào phòng phải được chính người đó xác nhận (`linkStatus`: Pending/Confirmed/Rejected) — không ai bị "gắn vào phòng" mà không biết (mục 1.8, BR-029). |
| **Residency** | Module trong domain SaaS phục vụ **người ở**: xem phòng/hóa đơn/hợp đồng của mình, báo sự cố, gửi chỉ số. Có shell web `/nguoi-o/*` và app mobile riêng. |
| **`residencyStatus`** | Trạng thái quan hệ ở trọ của một tài khoản (NONE/PENDING/ACTIVE/PAST), suy từ `Occupancy` — quyết định vào được Residency shell hay không. |
| **Incident** | Báo cáo sự cố do người ở gửi (kèm ảnh), chủ trọ xử lý theo vòng đời trạng thái (BR-035). |
| **Webhook** | Gateway thanh toán gọi ngược về server (server-to-server) để báo kết quả giao dịch — nơi *duy nhất* kích hoạt quyền lợi (boost/gói), vì trình duyệt người dùng có thể đóng tab (mục 4.9). |

---
