---
name: api-integration
description: Nối endpoint backend tới giao diện — sinh type từ openapi.json, viết service, dùng TanStack Query, xử lý lỗi theo mã. Dùng khi cần lấy hoặc gửi dữ liệu tới backend.
---

# Nối API từ backend tới giao diện

Backend là repo riêng viết bằng Java Spring Boot. Hai repo là **hai hệ kiểu độc lập**, nên
cầu nối duy nhất là `openapi.json`.

## Luồng dữ liệu

```
openapi.json  →  packages/types  →  packages/api  →  services/  →  TanStack Query  →  UI
```

Mỗi mắt xích có một trách nhiệm; không nhảy cóc, ví dụ không gọi thẳng axios trong component.

## Bước 1 — Sinh type

Cập nhật `openapi.json` từ repo backend rồi chạy lệnh sinh. **Không sửa tay**
`packages/types/src/api.ts` — lần sinh sau ghi đè, sai lệch quay lại âm thầm.

Nếu type sinh ra khác với hình dạng dữ liệu bạn cần, vấn đề nằm ở backend hoặc ở spec, không
được "chữa" bằng cách ép kiểu ở client.

## Bước 2 — Chọn đúng namespace

Namespace quyết định middleware nào áp dụng — tra `../../business/API_CONTRACT.md`:

| Tiền tố | Guard |
|---|---|
| `/public/*` | không cần đăng nhập |
| `/marketplace/*` | cần đăng nhập |
| `/management/*` | đăng nhập + role Seller + gating workspace |
| `/residency/*` | đăng nhập + residency guard |
| `/admin/*` | đăng nhập + role nội bộ |

## Bước 3 — Viết service

Service đặt trong feature, bọc quanh client của `@tronhanh/api`. Service chịu trách nhiệm
biến đổi dữ liệu cho hợp nhu cầu giao diện — component không xử lý dữ liệu thô.

## Bước 4 — TanStack Query

Server state thuộc TanStack Query; **Zustand chỉ dành cho state client/UI** không có nguồn
gốc từ server. Đặt query key nhất quán theo feature và tài nguyên; sau mutation thì
invalidate đúng key liên quan.

Ở web, ưu tiên lấy dữ liệu trực tiếp trong Server Component khi không cần tương tác; dùng
TanStack Query cho phần client cần cache và refetch.

## Bước 5 — Xử lý lỗi theo mã, không theo message

Backend trả `{ error: { code, message, details } }`. Xử lý dựa trên `error.code` vì message
có thể đổi bất cứ lúc nào. Các mã cần xử lý riêng:

| Mã | Cách xử lý |
|---|---|
| `WORKSPACE_READ_ONLY` | Mời gia hạn, **không làm mất dữ liệu form đang nhập** |
| `RESIDENCY_NOT_LINKED` | Hướng dẫn chờ chủ trọ gắn phòng |
| `METER_SUBMISSION_DISABLED` | Ẩn chức năng gửi chỉ số |
| `REVIEW_NOT_ELIGIBLE` | Giải thích điều kiện được đánh giá |
| `SELF_CONTACT_FORBIDDEN` | Ẩn nút nhắn tin với tin của chính mình |
| `TRIAL_ALREADY_USED` | Chuyển thẳng sang màn mua gói |

HTTP 422 là lỗi validation ngữ nghĩa — map `details` về đúng field trong form.

## Bước 6 — Ba trạng thái bắt buộc

Mọi request phải có **loading, empty và error** phù hợp với trải nghiệm nền tảng. Empty state
nói rõ người dùng làm gì tiếp theo, không chỉ hiện "Không có dữ liệu".

## Khi backend chưa sẵn sàng

Dùng dữ liệu mẫu khớp đúng type đã sinh, đánh dấu `// TODO: nối API thật`. Khi endpoint thật
xong chỉ đổi nguồn, không phải viết lại giao diện.
