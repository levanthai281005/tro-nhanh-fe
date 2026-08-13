# Bảng ánh xạ token màu

Prototype import `{ C, font }` từ `shared/theme.ts`. Đối chiếu sang class Tailwind như sau.
Đây là bảng bắt buộc — không tự đặt tên class khác.

| Trong prototype | Giá trị | Class Tailwind |
|---|---|---|
| `C.primary` | `#8A4A20` | `bg-primary` · `text-primary` · `border-primary` |
| `C.primaryHover` | `#713B19` | `hover:bg-primary-hover` |
| `C.primaryPress` · `C.primaryDark` | `#5C2D0F` | `active:bg-primary-press` |
| `C.secondary` · `C.sand` | `#C99B65` | `bg-sand` · `text-sand` |
| `C.secondaryHover` | `#B08D63` | `hover:bg-sand-hover` |
| `C.secondaryPress` | `#9A784F` | `active:bg-sand-press` |
| `C.cream` · `C.caramelSoft` | `#F7EFE2` | `bg-cream` |
| `C.bg` | `#FFFCF7` | `bg-canvas` |
| `C.textPrimary` | `#2F2118` | `text-ink` |
| `C.textSecondary` | `#7D6A5B` | `text-ink-muted` |
| `C.border` | `#EADCCB` | `border-line` |
| `C.available` | `#4F7A4A` | `text-status-available` · `bg-status-available` |
| `C.deposited` | `#C8861A` | `text-status-deposited` · `bg-status-deposited` |
| `C.rented` | `#9B8C78` | `text-status-rented` · `bg-status-rented` |
| `C.repairing` | `#C07B4A` | `text-accent-warn` |
| `C.error` | `#B5503C` | `text-error` |
| `C.warning` | `#C8861A` | `text-warning` |
| `C.success` | `#4A7A34` | `text-success` |

**`font` (Be Vietnam Pro)** đã đặt toàn cục — gặp `fontFamily: font` thì xóa hẳn.

`C.repairing` là **token màu, không phải trạng thái phòng** — danh sách trạng thái phòng
không có giá trị "Repairing". Đặt tên `accent-warn` để tránh hiểu nhầm.
