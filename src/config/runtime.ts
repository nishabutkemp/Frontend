type RuntimeConfig = {
  VITE_API_BASE_URL?: string;
  VITE_AUTH_LOGIN_PATH?: string;
  VITE_USE_MOCKS?: string;
  VITE_DEV_AUTH_TOKEN?: string;
  VITE_DEV_USER_ROLE?: string;
};

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeConfig;
  }
}

const buildEnv = import.meta.env as Record<string, string | undefined>;
const runtimeConfig = window.__APP_CONFIG__ ?? {};

export function getEnvValue(key: keyof RuntimeConfig): string | undefined {
  return runtimeConfig[key] ?? buildEnv[key];
}
