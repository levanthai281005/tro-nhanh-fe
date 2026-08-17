import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { WorkspaceShell } from '@/components/shells/WorkspaceShell';
import { SessionContextProvider } from '@/features/session/components/SessionContextProvider';
import { MOCK_TRIAL_DAYS_LEFT } from '@/features/session/constants/mockSessionContext';
import { getSessionContext } from '@/features/session/services/sessionContextService';

/**
 * Surface Workspace không bao giờ được Google index: toàn bộ nằm sau đăng nhập và chứa dữ
 * liệu vận hành riêng tư của chủ trọ (BR-007). Khai báo ở đây, không chờ tới lúc tách
 * subdomain `quanly.tronhanh.vn` mới nhớ ra.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function WorkspaceLayout({ children }: Readonly<{ children: ReactNode }>) {
  const sessionContext = await getSessionContext();

  return (
    <SessionContextProvider value={sessionContext}>
      <WorkspaceShell
        trialDaysLeft={MOCK_TRIAL_DAYS_LEFT}
        workspaceStatus={sessionContext.workspaceStatus}
      >
        {children}
      </WorkspaceShell>
    </SessionContextProvider>
  );
}
