export type UserRole = "employee" | "manager";
export type TicketStatus = "open" | "in_review" | "resolved";
export type ActorType = "user" | "system" | "ai";
export type TicketHistoryEventType =
  | "ticket_created"
  | "group_assigned"
  | "group_status_changed"
  | "manager_comment_updated";

export type User = {
  id: string;
  fullName: string;
  initials: string;
  role: UserRole;
};

export type Actor = {
  type: ActorType;
  id?: string | null;
  displayName: string;
};

export type TicketHistoryEvent = {
  id: string;
  type: TicketHistoryEventType;
  label: string;
  fromStatus?: TicketStatus | null;
  toStatus?: TicketStatus | null;
  createdAt: string;
  actor: Actor;
};

export type Ticket = {
  id: string;
  number: string;
  title: string;
  description: string;
  originalDescription?: string | null;
  aiEnhanced: boolean;
  status: TicketStatus;
  managerComment?: string | null;
  author: User;
  groupId?: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  history: TicketHistoryEvent[];
};

export type RelatedTicket = {
  ticketId: string;
  authorSummary: {
    fullName: string;
    initials: string;
  };
  description?: string;
  descriptionFull?: string;
  fullDescription?: string;
  originalDescription?: string | null;
  message?: string;
  text?: string;
  body?: string;
  descriptionExcerpt: string;
  createdAt: string;
  aiEnhanced: boolean;
  status: TicketStatus;
};

export type TicketGroup = {
  id: string;
  title: string;
  aiSummary: string;
  status: TicketStatus;
  ticketCount: number;
  lastTicketCreatedAt: string;
  managerComment?: string | null;
  relatedTickets: RelatedTicket[];
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type MyTicketsListResponse = {
  items: Ticket[];
  meta: PaginationMeta;
};

export type TicketGroupListResponse = {
  items: TicketGroup[];
  meta: PaginationMeta;
};

export type EnhanceTicketDescriptionRequest = {
  originalText: string;
};

export type EnhanceTicketDescriptionResponse = {
  originalText: string;
  enhancedText: string;
  aiEnhanced: true;
  displayPrefix: string;
};

export type CreateTicketRequest = {
  title?: string;
  description: string;
  originalDescription?: string | null;
  aiEnhanced: boolean;
};

export type UpdateTicketGroupStatusRequest = {
  status: TicketStatus;
};

export type SaveTicketGroupCommentRequest = {
  managerComment: string;
};

export type StatusCount = {
  open: number;
  in_review: number;
  resolved: number;
};

export type TopRepeatedProblem = {
  groupId: string;
  title: string;
  ticketCount: number;
  status: TicketStatus;
  lastTicketCreatedAt: string;
};

export type ManagerAnalyticsSummary = {
  groupsByStatus: StatusCount;
  ticketsByStatus: StatusCount;
  topRepeatedProblems: TopRepeatedProblem[];
};

export type ApiErrorPayload = {
  error?: {
    code: string;
    message: string;
    details: Array<{ field: string; issue: string }>;
    requestId: string;
  };
};
