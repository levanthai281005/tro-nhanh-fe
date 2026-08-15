# Nối một endpoint mới

Backend là repo riêng viết bằng Java Spring Boot. Cầu nối duy nhất giữa hai repo là
`openapi.json`.

---

## Bước 1 — Cập nhật spec

Lấy `openapi.json` mới từ repo backend, đặt vào gốc repo này, rồi chạy lệnh sinh type.

**Không sửa tay** `packages/types/src/api.ts` — lần sinh sau sẽ ghi đè và sai lệch quay lại
âm thầm.

## Bước 2 — Kiểm tra namespace

Tra `../business/API_CONTRACT.md`. Namespace quyết định middleware nào áp dụng:

| Tiền tố | Guard |
|---|---|
| `/public/*` | không cần đăng nhập |
| `/marketplace/*` | cần đăng nhập |
| `/management/*` | đăng nhập + role Seller + gating workspace |
| `/residency/*` | đăng nhập + residency guard |
| `/admin/*` | đăng nhập + role nội bộ |

Gọi sai tiền tố sẽ bị guard chặn nhầm hoặc lọt guard đáng lẽ phải có.

## Bước 3 — Viết service

Service đặt trong feature tương ứng, bọc quanh client của `@tronhanh/api`. Service chịu
trách nhiệm biến đổi dữ liệu cho hợp với nhu cầu giao diện, không để component tự xử lý dữ
liệu thô.

## Bước 4 — Nối TanStack Query

Server state thuộc TanStack Query, không nhét vào Zustand. Đặt query key nhất quán theo
feature và tài nguyên. Sau mutation, invalidate đúng key liên quan.

## Bước 5 — Xử lý lỗi theo mã

Xử lý dựa trên `error.code`, **không dựa vào chuỗi message** vì message có thể đổi. Các mã
nghiệp vụ cần xử lý riêng:

- `WORKSPACE_READ_ONLY` — hiện lời mời gia hạn, **không làm mất dữ liệu form đang nhập**
- `RESIDENCY_NOT_LINKED` — hướng dẫn người dùng chờ chủ trọ gắn phòng
- `METER_SUBMISSION_DISABLED` — ẩn chức năng gửi chỉ số
- `REVIEW_NOT_ELIGIBLE` — giải thích điều kiện được đánh giá

## Khi backend chưa sẵn sàng

Dùng dữ liệu mẫu khớp đúng type đã sinh và đánh dấu `// TODO: nối API thật`. Khi endpoint
thật xong thì chỉ đổi nguồn, không phải viết lại giao diện.
