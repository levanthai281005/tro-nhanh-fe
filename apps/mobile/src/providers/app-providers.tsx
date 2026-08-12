import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setTokenGetter } from '@tronhanh/api';
import { useState, type ReactNode } from 'react';

import { getAccessToken } from '@/services/auth-token';

setTokenGetter(getAccessToken);

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 2,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
