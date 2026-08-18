'use client';

import { GUEST_SESSION_CONTEXT, type SessionContext } from '@tronhanh/access';
import { createContext, useContext, type ReactNode } from 'react';

/**
 * Đưa `SessionContext` đã lấy ở Server Component xuống cây client.
 *
 * Cố ý **không** tự fetch trong provider: phiên phải có sẵn ngay ở lần render đầu, nếu không
 * mỗi màn có gating sẽ chớp một nhịp "chưa biết quyền" rồi mới vẽ lại — đúng kiểu lỗi mà việc
 * chọn Next.js là để tránh.
 */
const SessionContextValue = createContext<SessionContext>(GUEST_SESSION_CONTEXT);

export function SessionContextProvider({
  value,
  children,
}: {
  value: SessionContext;
  children: ReactNode;
}) {
  return <SessionContextValue.Provider value={value}>{children}</SessionContextValue.Provider>;
}

export function useSessionContext(): SessionContext {
  return useContext(SessionContextValue);
}
