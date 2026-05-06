import { DEV_ROLE } from "./client";
import type {
  ManagerAnalyticsSummary,
  MyTicketsListResponse,
  Ticket,
  TicketGroup,
  TicketGroupListResponse,
  TicketStatus,
  User,
} from "./types";

export const employeeUser: User = {
  id: "usr_employee",
  fullName: "Иван Петров",
  initials: "ИП",
  role: "employee",
};

export const managerUser: User = {
  id: "usr_manager",
  fullName: "Анна Сидорова",
  initials: "АС",
  role: "manager",
};

let tickets: Ticket[] = [
  {
    id: "tkt_124",
    number: "#124",
    title: "Ошибка входа в корпоративную почту после смены пароля",
    description:
      "[AI-enhanced] После смены пароля не удается войти в корпоративную почту. Веб-версия показывает ошибку авторизации, а мобильное приложение постоянно запрашивает пароль.",
    originalDescription: "Поменял пароль и теперь почта не входит ни на телефоне, ни в браузере.",
    aiEnhanced: true,
    status: "in_review",
    managerComment: "Проверяем синхронизацию пароля и настройки почтового шлюза.",
    author: employeeUser,
    groupId: "grp_mail",
    createdAt: "2026-05-06T09:15:00Z",
    updatedAt: "2026-05-06T12:30:00Z",
    resolvedAt: null,
    history: [
      history("h1", "ticket_created", "Тикет создан", "2026-05-06T09:15:00Z", null, "open"),
      history("h2", "group_status_changed", "Статус изменен на In review", "2026-05-06T12:00:00Z", "open", "in_review"),
      history("h3", "manager_comment_updated", "Добавлен комментарий менеджера", "2026-05-06T12:30:00Z", null, null),
    ],
  },
  {
    id: "tkt_123",
    number: "#123",
    title: "VPN отключается в течение дня",
    description: "VPN несколько раз в день разрывает соединение, из-за этого пропадает доступ к внутренним инструментам.",
    originalDescription: null,
    aiEnhanced: false,
    status: "open",
    managerComment: null,
    author: employeeUser,
    groupId: "grp_vpn",
    createdAt: "2026-05-05T10:05:00Z",
    updatedAt: "2026-05-05T10:05:00Z",
    resolvedAt: null,
    history: [history("h4", "ticket_created", "Тикет создан", "2026-05-05T10:05:00Z", null, "open")],
  },
  {
    id: "tkt_122",
    number: "#122",
    title: "Внешний монитор не определяется",
    description: "После обновления ноутбук перестал видеть внешний монитор через USB-C док-станцию.",
    originalDescription: null,
    aiEnhanced: false,
    status: "resolved",
    managerComment: "Обновили драйвер док-станции. Подключение восстановлено.",
    author: employeeUser,
    groupId: "grp_monitor",
    createdAt: "2026-05-03T14:20:00Z",
    updatedAt: "2026-05-04T16:10:00Z",
    resolvedAt: "2026-05-04T16:10:00Z",
    history: [
      history("h5", "ticket_created", "Тикет создан", "2026-05-03T14:20:00Z", null, "open"),
      history("h6", "group_status_changed", "Статус изменен на Resolved", "2026-05-04T16:10:00Z", "open", "resolved"),
    ],
  },
  {
    id: "tkt_121",
    number: "#121",
    title: "Нет доступа к онбординг-материалам",
    description: "Новый сотрудник не видит материалы онбординга и чеклист первого дня.",
    originalDescription: null,
    aiEnhanced: false,
    status: "open",
    managerComment: null,
    author: employeeUser,
    groupId: "grp_onboarding",
    createdAt: "2026-05-02T08:45:00Z",
    updatedAt: "2026-05-02T08:45:00Z",
    resolvedAt: null,
    history: [history("h7", "ticket_created", "Тикет создан", "2026-05-02T08:45:00Z", null, "open")],
  },
];

let groups: TicketGroup[] = [
  group("grp_mail", "Ошибка входа в корпоративную почту после смены пароля", "Несколько сотрудников не могут войти в почту после смены пароля. Проблема похожа на задержку синхронизации учетных данных.", "in_review", 3, "2026-05-06T11:30:00Z", "Проверяем синхронизацию пароля и настройки почтового шлюза."),
  group("grp_vpn", "VPN отключается в течение дня", "Пользователи сообщают о повторяющихся разрывах VPN, из-за которых теряется доступ к внутренним инструментам.", "open", 6, "2026-05-06T10:05:00Z", null),
  group("grp_monitor", "Внешний монитор не определяется после обновления", "После обновления системы часть ноутбуков перестала распознавать мониторы через USB-C док-станции.", "resolved", 4, "2026-05-04T15:20:00Z", "Обновили драйвер док-станции. Подключение восстановлено."),
  group("grp_onboarding", "Нет доступа к онбординг-материалам", "Новые сотрудники не видят чеклист первого дня и базу знаний для онбординга.", "open", 2, "2026-05-02T08:45:00Z", null),
];

function history(
  id: string,
  type: Ticket["history"][number]["type"],
  label: string,
  createdAt: string,
  fromStatus: TicketStatus | null,
  toStatus: TicketStatus | null,
): Ticket["history"][number] {
  return {
    id,
    type,
    label,
    fromStatus,
    toStatus,
    createdAt,
    actor: {
      type: type === "ticket_created" ? "user" : "user",
      id: type === "ticket_created" ? employeeUser.id : managerUser.id,
      displayName: type === "ticket_created" ? employeeUser.fullName : managerUser.fullName,
    },
  };
}

