# Surface, Mode và Capability

Tài liệu này trả lời **một** câu hỏi mà trước đây bị rải rác khắp UI: *ai vào được bề mặt nào,
được ghi cái gì, và vào bằng lối nào.* Mọi màn hình trong `app/(public)`, `app/(workspace)`,
`app/(residency)` và toàn bộ app mobile đều tuân theo file này.

> Luật ở đây được **thi hành bằng code**, không phải bằng kỷ luật: `packages/access` là bản
> dịch 1-1 của tài liệu này, kèm test chạy được. UI không bao giờ tự suy quyền.

---

## 1. Ba khái niệm phải tách bạch

| Khái niệm | Là gì | Ai quyết | Sống ở đâu |
|---|---|---|---|
| **Surface** | Bề mặt sản phẩm: `marketplace` · `workspace` · `residency` | Kiến trúc — cố định | Route group / app group |
| **Mode** | Bối cảnh người dùng **đang đứng**: "tôi đang là chủ trọ" / "tôi đang là người ở" | Người dùng chọn, client nhớ | `localStorage` (web) · `SecureStore` (mobile) |
| **Capability** | Được phép gì: `roles[]`, `workspaceStatus`, `residencyStatus`, hạn mức gói | **Server**, suy từ dữ liệu | `GET /me/context` |

### Mode ≠ Role

Đăng nhập là bằng **danh tính** (SĐT + OTP), không bao giờ bằng vai trò. Sau khi đăng nhập,
người dùng chọn **Mode** — đó là chọn bối cảnh làm việc, không phải chọn tài khoản khác.

Vì sao đây là ranh giới quan trọng nhất của tài liệu này:

- Một chủ trọ hoàn toàn có thể đang đi thuê chỗ khác. Nếu vai trò được chọn *lúc đăng nhập*
  thì người đó buộc phải có hai tài khoản, và `residencyStatus` — vốn **suy từ dữ liệu
  Occupancy** — mất chỗ đứng.
- Quyết định đã chốt của dự án: **không có role `Resident`**; người ở vẫn là `Renter`, chỉ
  khác ở `residencyStatus`. Thêm role mới sẽ kéo theo BR-029 (liên kết người ở), BR-022
  (quyền đánh giá) và toàn bộ mô hình định danh.
- `roles[]` là **cộng dồn** (BR-013). Một tài khoản có thể vừa `Renter` vừa `Seller`.

Hệ quả thực hành: **không màn hình nào được hỏi "bạn là ai?"** — chỉ hỏi "bạn muốn vào đâu?",
và câu trả lời bị giới hạn bởi Capability do server trả về.

---

## 2. Ba Surface sở hữu gì

| Surface | Màn hình | Dữ liệu lõi | Shell |
|---|---|---|---|
| **Marketplace** | A1–A14, **B4, B5** | `RentalListing`, `RoomWantedPost`, `RoommateWantedPost`, `Favorite`, `Conversation` | `PublicNavbar` + `AccountShell` |
| **Workspace** | B1–B3, **B6–B18** | `Property`, `Room`, `Occupancy`, `Contract`, `Invoice`, `UtilityReading` | `WorkspaceShell` |
| **Residency** | C1–C10 | Bản đọc của dữ liệu Workspace, giới hạn theo Occupancy đã `Confirmed` | `ResidencyShell` |

### B4/B5 thuộc Marketplace — quyết định đã chốt

`SCREENS_WORKSPACE.md` từng liệt kê B4 (quản lý tin) và B5 (đăng tin) *bên trong* bảng
Workspace shell dưới nhãn "zone Tin đăng miễn phí". Điều đó khiến hai màn bị **hai shell cùng
nhận**, và là nguồn rối trực tiếp cho cả web lẫn mobile.

Chốt: **B4/B5 thuộc Surface Marketplace.** Căn cứ:

- Dữ liệu là `RentalListing` — thuộc bounded context Marketplace, không phải Property
  Management.
- Route đã là `/tai-khoan/tin-cho-thue` và `/dang-tin-cho-thue`, **không** có tiền tố
  `/chu-tro`.
- Đăng tin **miễn phí và không chịu gating** (BR-015). Đặt nó trong shell mà cả shell nằm sau
  cổng gating là mâu thuẫn tự thân.
- Khi Workspace tách sang subdomain riêng (mục 5), một màn thuộc hai shell sẽ thành lỗi thật
  chứ không còn là chuyện thẩm mỹ.

Shell Workspace **được phép link sang** B4/B5, nhưng phải là link **cross-surface có nhãn rõ**,
không phải một mục lẫn trong sidebar như thể nó là màn SaaS.

### Luật crossing giữa Surface

> Hai Surface chỉ gặp nhau qua **URL / deeplink**. Không bao giờ qua `import`.

- ESLint đã chặn `features/marketplace ↔ workspace ↔ residency` ở mức `error`.
- Cần dữ liệu của Surface khác → gọi API của Surface đó qua service của **chính mình**, hoặc
  điều hướng bằng URL.
