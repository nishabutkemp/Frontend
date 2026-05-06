import type { ApiErrorPayload } from "./types";
import { getEnvValue } from "../config/runtime";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const API_BASE_URL = getEnvValue("VITE_API_BASE_URL")?.replace(/\/$/, "") ?? "";
export const USE_MOCKS = getEnvValue("VITE_USE_MOCKS") !== "false" && !API_BASE_URL;
export const DEV_ROLE = getEnvValue("VITE_DEV_USER_ROLE") === "manager" ? "manager" : "employee";
const AUTH_TOKEN_KEY = "fastretro_tickets_auth_token";

export function getAuthToken(): string {
  return window.localStorage.getItem(AUTH_TOKEN_KEY) ?? getEnvValue("VITE_DEV_AUTH_TOKEN") ?? "";
}

export function hasAuthToken(): boolean {
  return USE_MOCKS || Boolean(getAuthToken());
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    let message = "Не удалось выполнить запрос. Попробуйте позже.";
    try {
      const payload = (await response.json()) as ApiErrorPayload;
      message = payload.error?.message ?? message;
    } catch {
      // keep user-friendly fallback
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function toQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}
