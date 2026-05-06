import { apiRequest, toQuery, USE_MOCKS } from "./client";
import { mockApi } from "./mockData";
import type { ManagerAnalyticsSummary, TicketGroup, TicketGroupListResponse, TicketStatus } from "./types";

export function listManagerTicketGroups(params: { query?: string; status?: TicketStatus; page?: number; pageSize?: number }): Promise<TicketGroupListResponse> {
  if (USE_MOCKS) return mockApi.listGroups(params.query, params.status);
  return apiRequest<TicketGroupListResponse>(`/manager/ticket-groups${toQuery(params)}`);
}

export function getManagerTicketGroup(groupId: string): Promise<TicketGroup> {
  if (USE_MOCKS) return mockApi.getGroup(groupId);
  return apiRequest<TicketGroup>(`/manager/ticket-groups/${groupId}`);
}

export function updateManagerTicketGroupStatus(groupId: string, status: TicketStatus): Promise<TicketGroup> {
  if (USE_MOCKS) return mockApi.updateGroupStatus(groupId, status);
  return apiRequest<TicketGroup>(`/manager/ticket-groups/${groupId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function saveManagerTicketGroupComment(groupId: string, managerComment: string): Promise<TicketGroup> {
  if (USE_MOCKS) return mockApi.saveGroupComment(groupId, managerComment);
  return apiRequest<TicketGroup>(`/manager/ticket-groups/${groupId}/comment`, {
    method: "PUT",
    body: JSON.stringify({ managerComment }),
  });
}

export function getManagerAnalyticsSummary(): Promise<ManagerAnalyticsSummary> {
  return USE_MOCKS ? mockApi.analytics() : apiRequest<ManagerAnalyticsSummary>("/manager/analytics/summary");
}
