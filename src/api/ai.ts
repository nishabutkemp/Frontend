import { apiRequest, USE_MOCKS } from "./client";
import { mockApi } from "./mockData";
import type { EnhanceTicketDescriptionResponse } from "./types";

export function enhanceTicketDescription(originalText: string): Promise<EnhanceTicketDescriptionResponse> {
  if (USE_MOCKS) return mockApi.enhance(originalText);
  return apiRequest<EnhanceTicketDescriptionResponse>("/ai/enhance-ticket-description", {
    method: "POST",
    body: JSON.stringify({ originalText }),
  });
}
