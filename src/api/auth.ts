import { apiRequest, setAuthToken } from "./client";
import { getEnvValue } from "../config/runtime";
import type { User } from "./types";

const LOGIN_PATH = getEnvValue("VITE_AUTH_LOGIN_PATH") ?? "/auth/login";
const DEV_EMPLOYEE_LOGIN_PATH = "/auth/dev/employee-token";
const DEV_MANAGER_LOGIN_PATH = "/auth/dev/manager-token";

export type AuthTokenResponse = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  jwt?: string;
  tokenType?: string;
  expiresIn?: number;
  user?: User;
};

type LoginResponse = AuthTokenResponse;

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

export async function loginAsDevEmployee(): Promise<AuthTokenResponse> {
  return loginWithDevEndpoint(DEV_EMPLOYEE_LOGIN_PATH);
}

export async function loginAsDevManager(): Promise<AuthTokenResponse> {
  return loginWithDevEndpoint(DEV_MANAGER_LOGIN_PATH);
}

async function loginWithDevEndpoint(path: string): Promise<AuthTokenResponse> {
  const payload = await apiRequest<AuthTokenResponse>(path, {
    method: "POST",
  });
  const token = extractToken(payload);
  if (!token) {
    throw new Error("Сервер не вернул токен авторизации.");
  }
  if (!payload.user) {
    throw new Error("Сервер не вернул пользователя.");
  }
  setAuthToken(token);
  return payload;
}

export async function loginWithToken(token: string): Promise<void> {
  setAuthToken(token);
}
