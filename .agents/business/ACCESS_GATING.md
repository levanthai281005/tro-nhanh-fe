# Gating truy cập Workspace SaaS

Bốn trạng thái Workspace và luồng chủ trọ mở Workspace lần đầu. Mọi màn hình trong
`app/(workspace)` đều chịu ảnh hưởng của cơ chế này.

---

## Mô hình Gating SaaS — 4 trạng thái & luồng truy cập Workspace

Hệ thống tách bạch **hai khái niệm** để mô hình freemium rõ ràng:

- **Năng lực Seller trên Marketplace** (đăng tin cho thuê, boost, nhắn tin): **miễn phí**, tự kích hoạt (mục 1.8).
- **Workspace quản lý vận hành** (Property/Room/Occupancy/Contract/Invoice…): nằm **sau cổng gating**, vào bằng `TRIAL` hoặc `ACTIVE`.

**Bốn trạng thái Workspace** (suy từ `UserSubscription`; chưa có bản ghi = NONE):

| Trạng thái | Điều kiện | Quyền trong Workspace |
|---|---|---|
| **NONE** | Chưa từng kích hoạt gói/TRIAL | Zone Tin đăng dùng bình thường; zone SaaS chỉ thấy màn mời dùng thử (B1) |
| **TRIAL** | Bấm dùng thử (mỗi Seller 1 lần) | Dùng gần như đầy đủ; hạn mức lấy từ **plan Trial** (mặc định `maxProperties=1`, `maxRooms=5`, `trialDays=30` — Admin cấu hình được) |
| **ACTIVE** | Đã mua, còn hạn | Đầy đủ theo `maxProperties/maxRooms` của gói |
| **READ_ONLY** | Hết hạn TRIAL/ACTIVE | Chỉ xem/xuất; **không** tạo/sửa/xóa (BR-015); **dữ liệu giữ nguyên** |

> **Lý do có TRIAL:** hạ rào cản để chủ trọ trải nghiệm trọn luồng "ghi điện nước → hóa đơn kèm VietQR" trước khi trả tiền. Hết TRIAL không mua → READ_ONLY, **không xóa dữ liệu** (mất dữ liệu vận hành của chủ trọ là tối kỵ).

**Luồng truy cập Workspace (golden path):**
1. Account mặc định là **Renter** → dùng Marketplace.
2. Bấm "Quản lý khu trọ"/"Dashboard chủ trọ" lần đầu → kích hoạt năng lực **Seller** (mục 1.8) → vào Workspace, zone SaaS ở `NONE` → màn B1 có **hai lối rõ ràng**: *"Đăng tin cho thuê (miễn phí)"* và *"Dùng thử bộ quản lý (TRIAL)"* — không ép người chỉ muốn đăng tin phải đi qua màn chào bán.
3. Chọn dùng thử → tạo `UserSubscription` status=`Trial` → **onboarding wizard 3 bước**: (a) tạo Property + thông tin nhận tiền (→ VietQR); (b) thêm Room; (c) (tùy chọn) Occupancy + Contract → Dashboard.
4. Mua/gia hạn gói → luồng thanh toán phí nền tảng (mục 4.9) → `ACTIVE`.
5. Gần hết hạn → Notification nhắc (BR-017). Hết hạn → job tự chuyển `READ_ONLY`; **Marketplace & Messaging KHÔNG bị ảnh hưởng**.
- **Ngoại lệ:** chạm `maxProperties/maxRooms` → chặn tạo mới, gợi ý gia hạn với gói lớn hơn. **Over-limit** (gia hạn gói nhỏ hơn dữ liệu hiện có): giữ nguyên dữ liệu, chỉ **chặn tạo mới** cho tới khi về dưới hạn mức — nhất quán tinh thần "không bao giờ xóa dữ liệu" (BR-015).

**Quan trọng:** gating chỉ khóa **quyền ghi** của các module SaaS. Marketplace (đăng tin, boost, nhắn tin, gọi) **luôn miễn phí và không bị gating**.
