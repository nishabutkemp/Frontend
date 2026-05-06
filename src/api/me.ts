import { apiRequest, USE_MOCKS } from "./client";
import { mockApi } from "./mockData";
import type { User } from "./types";

export function getMe(): Promise<User> {
  return USE_MOCKS ? mockApi.getMe() : apiRequest<User>("/me");
}