function group(
  id: string,
  title: string,
  aiSummary: string,
  status: TicketStatus,
  ticketCount: number,
  lastTicketCreatedAt: string,
  managerComment: string | null,
): TicketGroup {
  const related = tickets
    .filter((ticket) => ticket.groupId === id)
    .map((ticket) => ({
      ticketId: ticket.id,
      authorSummary: { fullName: ticket.author.fullName, initials: ticket.author.initials },
      descriptionExcerpt: ticket.description.slice(0, 110),
      createdAt: ticket.createdAt,
      aiEnhanced: ticket.aiEnhanced,
      status: ticket.status,
    }));

  return {
    id,
    title,
    aiSummary,
    status,
    ticketCount,
    lastTicketCreatedAt,
    managerComment,
    relatedTickets: related.length ? related : [
      {
        ticketId: `${id}_related`,
        authorSummary: { fullName: "Мария Кузнецова", initials: "МК" },
        descriptionExcerpt: aiSummary,
        createdAt: lastTicketCreatedAt,
        aiEnhanced: false,
        status,
      },
    ],
    createdAt: "2026-05-01T09:00:00Z",
    updatedAt: lastTicketCreatedAt,
  };
}

function meta(totalItems: number, page = 1, pageSize = 20) {
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    hasNextPage: page * pageSize < totalItems,
    hasPreviousPage: page > 1,
  };
}

function wait<T>(value: T): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(value), 350));
}

export const mockApi = {
  getMe: () => wait(DEV_ROLE === "manager" ? managerUser : employeeUser),
  enhance: (originalText: string) =>
    wait({
      originalText,
      enhancedText: `[AI-enhanced] ${originalText.trim()} Описание уточнено: добавлен контекст влияния на работу и ожидаемый результат для менеджера.`,
      aiEnhanced: true as const,
      displayPrefix: "[AI-enhanced]",
    }),
  createTicket: (input: { description: string; originalDescription?: string | null; aiEnhanced: boolean; title?: string }) => {
    const next = tickets.length + 121;
    const ticket: Ticket = {
      id: `tkt_${Date.now()}`,
      number: `#${next}`,
      title: input.title || input.description.replace("[AI-enhanced]", "").trim().slice(0, 72),
      description: input.description,
      originalDescription: input.originalDescription ?? null,
      aiEnhanced: input.aiEnhanced,
      status: "open",
      managerComment: null,
      author: employeeUser,
      groupId: "grp_vpn",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      history: [history(`h_${Date.now()}`, "ticket_created", "Тикет создан", new Date().toISOString(), null, "open")],
    };
    tickets = [ticket, ...tickets];
    return wait(ticket);
  },
  listMyTickets: (query?: string, status?: TicketStatus): Promise<MyTicketsListResponse> => {
    const items = tickets.filter((ticket) => {
      const matchesStatus = !status || ticket.status === status;
      const haystack = `${ticket.title} ${ticket.description}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
    return wait({ items, meta: meta(items.length) });
  },
  getMyTicket: (id: string) => wait(tickets.find((ticket) => ticket.id === id || ticket.number === id) ?? tickets[0]),
  listGroups: (query?: string, status?: TicketStatus): Promise<TicketGroupListResponse> => {
    const items = groups.filter((item) => {
      const matchesStatus = !status || item.status === status;
      const haystack = `${item.title} ${item.aiSummary}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
    return wait({ items, meta: meta(items.length) });
  },
  getGroup: (id: string) => wait(groups.find((item) => item.id === id) ?? groups[0]),
  updateGroupStatus: (id: string, status: TicketStatus) => {
    groups = groups.map((item) => (item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item));
    tickets = tickets.map((ticket) =>
      ticket.groupId === id
        ? {
            ...ticket,
            status,
            updatedAt: new Date().toISOString(),
            history: [
              ...ticket.history,
              history(`h_${Date.now()}`, "group_status_changed", `Статус изменен на ${statusLabel(status)}`, new Date().toISOString(), ticket.status, status),
            ],
          }
        : ticket,
    );
    return wait(groups.find((item) => item.id === id)!);
  },
  saveGroupComment: (id: string, managerComment: string) => {
    groups = groups.map((item) => (item.id === id ? { ...item, managerComment, updatedAt: new Date().toISOString() } : item));
    tickets = tickets.map((ticket) =>
      ticket.groupId === id
        ? {
            ...ticket,
            managerComment,
            updatedAt: new Date().toISOString(),
            history: [...ticket.history, history(`h_${Date.now()}`, "manager_comment_updated", "Добавлен комментарий менеджера", new Date().toISOString(), null, null)],
          }
        : ticket,
    );
    return wait(groups.find((item) => item.id === id)!);
  },
  analytics: (): Promise<ManagerAnalyticsSummary> => {
    const count = (items: Array<{ status: TicketStatus }>) => ({
      open: items.filter((item) => item.status === "open").length,
      in_review: items.filter((item) => item.status === "in_review").length,
      resolved: items.filter((item) => item.status === "resolved").length,
    });
    return wait({
      groupsByStatus: count(groups),
      ticketsByStatus: count(tickets),
      topRepeatedProblems: groups.map((item) => ({
        groupId: item.id,
        title: item.title,
        ticketCount: item.ticketCount,
        status: item.status,
        lastTicketCreatedAt: item.lastTicketCreatedAt,
      })),
    });
  },
};

function statusLabel(status: TicketStatus) {
  return status === "open" ? "Open" : status === "in_review" ? "In review" : "Resolved";
}
