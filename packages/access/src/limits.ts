import type { AccessDenial, LimitedResource, SessionContext } from './types';

/**
 * Hạn mức gói (BR-015) — §3.4 của `SURFACES_AND_MODES.md`.
 *
 * Chạm hạn mức chỉ **chặn tạo mới**, không bao giờ xóa hay ẩn dữ liệu sẵn có. Trường hợp
 * over-limit (chủ trọ gia hạn xuống gói nhỏ hơn số khu/phòng đang có) là hợp lệ và phải chạy
 * được: giữ nguyên tất cả, chỉ khóa nút thêm cho tới khi họ về dưới hạn mức.
 */

const RESOURCE_LABELS: Record<LimitedResource, string> = {
  properties: 'khu trọ',
  rooms: 'phòng',
};

export function getResourceLimit(context: SessionContext, resource: LimitedResource): number {
  return resource === 'properties' ? context.limits.maxProperties : context.limits.maxRooms;
}

/** `currentCount` là số đang có. Tạo thêm được khi còn chỗ trống. */
export function isWithinLimit(
  context: SessionContext,
  resource: LimitedResource,
  currentCount: number,
): boolean {
  return currentCount < getResourceLimit(context, resource);
}

/** Số còn tạo được. Âm khi đang over-limit → kẹp về 0 để UI không hiện "còn -2 phòng". */
export function getRemainingQuota(
  context: SessionContext,
  resource: LimitedResource,
  currentCount: number,
): number {
  return Math.max(0, getResourceLimit(context, resource) - currentCount);
}

export function getLimitDenial(
  context: SessionContext,
  resource: LimitedResource,
  currentCount: number,
): AccessDenial | null {
  if (isWithinLimit(context, resource, currentCount)) return null;

  const limit = getResourceLimit(context, resource);
  return {
    code: 'LIMIT_REACHED',
    message: `Gói hiện tại cho phép tối đa ${limit} ${RESOURCE_LABELS[resource]}. Nâng gói để thêm mới.`,
    redirectTo: '/chu-tro/goi-dich-vu',
  };
}
