# Chuyển một trang từ prototype

Repo prototype là bản demo cũ dùng Vite, react-router, Supabase và inline style. Nhiệm vụ là
chuyển **bố cục, luồng tương tác và câu chữ tiếng Việt** sang repo này, đồng thời đổi hệ
styling, routing và tầng dữ liệu.

> Prototype là **chỉ đọc**. Không sửa, không tạo file trong đó. Nó là bản tham chiếu đang
> chạy để đối chiếu giao diện.

Kỹ năng chi tiết về chuyển đổi nằm ở `../skills/porting-prototype-ui/SKILL.md`.

---

## Bước 1 — Lập kế hoạch, chưa viết code

Đọc **đúng một file trang** của prototype (không đọc cả repo — ngữ cảnh loãng làm chất lượng
tụt). Trình bày:

- Danh sách file sẽ tạo và trách nhiệm từng file
- Các khối giao diện sẽ tách thành component riêng
- Dữ liệu cần: endpoint nào, type nào trong `@tronhanh/types`
- Component nào cần `'use client'` và vì sao
- Mã BR/FR liên quan (tra `../business/BUSINESS_RULES.md`)
- Chỗ nào thấy mơ hồ hoặc nghi ngờ

**Dừng lại chờ duyệt.** Sửa một bản kế hoạch rẻ hơn sửa code đã sinh sai hướng rất nhiều.

## Bước 2 — Dựng khung file rỗng

Tạo cấu trúc thư mục và file theo kế hoạch đã duyệt, mỗi file chỉ có khung và interface
props. Commit riêng bước này để dễ quay lại.

## Bước 3 — Chuyển giao diện

Trang dưới 300 dòng thì làm một lượt. Trang lớn thì **chuyển từng khối, commit sau mỗi
khối** — gallery xong commit, bảng chi phí xong commit. Hỏng thì chỉ mất một khối.

Giữ nguyên bố cục và câu chữ; chỉ đổi cách styling. Không "cải thiện" thiết kế — bản
prototype đã được người dùng thật đánh giá tốt.

## Bước 4 — Thay tầng dữ liệu

Bỏ mọi lời gọi Supabase, thay bằng service gọi qua `@tronhanh/api`. Nếu backend chưa có
endpoint tương ứng, dùng dữ liệu mẫu **khớp đúng type đã sinh** và đánh dấu
`// TODO: nối API thật`. Không bịa hình dạng dữ liệu khác với type.

## Bước 5 — Chạy quality gate

`pnpm lint`, `pnpm typecheck`, `pnpm build` — cả ba phải sạch mới đi tiếp.

## Bước 6 — Đối chiếu giao diện

Mở prototype song song và so bằng mắt một lần. Class Tailwind sai tên **không gây lỗi
build**, nên đây là bước duy nhất bắt được lệch màu và lệch khoảng cách.

## Bước 7 — Một trang, một PR

PR nhỏ, một mục tiêu, kèm ảnh chụp so với bản prototype. Không gộp nhiều trang.

---

## Cảnh báo nghiệp vụ

Prototype được dựng **trước** khi chốt một số quyết định. Không port nguyên hành vi cũ ở các
điểm sau — phải đối chiếu `../business/`:

- Gating Workspace 4 trạng thái (BR-013, BR-015)
- Đánh giá khu chỉ dành cho người ở đã xác thực, cấm chủ tự đánh giá (BR-022, BR-030)
- Liên kết người ở cần họ xác nhận trước khi mở dữ liệu (BR-029)
- Báo cáo vi phạm bắt buộc đăng nhập (BR-032)
- Toàn bộ khu `/nguoi-o/*` là tính năng mới, prototype chưa có
