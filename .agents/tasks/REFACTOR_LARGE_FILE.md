# Tách file quá lớn

Giới hạn: **một file không vượt 300 dòng**. Vượt thì phải tách.

---

## Mẫu tách chuẩn

```
app/(public)/phong/[id]/page.tsx          # chỉ điều phối: lấy dữ liệu, ghép mảnh
features/marketplace/room-detail/
  RoomGallery.tsx                          # mỗi khối giao diện một file
  RoomCostTable.tsx
  RoomAmenities.tsx
  RoomContactBox.tsx
  useRoomDetail.ts                         # logic tách thành hook
  constants.ts                             # hằng số, bảng ánh xạ
```

## Nguyên tắc

- **Page chỉ điều phối** — lấy dữ liệu và ghép các mảnh, không chứa logic hiển thị chi tiết.
- Mỗi khối giao diện một file, đặt tên theo vai trò chứ không theo vị trí (`RoomCostTable`
  chứ không phải `Section2`).
- Logic tách thành hook riêng, đặt tên bắt đầu bằng `use`.
- Hằng số và bảng ánh xạ ra file `constants.ts`.
- **Không định nghĩa nhiều component trong cùng một file.**

## Quy tắc khi tách

Tách là **di chuyển code, không đổi hành vi**. Không tranh thủ sửa logic hay đổi giao diện
trong lúc tách — nếu phát hiện lỗi thì báo lại và xử lý ở một PR riêng.

Chạy `pnpm typecheck` sau khi tách để chắc chắn không đứt import.

## Đặt `'use client'` khi tách

Tách file là cơ hội thu hẹp client boundary. Sau khi tách, chỉ component thật sự cần tương
tác mới giữ `'use client'`; các khối tĩnh nên là Server Component.
