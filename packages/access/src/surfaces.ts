import { isAuthenticated } from './sessionContext';
import type { AccessDenial, SessionContext, SurfaceAccessLevel, SurfaceId } from './types';

/**
 * Bảng quyết định §3 của `SURFACES_AND_MODES.md`, dạng chạy được.
 *
 * Mọi câu hỏi "người này vào được đâu, ghi được gì" đều phải đi qua đây. UI **không bao giờ**
 * được viết `status === 'READ_ONLY'` hay `roles.includes('Seller')` — hai bản luật sẽ lệch
 * nhau, và bản trong UI là bản không ai test.
 */

/** Màn duy nhất vào được khi Workspace ở mức `limited` — B1, lời mời dùng thử. */
export const WORKSPACE_LIMITED_PATH = '/chu-tro';

/** Màn duy nhất vào được khi Residency ở mức `limited` — C2, xác nhận liên kết (BR-029). */
export const RESIDENCY_LIMITED_PATH = '/nguoi-o/xac-nhan';

export const SIGN_IN_PATH = '/dang-nhap';

export function getSurfaceAccessLevel(
  context: SessionContext,
  surface: SurfaceId,
): SurfaceAccessLevel {
  switch (surface) {
    case 'marketplace':
      // Marketplace luôn mở — đó là bề mặt Google index. Khách vãng lai xem được mọi tin,
      // chỉ không ghi được (lưu tin, nhắn tin, báo cáo đều cần đăng nhập — BR-032).
      return isAuthenticated(context) ? 'full' : 'read';

    case 'workspace':
      if (!isAuthenticated(context)) return 'none';
      switch (context.workspaceStatus) {
        // `NONE` không phải "bị cấm" mà là "chưa mở" — vẫn cho vào đúng B1 để còn kích hoạt.
        case 'NONE':
          return 'limited';
        case 'READ_ONLY':
          return 'read';
        case 'TRIAL':
        case 'ACTIVE':
          return 'full';
      }
      break;

    case 'residency':
      if (!isAuthenticated(context)) return 'none';
      switch (context.residencyStatus) {
        case 'NONE':
          return 'none';
        case 'PENDING':
          return 'limited';
        case 'PAST':
          return 'read';
        case 'ACTIVE':
          return 'full';
      }
  }

  // Không nhánh nào rơi tới đây; giữ lại để đổi enum mà quên nhánh thì fail an toàn.
  return 'none';
}

export function canEnterSurface(context: SessionContext, surface: SurfaceId): boolean {
  return getSurfaceAccessLevel(context, surface) !== 'none';
}

/**
 * Ghi được trong Surface này không.
 *
 * `read` và `limited` đều không ghi được. Đây là hàm mà mọi nút ghi phải hỏi — thay cho
 * `requiresWrite` rải trong component như bản prototype.
 */
export function canWriteInSurface(context: SessionContext, surface: SurfaceId): boolean {
  return getSurfaceAccessLevel(context, surface) === 'full';
}

/** Danh sách Surface vào được, giữ nguyên thứ tự khai báo. */
export function resolveAvailableSurfaces(context: SessionContext): readonly SurfaceId[] {
  return (['marketplace', 'workspace', 'residency'] as const).filter((surface) =>
    canEnterSurface(context, surface),
  );
}

/**
 * Surface mặc định khi người dùng chưa chọn Mode.
 *
 * Ưu tiên Residency trước Workspace vì người ở thường có **việc cần làm ngay** (xác nhận liên
 * kết, hóa đơn tới hạn), còn chủ trọ vào Workspace là hành vi chủ động.
 *
 * Đây chỉ là gợi ý: Mode người dùng đã chọn tay luôn thắng — xem `resolveActiveSurface`.
 */
export function resolveDefaultSurface(context: SessionContext): SurfaceId {
  if (context.residencyStatus === 'PENDING' || context.residencyStatus === 'ACTIVE') {
    return 'residency';
  }
  if (context.roles.includes('Seller') && context.workspaceStatus !== 'NONE') {
    return 'workspace';
  }
  return 'marketplace';
}

/**
 * Surface thực sự dùng, có tính tới Mode người dùng đã chọn và nhớ lại.
 *
 * Mode đã chọn thắng mặc định, **trừ khi** nó không còn vào được (hết hạn ở trọ → `PAST` rồi
 * `NONE`, hoặc bị thu hồi quyền). Không kiểm lại chỗ này thì người dùng kẹt ở một Surface
 * trắng trơn mà không hiểu vì sao.
 */
export function resolveActiveSurface(
  context: SessionContext,
  preferredSurface: SurfaceId | null,
): SurfaceId {
  if (preferredSurface && canEnterSurface(context, preferredSurface)) {
    return preferredSurface;
  }
  return resolveDefaultSurface(context);
}

/** Lý do bị chặn, kèm lối gỡ. `null` nghĩa là vào và ghi được bình thường. */
export function getSurfaceDenial(context: SessionContext, surface: SurfaceId): AccessDenial | null {
  const level = getSurfaceAccessLevel(context, surface);
  if (level === 'full') return null;

  if (!isAuthenticated(context) && surface !== 'marketplace') {
    return {
      code: 'AUTH_REQUIRED',
      message: 'Bạn cần đăng nhập để dùng tính năng này.',
      redirectTo: SIGN_IN_PATH,
    };
  }

  if (surface === 'workspace') {
    if (context.workspaceStatus === 'NONE') {
      return {
        code: 'WORKSPACE_NOT_STARTED',
        message: 'Bạn chưa mở bộ quản lý. Dùng thử miễn phí để bắt đầu quản lý khu trọ.',
        redirectTo: WORKSPACE_LIMITED_PATH,
      };
    }
    if (context.workspaceStatus === 'READ_ONLY') {
      return {
        code: 'WORKSPACE_READ_ONLY',
        message: 'Gói dịch vụ đã hết hạn. Bạn vẫn xem và xuất được dữ liệu, nhưng chưa sửa được.',
        redirectTo: '/chu-tro/goi-dich-vu',
      };
    }
  }

  if (surface === 'residency') {
    if (context.residencyStatus === 'NONE') {
      return {
        code: 'RESIDENCY_NONE',
        message: 'Bạn chưa được liên kết vào phòng trọ nào.',
        redirectTo: null,
      };
    }
    if (context.residencyStatus === 'PENDING') {
      return {
        code: 'RESIDENCY_PENDING',
        message: 'Bạn cần xác nhận lời mời liên kết trước khi xem dữ liệu phòng.',
        redirectTo: RESIDENCY_LIMITED_PATH,
      };
    }
    if (context.residencyStatus === 'PAST') {
      return {
        code: 'RESIDENCY_PAST',
        message: 'Bạn đã kết thúc ở tại phòng này. Dữ liệu chỉ còn ở chế độ xem lại.',
        redirectTo: null,
      };
    }
  }

  // Marketplace ở mức `read`: khách chưa đăng nhập, xem thoải mái, ghi thì cần đăng nhập.
  return {
    code: 'AUTH_REQUIRED',
    message: 'Bạn cần đăng nhập để dùng tính năng này.',
    redirectTo: SIGN_IN_PATH,
  };
}
