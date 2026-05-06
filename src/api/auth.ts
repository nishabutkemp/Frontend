import { apiRequest, setAuthToken } from "./client";
import type { User } from "./types";

const env = import.meta.env as Record<string, string | undefined>;
const LOGIN_PATH = env.VITE_AUTH_LOGIN_PATH ?? "/auth/login";

type LoginResponse = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  jwt?: string;
  user?: User;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

function extractToken(payload: LoginResponse): string {
  return payload.accessToken ?? payload.access_token ?? payload.token ?? payload.jwt ?? "";
}

export async function loginWithCredentials(credentials: LoginCredentials): Promise<LoginResponse> {
  const payload = await apiRequest<LoginResponse>(LOGIN_PATH, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  const token = extractToken(payload);
  if (!token) {
    throw new Error("Сервер не вернул токен авторизации.");
  }
  setAuthToken(token);
  return payload;
}

export async function loginWithToken(token: string): Promise<void> {
  setAuthToken(token);
}
