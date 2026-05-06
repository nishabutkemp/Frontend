import { apiRequest, toQuery, USE_MOCKS } from "./client";
import { mockApi } from "./mockData";
import type { CreateTicketRequest, MyTicketsListResponse, Ticket, TicketStatus } from "./types";

export function createTicket(input: CreateTicketRequest): Promise<Ticket> {
  if (USE_MOCKS) return mockApi.createTicket(input);
  return apiRequest<Ticket>("/tickets", { method: "POST", body: JSON.stringify(input) });
}

export function listMyTickets(params: { query?: string; status?: TicketStatus; page?: number; pageSize?: number }): Promise<MyTicketsListResponse> {
  if (USE_MOCKS) return mockApi.listMyTickets(params.query, params.status);
  return apiRequest<MyTicketsListResponse>(`/tickets/my${toQuery(params)}`);
}

export function getMyTicket(ticketId: string): Promise<Ticket> {
  if (USE_MOCKS) return mockApi.getMyTicket(ticketId);
  return apiRequest<Ticket>(`/tickets/my/${ticketId}`);
}
