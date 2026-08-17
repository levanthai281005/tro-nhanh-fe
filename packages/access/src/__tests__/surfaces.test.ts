import { describe, expect, it } from 'vitest';
import { getLimitDenial, getRemainingQuota, isWithinLimit } from '../limits';
import { GUEST_SESSION_CONTEXT, parseSessionContext } from '../sessionContext';
import {
  canEnterSurface,
  canWriteInSurface,
  getSurfaceAccessLevel,
  getSurfaceDenial,
  resolveActiveSurface,
  resolveAvailableSurfaces,
  resolveDefaultSurface,
} from '../surfaces';
import type {
  ResidencyStatus,
  SessionContext,
  SurfaceAccessLevel,
  SurfaceId,
  WorkspaceStatus,
} from '../types';

function session(patch: Partial<SessionContext> = {}): SessionContext {
  return {
    ...GUEST_SESSION_CONTEXT,
    userId: 'user-1',
    roles: ['Renter'],
    limits: { maxProperties: 3, maxRooms: 20 },
    ...patch,
  };
}

/**
 * Bảng quyết định §3 của `SURFACES_AND_MODES.md`, chép nguyên sang dạng chạy được.
 * Sửa tài liệu mà quên sửa code (hoặc ngược lại) thì test này đỏ.
 */
describe('bảng quyết định — mức truy cập từng Surface', () => {
  const cases: ReadonlyArray<{
    name: string;
    context: SessionContext;
    expected: Record<SurfaceId, SurfaceAccessLevel>;
  }> = [
    {
      name: 'khách chưa đăng nhập',
      context: GUEST_SESSION_CONTEXT,
      expected: { marketplace: 'read', workspace: 'none', residency: 'none' },
    },
    {
      name: 'Renter đã đăng nhập, chưa mở Workspace, chưa ở trọ',
      context: session(),
      expected: { marketplace: 'full', workspace: 'limited', residency: 'none' },
    },
    {
      name: 'Seller đang dùng thử',
      context: session({ roles: ['Renter', 'Seller'], workspaceStatus: 'TRIAL' }),
      expected: { marketplace: 'full', workspace: 'full', residency: 'none' },
    },
    {
      name: 'Seller gói còn hạn',
      context: session({ roles: ['Renter', 'Seller'], workspaceStatus: 'ACTIVE' }),
      expected: { marketplace: 'full', workspace: 'full', residency: 'none' },
    },
    {
      name: 'Seller hết hạn gói — READ_ONLY, dữ liệu giữ nguyên (BR-015)',
      context: session({ roles: ['Renter', 'Seller'], workspaceStatus: 'READ_ONLY' }),
      expected: { marketplace: 'full', workspace: 'read', residency: 'none' },
    },
    {
      name: 'người ở chờ xác nhận liên kết (BR-029)',
      context: session({ residencyStatus: 'PENDING' }),
      expected: { marketplace: 'full', workspace: 'limited', residency: 'limited' },
    },
    {
      name: 'người ở đang thuê',
      context: session({ residencyStatus: 'ACTIVE' }),
      expected: { marketplace: 'full', workspace: 'limited', residency: 'full' },
    },
    {
      name: 'người ở đã kết thúc — chỉ đọc lịch sử',
      context: session({ residencyStatus: 'PAST' }),
      expected: { marketplace: 'full', workspace: 'limited', residency: 'read' },
    },
    {
      name: 'vừa là chủ trọ vừa đang đi thuê chỗ khác',
      context: session({
        roles: ['Renter', 'Seller'],
        workspaceStatus: 'ACTIVE',
        residencyStatus: 'ACTIVE',
      }),
      expected: { marketplace: 'full', workspace: 'full', residency: 'full' },
    },
  ];

  for (const { name, context, expected } of cases) {
    it(name, () => {
      for (const surface of Object.keys(expected) as SurfaceId[]) {
        expect(getSurfaceAccessLevel(context, surface)).toBe(expected[surface]);
      }
    });
  }
});