- Ngoại lệ duy nhất được phép chia sẻ: `packages/access`, `packages/types`,
  `packages/schemas`, `packages/constants`, `packages/utils`, `components/ui`.

---

## 3. Bảng quyết định — vào được đâu

Đầu vào là `SessionContext` từ `GET /me/context`. `packages/access` encode đúng bảng này.

### 3.1 Vào được Surface nào (`canEnterSurface`)

| Surface | Điều kiện vào | Không đạt thì |
|---|---|---|
| `marketplace` | Luôn luôn — kể cả khách chưa đăng nhập | — |
| `workspace` | Đã đăng nhập | → `/dang-nhap?next=…` |
| `residency` | Đã đăng nhập **và** `residencyStatus ≠ NONE` | → màn hướng dẫn C0 |

Vào được `workspace` **không** đồng nghĩa dùng được zone SaaS — xem 3.2. Entry `/chu-tro` cố ý
mở cho mọi tài khoản đã đăng nhập vì đó chính là **điểm kích hoạt năng lực Seller**.

### 3.2 Zone SaaS trong Workspace (`workspaceStatus`)

| `workspaceStatus` | Đọc màn SaaS | Ghi | Hành vi UI |
|---|---|---|---|
| `NONE` | ✗ | ✗ | Chuyển về B1, hiện hai lối: "Đăng tin (miễn phí)" và "Dùng thử bộ quản lý" |
| `TRIAL` | ✓ | ✓ (trong hạn mức plan Trial) | Banner còn N ngày dùng thử |
| `ACTIVE` | ✓ | ✓ (trong hạn mức gói) | Không banner |
| `READ_ONLY` | ✓ | ✗ | Banner đỏ; mọi nút ghi bị khóa kèm lý do; **dữ liệu giữ nguyên** (BR-015) |

Hai màn **luôn đọc được** kể cả `READ_ONLY`: **B15** (gói dịch vụ — phải vào được thì mới gia
hạn nổi) và **B16** (đánh giá khu).

### 3.3 Residency (`residencyStatus`)

| `residencyStatus` | Vào Residency | Ghi chú |
|---|---|---|
| `NONE` | ✗ | Màn hướng dẫn "bạn chưa được liên kết vào phòng nào" |
| `PENDING` | Một phần | **Chỉ** màn xác nhận liên kết (C2); chưa xem được hóa đơn (BR-029) |
| `ACTIVE` | ✓ | Đầy đủ |
| `PAST` | Chỉ đọc | Xem lịch sử; **vẫn viết được đánh giá** khu từng ở (BR-022) |

### 3.4 Hạn mức gói (`isWithinLimit`)

Chạm `maxProperties` / `maxRooms` → **chặn tạo mới**, gợi ý gói lớn hơn. Over-limit (gia hạn
xuống gói nhỏ hơn dữ liệu hiện có) → **giữ nguyên dữ liệu**, chỉ chặn tạo mới cho tới khi về
dưới hạn mức. Nhất quán tinh thần "không bao giờ xóa dữ liệu chủ trọ" của BR-015.

### 3.5 Surface mặc định (`resolveDefaultSurface`)

Khi người dùng vào app mà chưa chọn Mode, thứ tự ưu tiên:

1. `residencyStatus ∈ {PENDING, ACTIVE}` → `residency` — có việc cần làm ngay (xác nhận liên
   kết, hóa đơn tới hạn)
2. `roles` có `Seller` **và** `workspaceStatus ∈ {TRIAL, ACTIVE, READ_ONLY}` → `workspace`
3. còn lại → `marketplace`

Đây chỉ là **gợi ý mặc định**. Mode người dùng đã chọn thủ công luôn thắng, trừ khi Mode đó
không còn vào được (ví dụ hết hạn ở trọ → `PAST`) thì rơi về bảng trên.

---

## 4. Lối vào và lối ra của mỗi Surface

| Từ → Đến | Lối |
|---|---|
| Marketplace → Workspace | Menu tài khoản → "Quản lý khu trọ" |
| Marketplace → Residency | Menu tài khoản → "Phòng của tôi"; hoặc Notification `OccupancyLinked` |
| Workspace → Marketplace | Sidebar, mục cuối: "← Về Trọ Nhanh" và "Tin đăng của tôi" (**cross-surface, có nhãn**) |
| Residency → Marketplace | Tab cuối cùng ở bottom bar |
| Bất kỳ → `/dang-nhap` | Guard, kèm `?next=` để quay lại đúng chỗ |

**Không** có lối tắt ngầm giữa Workspace và Residency. Chủ trọ muốn xem góc nhìn người ở phải
đi vòng qua Marketplace — hai Surface này có mô hình dữ liệu đối xứng nhau và trộn lối đi sẽ
sinh nhầm lẫn quyền.

---

## 5. Web — chiến lược URL và mốc tách subdomain

**Hiện tại:** một app Next.js, ba route group.

```
tronhanh.vn/            (public)     → Marketplace
tronhanh.vn/chu-tro/*   (workspace)  → Workspace
tronhanh.vn/nguoi-o/*   (residency)  → Residency
```

