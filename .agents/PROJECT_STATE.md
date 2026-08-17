# Trạng thái dự án

**File sống — cập nhật sau mỗi nhánh hoàn thành.** Agent đọc file này đầu tiên để biết đang
ở đâu, tránh làm lại việc đã xong hoặc làm nhầm thứ tự.

Cập nhật lần cuối: sau khi hoàn thành nhánh port `SavedListingsPage` (trang chuẩn vàng).

---

## Bố cục thư mục trên máy

```
rebuild_tronhanh-fe/
├── tro-nhanh-fe/     ← repo này (frontend monorepo)
└── prototype/        ← bản demo cũ, CHỈ ĐỌC, chạy được để đối chiếu
```

Backend nằm ở repo riêng `tro-nhanh-api` (Java Spring Boot 4.1, Java 21, Maven).

## Stack đã chốt

| Phần | Công nghệ |
|---|---|
| Web | Next.js App Router, TypeScript, Tailwind **v3** (bắt buộc), shadcn/ui, Lucide |
| Mobile | Expo + React Native, Expo Router, NativeWind (chưa dựng) |
| Dùng chung | pnpm workspace, Turborepo, Zod, TanStack Query, Zustand, React Hook Form, Axios |
| Contract | OpenAPI — backend sinh `openapi.json`, client codegen ra `packages/types` |

## Chiến lược nhánh

`dev` là nhánh chính. Việc rebuild đi qua một nhánh tích hợp riêng:

```
dev
 └── feat/rebuild                    ← nhánh tích hợp, PR về dev khi xong
      ├── feat/design-tokens         ✅ xong
      ├── feat/ui-primitives         ← đang tới
      ├── feat/port-<tên-trang>      ← mỗi trang một nhánh
      └── ...
```

Nhánh con luôn tách từ và merge về `feat/rebuild`, **không phải `dev`**. Đồng bộ
`feat/rebuild` với `dev` mỗi tuần để tránh conflict dồn về cuối. Nhánh không sống quá hai
ngày — cần lâu hơn thì chia nhỏ.

---

## Tiến độ

### Đã xong

- [x] Khởi tạo monorepo: `apps/web`, `apps/mobile`, `packages/*`, Turborepo, CI
- [x] Ba route group `(public)`, `(workspace)`, `(residency)` đã dựng khung
- [x] Nạp `.agents/` — business, rules, tasks, skills
- [x] `feat/design-tokens` — `packages/config/tailwind-preset.js` với 18 token màu, đè
      `borderRadius`, font Be Vietnam Pro; `globals.css` cú pháp v3; ESLint rule
      `tailwindcss/no-custom-classname` ở mức `error`
