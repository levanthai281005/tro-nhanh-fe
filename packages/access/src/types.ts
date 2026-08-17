/**
 * Kiểu dữ liệu của tầng truy cập. Bản dịch 1-1 của
 * `.agents/business/SURFACES_AND_MODES.md` — sửa luật thì sửa tài liệu trước.
 *
 * Package này cố ý **không phụ thuộc framework nào**: không React, không Next, không React
 * Native. Đó là điều kiện để web và mobile dùng chung đúng một bản luật.
 */

/** Ba bề mặt sản phẩm. Cố định theo kiến trúc, không thêm bớt tùy tiện. */
export const SURFACE_IDS = ['marketplace', 'workspace', 'residency'] as const;
export type SurfaceId = (typeof SURFACE_IDS)[number];

/** `roles[]` trong JWT — **cộng dồn**, không loại trừ (BR-013). */
export const ROLES = ['Renter', 'Seller', 'Admin', 'Moderator'] as const;
export type Role = (typeof ROLES)[number];

/** Quyền trong Workspace SaaS (BR-013, BR-015). */
export const WORKSPACE_STATUSES = ['NONE', 'TRIAL', 'ACTIVE', 'READ_ONLY'] as const;
export type WorkspaceStatus = (typeof WORKSPACE_STATUSES)[number];

/** Quan hệ ở trọ (BR-029, BR-034). Suy từ `Occupancy`, không phải một role. */
export const RESIDENCY_STATUSES = ['NONE', 'PENDING', 'ACTIVE', 'PAST'] as const;
export type ResidencyStatus = (typeof RESIDENCY_STATUSES)[number];

/** Tài nguyên có hạn mức theo gói (BR-015). */
export const LIMITED_RESOURCES = ['properties', 'rooms'] as const;
export type LimitedResource = (typeof LIMITED_RESOURCES)[number];

export interface PlanLimits {
  readonly maxProperties: number;
  readonly maxRooms: number;
}

/**
 * Capability của phiên hiện tại — do **server** quyết, trả về từ `GET /me/context`.
 *
 * `workspaceStatus` và `residencyStatus` là giá trị **suy ra** (từ `UserSubscription` và
 * `Occupancy`). Client không được tự suy: luật gating sẽ tồn tại hai bản, và bản ở client thì
 * người dùng sửa được.
 */
export interface SessionContext {
  readonly userId: string | null;
  readonly roles: readonly Role[];
  readonly workspaceStatus: WorkspaceStatus;
  readonly residencyStatus: ResidencyStatus;
  readonly limits: PlanLimits;
  readonly trialEndsAt: string | null;
  readonly subscriptionExpiresAt: string | null;
}

/**
 * Mức truy cập vào một Surface. Bốn mức này ánh xạ thẳng sang bảng quyết định §3 của
 * `SURFACES_AND_MODES.md`.
 *
 * - `none`    — không vào được, phải chuyển hướng
 * - `limited` — chỉ vào được **một** màn cụ thể (B1 mời dùng thử; C2 xác nhận liên kết)
 * - `read`    — xem và xuất dữ liệu, mọi thao tác ghi bị khóa
 * - `full`    — đầy đủ, còn lại chỉ vướng hạn mức gói
 */
export const SURFACE_ACCESS_LEVELS = ['none', 'limited', 'read', 'full'] as const;
export type SurfaceAccessLevel = (typeof SURFACE_ACCESS_LEVELS)[number];

/** Mã từ chối. Trùng tên với mã lỗi backend ở chỗ backend có định nghĩa sẵn. */
export type AccessDenialCode =
  | 'AUTH_REQUIRED'
  | 'WORKSPACE_NOT_STARTED'
  | 'WORKSPACE_READ_ONLY'
  | 'RESIDENCY_NONE'
  | 'RESIDENCY_PENDING'
  | 'RESIDENCY_PAST'
  | 'LIMIT_REACHED';

export interface AccessDenial {
  readonly code: AccessDenialCode;
  /** Câu tiếng Việt hiển thị được cho người dùng — không lộ chi tiết kỹ thuật. */
  readonly message: string;
  /** Nơi nên đưa người dùng tới để tự gỡ vướng. `null` khi không có lối nào. */
  readonly redirectTo: string | null;
}
