import type { SessionContext } from '@tronhanh/access';

/**
 * Phiên giả lập cho tới khi A7 (đăng nhập/OTP) xong.
 *
 * Chủ dự án đã chốt để A7 **cuối cùng**, nên mọi màn hiện chạy bằng danh tính mock. Đây là
 * nguồn mock **duy nhất** của tầng phiên: khi A7 xong chỉ đổi
 * `getSessionContext()` sang gọi `GET /me/context` thật, không phải đi lùng từng màn.
 */

// TODO: nối AuthContext khi có — thay bằng user.id từ phiên đã xác thực.
export const MOCK_USER_ID = '10000000-0000-4000-8000-000000000001';

/**
 * Cố ý để `TRIAL` với hạn mức rộng hơn plan Trial thật (`maxProperties=1`, `maxRooms=5`).
 * Hạn mức thật khiến màn B6 chỉ có đúng một khu — không đủ để thấy danh sách, cũng không đủ
 * để thử UI chạm hạn mức. Con số dưới đây là **của bản demo**, không phải cấu hình sản phẩm.
 */
export const MOCK_SESSION_CONTEXT: SessionContext = {
  userId: MOCK_USER_ID,
  roles: ['Renter', 'Seller'],
  workspaceStatus: 'TRIAL',
  residencyStatus: 'NONE',
  limits: { maxProperties: 3, maxRooms: 20 },
  trialEndsAt: null,
  subscriptionExpiresAt: null,
};

/** Số ngày dùng thử còn lại hiển thị trên banner. */
export const MOCK_TRIAL_DAYS_LEFT = 23;