**Đích:** Workspace tách thành `apps/workspace` deploy ở `quanly.tronhanh.vn`. Lý do: hai bề
mặt có chiến lược render ngược nhau — Marketplace cần SSR/ISR cho Google index, Workspace phải
`noindex` và động 100%; ép chung một `next.config`, một middleware, một chiến lược cache là kéo
nhau xuống. Thêm nữa, hai app khác nhau khiến luật cấm import chéo được **compiler** thi hành.

**Mốc tách: cùng nhánh với A7 (đăng nhập/OTP).** Nội dung kỹ thuật thật của việc tách gần như
toàn bộ là **session dùng chung giữa các subdomain** (cookie scope `.tronhanh.vn`, refresh
token, CSRF). Tách trước khi có A7 nghĩa là thiết kế SSO trong mù rồi làm lại.

Điều kiện để lúc đó việc tách chỉ là **di chuyển file**, không phải refactor:

- [x] `packages/access` giữ toàn bộ luật truy cập, không phụ thuộc framework
- [x] ESLint chặn import chéo giữa ba feature domain ở mức `error`
- [x] `(workspace)` có root layout + provider riêng, không dùng ké của `(public)`
- [x] `(workspace)` khai báo `robots: noindex`
- [ ] A7 xong → cookie `.tronhanh.vn`, rồi mới lift `apps/workspace`

---

## 6. Mobile — một app, hai Mode

**Một app Expo, không phải hai.** Cùng một người thường vừa là chủ trọ vừa đi thuê; hai app là
hai store listing, hai bộ push token, hai luồng auth, gấp đôi chi phí phát hành cho V1. Mô hình
tham chiếu là Airbnb ("Switch to hosting"), không phải Grab — tài xế và khách Grab không bao
giờ là một người, còn ở đây thì có.

```
apps/mobile/src/app/
├── (auth)/         đăng nhập SĐT + OTP — KHÔNG hỏi vai trò ở màn này
├── (mode-select)/  chọn Mode sau đăng nhập; Mode chưa mở hiện lối kích hoạt
├── (workspace)/    mirror Surface Workspace
└── (residency)/    mirror Surface Residency
```

- Root layout gọi đúng `packages/access` như web — luật viết một lần, dùng hai nơi.
- Mode lưu ở `SecureStore`; lần sau mở app vào thẳng Mode cũ; đổi Mode ở màn Hồ sơ.
- Mode chưa mở **vẫn hiện** nhưng ở trạng thái mời kích hoạt, không ẩn đi — ẩn khiến người
  dùng tưởng app thiếu tính năng.
- Deeplink mang theo Surface: `tronhanh://workspace/khu-tro/{id}/phong` — mở app, kiểm
  Capability, chuyển Mode nếu cần, rồi mới điều hướng.

**Khi nào tách hai app:** nếu bộ vận hành chủ trọ phình to (hóa đơn, chỉ số, hợp đồng) trong
khi app người ở vẫn nhẹ, và hai bên lệch nhịp phát hành. Lúc đó chỉ là dựng vỏ app thứ hai đọc
lại cùng `packages/access` — không đụng nghiệp vụ.

---

## 7. Hợp đồng với backend

Một endpoint duy nhất, gọi một lần khi khởi động app và sau mỗi mutation đổi quyền
(mua gói, kích hoạt trial, được liên kết vào phòng):

```
GET /me/context
```

```jsonc
{
  "userId": "…",
  "roles": ["Renter", "Seller"],
  "workspaceStatus": "TRIAL",
  "residencyStatus": "NONE",
  "limits": { "maxProperties": 3, "maxRooms": 20 },
  "trialEndsAt": "2026-09-16T00:00:00.000Z",
  "subscriptionExpiresAt": null
}
```

Vì sao gộp một endpoint thay vì client tự ghép từ nhiều nguồn: `workspaceStatus` là **giá trị
suy ra** từ `UserSubscription` (hết hạn → `READ_ONLY`), `residencyStatus` suy từ `Occupancy`.
Để client tự suy nghĩa là luật gating tồn tại hai bản, và bản ở client thì người dùng sửa được.

> **Guard ở client chỉ là UX.** Biên bảo mật thật nằm ở backend: mọi endpoint ghi của module
> SaaS phải tự kiểm `workspaceStatus` và trả `WORKSPACE_READ_ONLY`, kể cả khi UI đã khóa nút.

---

## 8. Áp dụng khi viết code

- Không component nào được viết `status === 'READ_ONLY'` hay `roles.includes('Seller')`. Dùng
  `canWrite()`, `canEnterSurface()` từ `packages/access`.
- Thêm một luật truy cập mới → sửa **tài liệu này** trước, rồi `packages/access` + test, rồi
  mới tới UI.
- Thêm màn hình mới → ghi rõ nó thuộc Surface nào ngay trong PR; màn không thuộc Surface nào là
  dấu hiệu thiết kế sai.
