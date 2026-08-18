# Dựng feature mới

Dùng khi làm một phần chức năng chưa có mẫu trong prototype — điển hình là toàn bộ khu
Residency (`app/(residency)` và app mobile).

---

## Bước 1 — Xác định phạm vi

Tra `../business/FEATURE_MODULES.md` để biết chức năng thuộc module nào và domain nào, rồi
tra file `SCREENS_*` tương ứng để lấy mã màn hình, route và mô tả.

Xác định feature domain: `marketplace`, `workspace` hay `residency`. Quyết định này chốt luôn
thư mục đặt code và **không được import chéo** sang domain khác.

## Bước 2 — Đọc luật nghiệp vụ liên quan

Tra `../business/BUSINESS_RULES.md` và `../business/USER_FLOWS.md`. Liệt kê ra các BR ràng
buộc feature này trước khi code — làm xong mới đọc luật thì thường phải sửa lại.

## Bước 3 — Trình bày kế hoạch và chờ duyệt

Nêu: cấu trúc thư mục feature, danh sách component, hook, schema, service; endpoint cần
dùng; trạng thái nào cần xử lý (loading, empty, error); các BR áp dụng.

## Bước 4 — Dựng theo lát cắt dọc

Làm trọn một chức năng từ service tới giao diện rồi mới sang chức năng kế tiếp. Không dựng
hết service rồi mới làm giao diện — cách đó dồn lỗi về cuối.

## Bước 5 — Đủ ba trạng thái

Mọi màn hình có gọi dữ liệu phải xử lý **loading, empty và error**. Đây là yêu cầu bắt buộc
trong `../rules/CODING_STANDARDS.md`, không phải tùy chọn.

## Bước 6 — Quality gate và bàn giao

Theo `PRE_HANDOFF_CHECKLIST.md`.
