# Naming Conventions

Đồng bộ cách đặt tên giúp thành viên trong đội ngũ và AI đọc hiểu mã nguồn nhanh chóng.

## Quy tắc dùng chung

- Component và Context: dùng PascalCase, ví dụ `UserProfile.tsx`, `AuthContext.tsx`.
- Hook: dùng camelCase và bắt buộc có tiền tố `use`, ví dụ `useAuth.ts`,
  `useLocalStorage.ts`.
- Utility và Service: dùng camelCase, ví dụ `formatDate.ts`, `apiClient.ts`.
- Schema: dùng camelCase cho tên file và hậu tố mô tả mục đích khi cần, ví dụ
  `loginSchema.ts`, `residentFormSchema.ts`.
- Type và Interface: dùng PascalCase, ví dụ `UserProfile`, `LoginFormValues`.
- Constant được export: dùng UPPER_SNAKE_CASE, ví dụ `MAX_RETRY_COUNT`, `API_TIMEOUT`.
- Biến và hàm: dùng camelCase; boolean nên bắt đầu bằng `is`, `has`, `can` hoặc `should`.
- Thư mục feature: dùng kebab-case và phản ánh đúng domain, ví dụ `room-management/`.
- Không dùng tên mơ hồ như `data`, `item`, `helper` hoặc `common` nếu có thể mô tả cụ thể hơn.

## Next.js

- Thư mục định tuyến App Router: dùng kebab-case, ví dụ
  `app/dashboard/user-profile/page.tsx`.
- Giữ nguyên tên file đặc biệt của Next.js: `page.tsx`, `layout.tsx`, `loading.tsx`,
  `error.tsx`, `not-found.tsx`, `route.ts` và `template.tsx`.
- Server Action nên có động từ thể hiện mutation, ví dụ `createRoom`, `updateInvoice`,
  `deleteResident`.
- Component chỉ chạy phía client vẫn dùng PascalCase; chỉ thêm hậu tố `Client` khi cần phân
  biệt rõ với một component server cùng vai trò, không thêm máy móc cho mọi file.

## Expo và React Native

- Thư mục route của Expo Router dùng kebab-case, ví dụ `app/payment-history/`.
- Giữ nguyên tên route đặc biệt của Expo Router: `_layout.tsx`, `index.tsx`,
  `+not-found.tsx`, `+html.tsx`, `+native-intent.tsx` và route group dạng `(tabs)`.
- Dynamic route dùng cú pháp Expo Router, ví dụ `[id].tsx` và `[...rest].tsx`.
- Screen component dùng PascalCase và hậu tố `Screen` khi giúp phân biệt với component giao
  diện thường, ví dụ `PaymentHistoryScreen`.
- File dành riêng cho nền tảng dùng suffix chuẩn trước phần mở rộng:
  `CameraButton.ios.tsx`, `CameraButton.android.tsx`, `CameraButton.web.tsx` hoặc
  `secureStorage.native.ts`.
- Style key trong `StyleSheet.create` dùng camelCase, ví dụ `contentContainer`,
  `pressedButton`.
- Asset file dùng kebab-case, chữ thường và có ý nghĩa, ví dụ `empty-invoice.png`; giữ hậu tố
  mật độ ảnh chuẩn như `logo@2x.png` và `logo@3x.png`.
- Tên quyền và key lưu trữ phải mô tả rõ phạm vi; key được export dùng UPPER_SNAKE_CASE, ví
  dụ `CAMERA_PERMISSION_MESSAGE`, `ACCESS_TOKEN_KEY`.