- [x] `feat/ui-primitives` (PR #2) — port bộ component chung và `StyleGuidePage`
      - Component: `Button`, `Badge`, `Card`, `Table`, `Pagination`, `Toast`, `EmptyState`,
        `Skeleton`, `AppSelect`, `ModalShell`, `BottomTabBar`, `PublicNavbar*`,
        `WorkspaceShell`, `AccountShell` — tất cả ở `apps/web/src/components/{ui,navigation,
        shells}/`
      - Token màu mở rộng dạng nested (`DEFAULT/hover/press/soft`) trong
        `packages/config/tailwind-preset.js`
      - **Cổng nghiệm thu đã đạt:** StyleGuide bản mới (`/styleguide`) khớp bản prototype
- [x] Trang chuẩn vàng — `feat/port-saved-listings` (PR #3), route `/tai-khoan/da-luu`
      - Xác lập cấu trúc mẫu: `app/(public)/tai-khoan/da-luu/page.tsx` (Server Component,
        prefetch + `HydrationBoundary`) + `features/marketplace/{components,hooks,services,
        types,constants}/` — **mọi trang sau làm theo đúng cấu trúc này**
      - Quy ước đã chốt ở đây, áp dụng tiếp cho các trang sau: query-key registry cục bộ
        theo feature; mock data local + `// TODO: nối API thật khi packages/types sinh xong`
        (vì `packages/types/src/api.ts` vẫn là stub rỗng, backend chưa sinh OpenAPI); auth
        chưa có `AuthContext` → dùng `MOCK_RENTER_ID` + `// TODO: nối AuthContext khi có`;
        responsive dùng Tailwind `md:` thuần, **không** port `useBreakpoint()` của prototype
        (JS đọc `window.innerWidth`, gây lệch SSR/hydration — đi ngược lý do chọn Next.js)
- [x] `fix/navbar-post-menu-order` (PR #6) — đổi thứ tự 2 mục trong menu Đăng tin, sửa route
      `/dang-tin-cho-thue` → `/chu-tro/dang-tin`
- [x] `feat/port-homepage` (PR #7) — route `/`, section theo đúng cấu trúc prototype
      (`Hero`, `FeaturedRooms`, `MarketplaceSections`, `WhyUs`, `PostingCTA`, `LandlordCTA`,
      `Footer`). Sửa thêm 3 route chết phát hiện khi port: `/search` → `/tim-phong`,
      `/tin-nhu-cau` → `/tin-tim-phong`/`/tin-o-ghep` theo tab. Bỏ `DemoBanner`/`DemoFAB` theo
      quyết định đã duyệt — chưa có khái niệm "chế độ demo" ở repo mới.
- [x] `feat/port-search-results` (PR #8) — route `/tim-phong`, **hợp nhất** hai file
      prototype trùng lặp (`SearchResultsPage` 836 dòng + `AllListingsPage` 878 dòng) thành
      một page, lấy `AllListingsPage` làm nền (pagination/sort/view toggle đủ hơn), cấy khả
      năng đọc `loc/type/price` từ query string của `SearchResultsPage`. Sửa 3 bug thật phát
      hiện khi đọc code prototype: sort diện tích dùng sai giá trị (`area` → `area-desc`),
      lọc kép client-side (bỏ), bộ lọc "Trạng thái" UI chết (bỏ hẳn — Room.status là khái
      niệm SaaS nội bộ, không thuộc bộ lọc Marketplace công khai theo A2). Thu
      `PROPERTY_TYPES` từ 5 nhãn UI về đúng 3 giá trị enum thật (`BoardingRoom/
      ServicedApartment/Apartment`) — sửa luôn selector ở Home vì cùng nguồn catalog. Chuyển
      `RoomCard` lên `features/marketplace/components/` (top-level, dùng chung Home + Search).
      Chưa có bản đồ thật — giữ `MapPlaceholder`, chưa có tọa độ trong entity lẫn thư viện
      map nào trong repo.

- [x] `feat/port-room-detail` (PR #9) — route `/phong/[id]`, 17 component tách theo
      `features/marketplace/components/detail/`. Viết mới nút Báo cáo (BR-032, prototype
      không có sẵn), `PhoneModal` theo BR-014, `ReviewsSection` chỉ render rỗng (badge điểm
      khu để V1, đúng `SCREENS_PUBLIC.md` A3). Không port cơ chế parse giờ giấc từ text mô tả
      — đọc thẳng `accessPolicy`/`accessOpenTime`/`accessCloseTime` (BR-025). Bổ sung sau khi
      xem lại cùng prototype: bản đồ vị trí + tiện ích xung quanh thật (Leaflet/react-leaflet,
      bọc qua `ListingLocationMap`/`LeafletMap` — chỉ 1 file chạm thẳng thư viện, để đổi
      provider sau này không phải sửa nhiều nơi), và `SiteFooter` dùng chung cho cả Home lẫn
      Detail (prototype thiếu Footer ở trang Detail).

- [x] Luồng đăng tin — `QuanLyPage` (B4, PR #11) và `DangTinPage` (B5, PR #13).
      - B4 `/tai-khoan/tin-cho-thue`: KPI, bộ lọc, bảng + card, ẩn/hiện, xóa, đẩy tin, và
        **gia hạn tin viết mới** theo BR-026 (prototype không có).
      - B5 `/dang-tin-cho-thue`: chia lại 4 bước theo công sức thay vì theo chủ đề; tự lưu
        nháp xuống máy để cứu khi mất mạng/sập nguồn; ảnh tải lên ngay khi chọn; điện/nước
        bắt buộc nói rõ nhưng có lối thoát "theo giá nhà nước"/"theo hóa đơn".
      - Thêm `packages/schemas` (ràng buộc thực thể) và `packages/constants/vn` (34 tỉnh,
        3.321 phường, nạp lười qua `loadVnWards()`).
- [x] `fix/navbar-breakpoint-overflow` (PR #12) — navbar desktop bật từ `md` (768px) nhưng
      cần ~1119px nên toàn site cuộn ngang ở 768–1119px. Đổi mốc sang `lg` + thu gọn cụm phải.

- [x] **Nền Surface + B6/B8** — `feat/workspace-surface-rooms`
      - `.agents/business/SURFACES_AND_MODES.md` — **đọc file này trước khi làm bất kỳ màn nào
        có gating**. Ba khái niệm tách bạch: Surface (marketplace/workspace/residency), Mode
        (bối cảnh người dùng đang đứng), Capability (server quyết). **Mode ≠ Role** — app
        mobile "chọn vai trò" là chọn Mode sau khi đăng nhập, không đẻ role mới.
      - `packages/access` — luật truy cập viết **một lần**, dùng chung web + mobile, 26 test
        encode nguyên bảng quyết định. UI không bao giờ được viết `status === 'READ_ONLY'`
        hay `roles.includes('Seller')`; hỏi qua `canWriteInSurface()`/`getSurfaceDenial()`.
      - `features/session` (Shared Kernel, cả ba Surface dùng được) — `SessionContextProvider`,
        `useSurfaceAccess()`, `WriteGuardButton`, `SurfaceGate`. Nguồn: `GET /me/context`
        (mock, đã thêm vào `API_CONTRACT.md`).
      - **B4/B5 chốt thuộc Marketplace**, không phải Workspace — sidebar Workspace bỏ nhóm
        "Tin đăng — miễn phí", thay bằng cụm cross-surface có nhãn rõ. Đã sửa
        `SCREENS_WORKSPACE.md` theo.
      - B6 `/chu-tro/khu-tro` (viết mới — prototype chỉ có dropdown chọn khu) và B8
        `/chu-tro/khu-tro/[id]/phong` (port `RoomsView` + gộp `AddRoomModal`/`EditRoomModal`
        thành một `RoomFormDialog`).
      - **Không** port `RoomDetailTabs` (chỉ số/hóa đơn/lịch sử ở) — đó là B9/B10, V1. **Bỏ**
        nút "Điện nước"/"Hóa đơn" trên thẻ phòng: B12 chưa có, không để nút chết.
      - `AreaSelect` + `FormField` nâng từ `features/marketplace/post-listing/` lên
        `components/ui/` vì B6 cũng cần (cấm import chéo feature).

### Đang làm

- [ ] **Giai đoạn 4 — phần còn lại của Workspace.** Kế tiếp: B7 (chi tiết khu + nhận tiền +
      bật public) vì B6 đang cảnh báo "Chưa có thông tin nhận tiền" mà chưa có chỗ nhập, rồi
      B3 (dashboard), B9/B10 (chi tiết phòng + người ở).
- [ ] Nút **"Tạo tin từ phòng"** (điểm nối Room → RentalListing) — chưa làm: B5 chưa đọc
      `?roomId=` để prefill. Badge "Có tin đang chạy" thì đã có. Làm thành nhánh riêng chạm
      cả hai feature.

### Tiếp theo

- [ ] Phần công khai còn thiếu: A11 hộp thư, A5/A9/A10 tin nhu cầu, A4 trang khu trọ public,
      A12–A14
- [ ] **A7 đăng nhập/đăng ký/OTP — để CUỐI CÙNG** (quyết định của chủ dự án). Tới lúc đó mới
      thay `MOCK_SELLER_ID`/`MOCK_RENTER_ID` bằng phiên thật; mọi trang đang ghi sẵn
      `// TODO: nối AuthContext khi có` ở đúng chỗ cần sửa.
- [ ] Khu Admin (D1–D6)
- [ ] Khu người ở `/nguoi-o/*` (C1–C10) — phần lớn **viết mới**, prototype chưa có
- [ ] App mobile Expo
- [ ] Dashboard chủ trọ và phần SaaS còn lại
- [ ] Khu Admin
- [ ] Khu người ở `/nguoi-o/*` — **viết mới**, prototype chưa có
- [ ] App mobile Expo

---

## Quyết định đã chốt (không tự ý đổi)

| Quyết định | Lý do |
|---|---|
| Tailwind **v3**, không phải v4 | NativeWind bản ổn định cần v3; dùng v4 thì web và mobile không chung được preset |
| Next.js cho web | SSR để Google index trang tin đăng — SEO là kênh thu hút người thuê |
| Expo React Native cho mobile | Cùng React/TypeScript với web, dùng chung type và API client |
| Backend tách repo riêng | Java và TypeScript là hai hệ build khác nhau; nối qua OpenAPI |
| Hai bounded context + Shared Kernel | Giữ transaction đơn giản, vẫn có ranh giới sạch để tách service sau |
| Residency là module trong SaaS | Tách thành context thứ ba sẽ tạo phụ thuộc vòng |
| Không có role "Resident" | Người ở vẫn là Renter, chỉ khác ở `residencyStatus` suy từ dữ liệu |
| App người ở là lớp cộng thêm | Nghiệp vụ chủ trọ phải chạy đủ kể cả khi không ai cài app |
| Đánh giá verified-only | Cần Contract làm bằng chứng; đây là USP so với review tự do |

## Cạm bẫy đã gặp

**Class Tailwind sai tên không gây lỗi build.** Tailwind lặng lẽ không sinh CSS, typecheck
vẫn xanh, giao diện sai âm thầm. ESLint rule là hàng rào duy nhất — nếu nghi ngờ, thử viết
một class bịa và chạy `pnpm lint`, phải thấy báo lỗi.

**Thang bo góc khác mặc định.** Preset đè `md` = 12px; Tailwind mặc định `rounded-lg` là 8px.
Dùng theo thói quen sẽ lệch mà rất khó thấy bằng mắt.

**Node phải đúng 22.14.0** theo `.nvmrc`. Chạy `nvm use` trong repo; mỗi người một phiên bản
sẽ sinh lỗi kiểu "máy tôi chạy được".

**Prototype dựng trước khi chốt nghiệp vụ mới.** Không port nguyên hành vi cũ ở: gating
Workspace, đánh giá verified, consent liên kết người ở, báo cáo vi phạm bắt buộc đăng nhập.

**GitHub hay tự nhớ base branch của lần tạo PR gần nhất, không phải nhánh mình vừa mở compare
tới.** Từng khiến một PR merge nhầm thẳng vào `dev` thay vì `feat/rebuild`. Luôn nhìn kỹ dòng
`base:` ngay trước khi bấm "Create pull request", đừng tin theo mặc định.

**Bảng ánh xạ route trong `REBUILD_PLAN.md` từng SAI, và tài liệu cũng sai được.** Bảng đó
ghi B4 = `/chu-tro/tin-dang`, B5 = `/chu-tro/dang-tin`; tôi tin theo rồi sửa navbar sang route
đó, hoá ra **đúng là chiều ngược lại**: router thật của prototype đăng ký
`tai-khoan/tin-cho-thue` và `dang-tin-cho-thue`, còn hai đường `/chu-tro/*` kia chỉ tồn tại để
redirect, kèm comment "đường cũ, xóa được sau khi docs cập nhật hết". Đã sửa bảng và code
(PR #10). **Khi route đáng ngờ, đọc `prototype/src/routes/index.tsx` — nó là sự thật, tài liệu
tóm tắt có thể lạc hậu.**

**`Date.now()` không đủ để sinh id.** Nó phân giải tới mili-giây, nên bấm "Thêm dòng" vài lần
liên tiếp tạo ra các dòng **cùng id**: xoá một dòng thì xoá cả nhóm, sửa một dòng thì sửa cả
nhóm, React nhận key trùng nên vẽ lại thất thường. Dùng `createLocalId()`
(`features/marketplace/utils/localId.ts`, bọc `crypto.randomUUID`).

**Đừng đọc mảng từ `watch()` bên trong hàm xử lý sự kiện.** Đó là ảnh chụp lúc render; hai cú
bấm trong cùng một khung hình sẽ cùng đọc giá trị cũ và cái sau ghi đè cái trước — bấm nhanh
hai tiện ích chỉ giữ được một. Đọc bằng `getValues()` tại thời điểm gọi. Lỗi này **không hiện
ra khi thử tay chậm**.

**`AppSelect` cố ý không có viền** (`bg-transparent p-0`) để nơi dùng tự quyết khung. Đặt nó
cạnh ô `<input>` có viền mà quên bọc thì trông như hai hệ giao diện. Dùng `FieldBox`.

**`MapContainer` (react-leaflet) chỉ đọc `center` lúc gắn lần đầu.** Đổi prop sau đó không làm
bản đồ dời, ghim văng ra ngoài khung và trông như không có gì xảy ra. Cần một component gọi
`map.setView()` khi toạ độ đổi từ bên ngoài.

**Chỉ một file được chạm thư viện bản đồ.** Mọi nơi đi qua `ListingLocationMap`; phần Leaflet
nằm sau `LeafletMap`. Cùng nguyên tắc với `loadVnWards()` cho dữ liệu hành chính — đổi nhà
cung cấp sau này chỉ sửa một file.

**Kho mock nằm trong bộ nhớ TỪNG TIẾN TRÌNH — server prefetch không thấy mutation của trình
duyệt.** Thêm phòng ở B8 rồi quay lại B6 vẫn thấy số cũ, vì `staleTime: 30s` của app coi dữ
liệu server vừa ghi đè là còn tươi nên không refetch. Hook của workspace đặt `staleTime: 0`
để refetch khi mount hòa giải lại; bỏ khi nối API thật. Cạm bẫy này áp cho **mọi** feature
đang chạy mock có mutation.

**Banner lỗi đặt ở trang nền sẽ nằm SAU lớp phủ modal.** Bấm Lưu bị trùng mã phòng thì dialog
đứng im không rõ lý do — lỗi có render, chỉ là người dùng không thấy. Lỗi của thao tác trong
modal phải hiển thị **bên trong** modal đó. Chỉ lộ ra khi bấm thật, không lộ khi đọc code.

**Prototype có nhiều bản triển khai trùng logic bị lệch nhau** (ví dụ màu trạng thái phòng
giữa `theme.ts` và `statusMaps.ts` khác giá trị nhau). Khi port, ưu tiên tài liệu
`business/STATUS_ENUMS.md` của repo mới làm chuẩn, không mặc định tin code prototype là đúng
tuyệt đối.

---

## Cách làm việc đang áp dụng

- **Lập kế hoạch trước, chờ duyệt, rồi mới viết code.** Kế hoạch nêu rõ: file sẽ tạo, quyết
  định kiến trúc, và những điểm mơ hồ cần chủ dự án chốt — không tự quyết thay.
- **Kiểm thật trên trình duyệt trước khi báo xong**, không dừng ở "build xanh". Nhiều lỗi chỉ
  lộ ra khi bấm thật (bấm nhanh mất lựa chọn, bản đồ không dời, viền chìm).
  ⚠️ Số đo có thể đánh lừa nếu bắt sai thời điểm (hoạt ảnh đang chạy, ảnh chưa render, mốc trễ
  tự lưu) — đo lại trước khi kết luận có lỗi.
- **Tắt dev server sau khi kiểm xong**, nếu không sẽ chiếm cổng 3000 và chủ dự án không chạy
  `pnpm dev` được.
- **Tạo PR bằng `gh` CLI**: `"C:\Program Files\GitHub CLI\gh.exe" pr create --base feat/rebuild
  --head <nhánh> --title ... --body-file ...` (gh chưa vào PATH của shell nên gọi đường dẫn đầy
  đủ). Base **luôn** là `feat/rebuild`, không phải `dev`.
- Quality gate trước khi bàn giao: `pnpm lint`, `pnpm typecheck`, `pnpm build`,
  `pnpm format:check`.

## Cách cập nhật file này

Sau mỗi nhánh hoàn thành: chuyển mục tương ứng từ "Đang làm" sang "Đã xong", kéo mục kế tiếp
lên, ghi lại cạm bẫy mới nếu có. Giữ ngắn — đây là bản đồ, không phải nhật ký.
