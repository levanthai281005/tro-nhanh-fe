# Bảng chuyển inline style sang Tailwind

Các mẫu thường gặp nhất trong prototype.

| Prototype | Tailwind |
|---|---|
| `minHeight: "100vh"` | `min-h-screen` |
| `display: "flex"` | `flex` |
| `flexDirection: "column"` | `flex-col` |
| `alignItems: "center"` / `"flex-start"` | `items-center` / `items-start` |
| `justifyContent: "space-between"` | `justify-between` |
| `flexWrap: "wrap"` | `flex-wrap` |
| `gap: 24` | `gap-6` (4px = 1 đơn vị) |
| `padding: "24px 20px"` | `py-6 px-5` |
| `margin: 0` | `m-0` |
| `margin: "0 auto"` | `mx-auto` |
| `maxWidth: 1280` | `max-w-[1280px]` |
| `width: "100%"` | `w-full` |
| `flex: 1` | `flex-1` |
| `minWidth: 320` | `min-w-80` |
| `boxSizing: "border-box"` | bỏ — Tailwind đã đặt mặc định |
| `fontSize: 16` | `text-base` (12 → `text-xs`, 14 → `text-sm`, 18 → `text-lg`) |
| `fontWeight: 600` / `700` / `800` | `font-semibold` / `font-bold` / `font-extrabold` |
| `textTransform: "uppercase"` | `uppercase` |
| `letterSpacing: "0.07em"` | `tracking-[0.07em]` |
| `lineHeight: 1` | `leading-none` |
| `borderRadius: radius.md` | `rounded-md` — preset đã đặt `md` = 12px |
| `overflow: "hidden"` | `overflow-hidden` |
| `position: "sticky", top: 0` | `sticky top-0` |
| `cursor: "pointer"` | `cursor-pointer` |

## Thang bo góc

Preset đè thang mặc định của Tailwind cho khớp prototype: `sm` 8px · `md` 12px · `lg` 14px ·
`xl` 16px. Lưu ý `rounded-lg` mặc định của Tailwind là 8px — nếu quen tay dùng theo mặc định
sẽ lệch.

## Thang khoảng cách

Thang của prototype trùng khớp Tailwind mặc định (`space[4]` = 16px = `p-4`), nên chuyển
1:1, không cần quy đổi.