describe('canEnterSurface / canWriteInSurface', () => {
  it('Marketplace luôn vào được, kể cả khách chưa đăng nhập', () => {
    expect(canEnterSurface(GUEST_SESSION_CONTEXT, 'marketplace')).toBe(true);
  });

  it('khách chưa đăng nhập không vào được Workspace lẫn Residency', () => {
    expect(canEnterSurface(GUEST_SESSION_CONTEXT, 'workspace')).toBe(false);
    expect(canEnterSurface(GUEST_SESSION_CONTEXT, 'residency')).toBe(false);
  });

  it('workspaceStatus NONE vào được nhưng KHÔNG ghi được — B1 là lối kích hoạt', () => {
    const context = session({ workspaceStatus: 'NONE' });
    expect(canEnterSurface(context, 'workspace')).toBe(true);
    expect(canWriteInSurface(context, 'workspace')).toBe(false);
  });

  it('READ_ONLY đọc được nhưng mọi thao tác ghi bị khóa (BR-015)', () => {
    const context = session({ roles: ['Seller'], workspaceStatus: 'READ_ONLY' });
    expect(canEnterSurface(context, 'workspace')).toBe(true);
    expect(canWriteInSurface(context, 'workspace')).toBe(false);
    expect(getSurfaceDenial(context, 'workspace')?.code).toBe('WORKSPACE_READ_ONLY');
  });

  it('TRIAL ghi được như ACTIVE, chỉ khác ở hạn mức', () => {
    expect(canWriteInSurface(session({ workspaceStatus: 'TRIAL' }), 'workspace')).toBe(true);
    expect(canWriteInSurface(session({ workspaceStatus: 'ACTIVE' }), 'workspace')).toBe(true);
  });

  it('người ở PENDING chưa xem được dữ liệu phòng, chỉ vào màn xác nhận', () => {
    const context = session({ residencyStatus: 'PENDING' });
    expect(canWriteInSurface(context, 'residency')).toBe(false);
    expect(getSurfaceDenial(context, 'residency')?.code).toBe('RESIDENCY_PENDING');
  });
});

describe('Mode ≠ Role — chọn Surface', () => {
  it('người ở có việc cần làm được ưu tiên hơn Workspace', () => {
    const context = session({
      roles: ['Renter', 'Seller'],
      workspaceStatus: 'ACTIVE',
      residencyStatus: 'PENDING',
    });
    expect(resolveDefaultSurface(context)).toBe('residency');
  });

  it('Seller đã mở Workspace thì mặc định vào Workspace', () => {
    const context = session({ roles: ['Renter', 'Seller'], workspaceStatus: 'TRIAL' });
    expect(resolveDefaultSurface(context)).toBe('workspace');
  });

  it('Seller chưa mở Workspace vẫn mặc định ở Marketplace', () => {
    const context = session({ roles: ['Renter', 'Seller'], workspaceStatus: 'NONE' });
    expect(resolveDefaultSurface(context)).toBe('marketplace');
  });

  it('Mode người dùng chọn tay thắng mặc định', () => {
    const context = session({
      roles: ['Renter', 'Seller'],
      workspaceStatus: 'ACTIVE',
      residencyStatus: 'ACTIVE',
    });
    expect(resolveActiveSurface(context, 'workspace')).toBe('workspace');
  });

  it('Mode đã chọn nhưng không còn vào được thì rơi về mặc định, không kẹt màn trắng', () => {
    const context = session({ residencyStatus: 'NONE' });
    expect(resolveActiveSurface(context, 'residency')).toBe('marketplace');
  });

  it('một tài khoản có thể đứng ở cả ba Surface', () => {
    const context = session({
      roles: ['Renter', 'Seller'],
      workspaceStatus: 'ACTIVE',
      residencyStatus: 'ACTIVE',
    });
    expect(resolveAvailableSurfaces(context)).toEqual(['marketplace', 'workspace', 'residency']);
  });
});

describe('hạn mức gói (BR-015)', () => {
  const context = session({
    roles: ['Seller'],
    workspaceStatus: 'ACTIVE',
    limits: { maxProperties: 3, maxRooms: 20 },
  });

  it('còn chỗ thì tạo được', () => {
    expect(isWithinLimit(context, 'properties', 2)).toBe(true);
    expect(getLimitDenial(context, 'properties', 2)).toBeNull();
  });

  it('chạm hạn mức thì chặn tạo mới kèm lối nâng gói', () => {
    expect(isWithinLimit(context, 'properties', 3)).toBe(false);
    const denial = getLimitDenial(context, 'properties', 3);
    expect(denial?.code).toBe('LIMIT_REACHED');
    expect(denial?.redirectTo).toBe('/chu-tro/goi-dich-vu');
  });

  it('over-limit vẫn hợp lệ: chỉ chặn tạo mới, không báo số âm', () => {
    expect(isWithinLimit(context, 'rooms', 25)).toBe(false);
    expect(getRemainingQuota(context, 'rooms', 25)).toBe(0);
  });
});

describe('parseSessionContext', () => {
  it('nhận payload hợp lệ của GET /me/context', () => {
    const parsed = parseSessionContext({
      userId: 'user-1',
      roles: ['Renter', 'Seller'],
      workspaceStatus: 'TRIAL',
      residencyStatus: 'NONE',
      limits: { maxProperties: 3, maxRooms: 20 },
      trialEndsAt: '2026-09-16T00:00:00.000Z',
      subscriptionExpiresAt: null,
    });
    expect(parsed.workspaceStatus).toBe('TRIAL');
  });

  it('từ chối trạng thái lạ thay vì im lặng cho qua', () => {
    expect(() =>
      parseSessionContext({ ...GUEST_SESSION_CONTEXT, workspaceStatus: 'EXPIRED' }),
    ).toThrow();
  });
});
