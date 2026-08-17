'use client';

import {
  canWriteInSurface,
  getLimitDenial,
  getRemainingQuota,
  getSurfaceAccessLevel,
  getSurfaceDenial,
  type AccessDenial,
  type LimitedResource,
  type SurfaceAccessLevel,
  type SurfaceId,
} from '@tronhanh/access';
import { useSessionContext } from '@/features/session/components/SessionContextProvider';

export interface SurfaceAccess {
  readonly level: SurfaceAccessLevel;
  readonly canWrite: boolean;
  readonly denial: AccessDenial | null;
  /** Còn tạo được bao nhiêu tài nguyên nữa trước khi chạm hạn mức gói (BR-015). */
  readonly getRemaining: (resource: LimitedResource, currentCount: number) => number;
  /** `null` khi còn chỗ; có giá trị thì nút thêm phải khóa kèm lý do này. */
  readonly getLimitDenial: (resource: LimitedResource, currentCount: number) => AccessDenial | null;
}

/**
 * Lối duy nhất để UI hỏi về quyền.
 *
 * Không component nào được viết `workspaceStatus === 'READ_ONLY'` hay
 * `roles.includes('Seller')` — luật đó sống ở `@tronhanh/access` và có test. Hook này chỉ là
 * lớp bọc React mỏng, cố tình không chứa logic riêng.
 */
export function useSurfaceAccess(surface: SurfaceId): SurfaceAccess {
  const context = useSessionContext();

  return {
    level: getSurfaceAccessLevel(context, surface),
    canWrite: canWriteInSurface(context, surface),
    denial: getSurfaceDenial(context, surface),
    getRemaining: (resource, currentCount) => getRemainingQuota(context, resource, currentCount),
    getLimitDenial: (resource, currentCount) => getLimitDenial(context, resource, currentCount),
  };
}
