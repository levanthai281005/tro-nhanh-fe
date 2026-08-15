# Workspace Guidelines for Agents

Trước khi thay đổi mã nguồn, hãy đọc `README.md`, `HELP.md` và toàn bộ tài liệu trong
`.agents/rules/`. Tài liệu nghiệp vụ theo từng miền sẽ được đặt trong `.agents/business/`.

## Phạm vi workspace

- `apps/web`: ứng dụng Next.js App Router cho marketplace, chủ trọ và người ở.
- `apps/mobile`: ứng dụng Expo dành cho người ở.
- `packages/*`: API client, type, schema, constant, utility và cấu hình dùng chung.

## Nguyên tắc làm việc

- Đọc hướng dẫn đúng phiên bản framework trong `HELP.md` trước khi triển khai.
- Giữ Tailwind CSS ở phiên bản `3.4.17` trên toàn workspace.
- Không import chéo giữa các feature domain `marketplace`, `workspace` và `residency`.
- Không sửa trực tiếp file sinh tự động `packages/types/src/api.ts`.
- Không dùng explicit `any`; TypeScript phải giữ `strict: true`.
- Dùng dependency nội bộ qua `workspace:*`.
- Bảo toàn thay đổi hiện có của người dùng; không reset hoặc xóa ngoài phạm vi yêu cầu.
- Trước khi bàn giao, chạy các quality gate phù hợp: lint, typecheck, build và format check.

## Quy ước riêng cho web

- Mỗi feature tự sở hữu component, hook, schema, server logic, service, type và constant.
- `apps/web/src/lib` chỉ dành cho cấu hình hoặc adapter của SDK/thư viện bên thứ ba.
- `apps/web/src/utils` chỉ dành cho hàm thuần, không giữ trạng thái.
- Ưu tiên Server Component và chỉ tạo Client Component tại boundary cần tương tác.

## Quy ước riêng cho mobile

- Route file trong `apps/mobile/src/app` chỉ giữ navigation và screen composition cấp cao.
- Mã nghiệp vụ thuộc feature tương ứng; feature mobile không tạo thư mục `server/`.
- Dùng Expo Router cho routing, TanStack Query cho server state và SecureStore cho token.
- Cấu hình hoặc adapter SDK bên thứ ba đặt trong `apps/mobile/src/lib`; hàm thuần đặt trong
  `apps/mobile/src/utils`.
- Mọi biến `EXPO_PUBLIC_*` đều là dữ liệu công khai được nhúng vào client bundle.
