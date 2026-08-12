import axios from 'axios';

const getEnvironmentVariable = (name: string): string | undefined => {
  const runtimeProcess = (
    globalThis as typeof globalThis & {
      process?: { env: Record<string, string | undefined> };
    }
  ).process;

  return runtimeProcess?.env[name];
};

export const apiClient = axios.create({
  baseURL:
    getEnvironmentVariable('NEXT_PUBLIC_API_URL') ?? getEnvironmentVariable('EXPO_PUBLIC_API_URL'),
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

let getToken: () => Promise<string | null> = async () => null;

export function setTokenGetter(tokenGetter: typeof getToken): void {
  getToken = tokenGetter;
}

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
