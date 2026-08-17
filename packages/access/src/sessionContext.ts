import { z } from 'zod';
import {
  RESIDENCY_STATUSES,
  ROLES,
  WORKSPACE_STATUSES,
  type PlanLimits,
  type SessionContext,
} from './types';

/**
 * Hợp đồng của `GET /me/context`. Parse ở biên vào, một lần — sau điểm đó mọi hàm trong
 * package tin `SessionContext` đã hợp lệ và không phải kiểm lại.
 */
export const planLimitsSchema = z.object({
  maxProperties: z.number().int().nonnegative(),
  maxRooms: z.number().int().nonnegative(),
});

export const sessionContextSchema = z.object({
  userId: z.string().min(1).nullable(),
  roles: z.array(z.enum(ROLES)).readonly(),
  workspaceStatus: z.enum(WORKSPACE_STATUSES),
  residencyStatus: z.enum(RESIDENCY_STATUSES),
  limits: planLimitsSchema,
  trialEndsAt: z.string().datetime().nullable(),
  subscriptionExpiresAt: z.string().datetime().nullable(),
});

export type SessionContextInput = z.input<typeof sessionContextSchema>;

/** Hạn mức cho phiên chưa đăng nhập / chưa mở Workspace — 0 để mọi phép kiểm đều chặn. */
export const EMPTY_PLAN_LIMITS: PlanLimits = { maxProperties: 0, maxRooms: 0 };

/**
 * Phiên của khách chưa đăng nhập.
 *
 * Có một giá trị mặc định tường minh quan trọng hơn vẻ ngoài của nó: nếu để `SessionContext`
 * nhận `undefined`, mọi hàm dưới đây phải mang thêm nhánh `?.` và sớm muộn sẽ có nhánh quên
 * kiểm. Khách vãng lai là **một trạng thái hợp lệ**, không phải trạng thái thiếu dữ liệu.
 */
export const GUEST_SESSION_CONTEXT: SessionContext = {
  userId: null,
  roles: [],
  workspaceStatus: 'NONE',
  residencyStatus: 'NONE',
  limits: EMPTY_PLAN_LIMITS,
  trialEndsAt: null,
  subscriptionExpiresAt: null,
};

export function parseSessionContext(raw: unknown): SessionContext {
  return sessionContextSchema.parse(raw);
}

/** Phiên đã đăng nhập hay chưa. `userId` là nguồn duy nhất, không suy từ `roles`. */
export function isAuthenticated(context: SessionContext): boolean {
  return context.userId !== null;
}
