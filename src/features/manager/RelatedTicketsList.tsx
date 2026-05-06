import type { RelatedTicket } from "../../api/types";
import { Badge, StatusBadge } from "../../components/ui/StatusBadge";
import { excerpt, formatDate, stripAiEnhancedPrefix } from "../../utils/format";

function getFullTicketText(ticket: RelatedTicket) {
  return (
    ticket.fullDescription ??
    ticket.descriptionFull ??
    ticket.description ??
    ticket.originalDescription ??
    ticket.message ??
    ticket.text ??
    ticket.body ??
    ticket.descriptionExcerpt
  );
}

function getTicketText(ticket: RelatedTicket, expanded: boolean) {
  const text = stripAiEnhancedPrefix(getFullTicketText(ticket));
  return expanded ? text : excerpt(text, 100);
}

export function RelatedTicketsList({ tickets, expanded = false }: { tickets: RelatedTicket[]; expanded?: boolean }) {
  return (
    <div className="related-list">
      {tickets.map((ticket) => (
        <div className={expanded ? "related-row expanded" : "related-row"} key={ticket.ticketId}>
          <div>
            <p className={expanded ? "related-description preserve" : "related-description compact"}>{getTicketText(ticket, expanded)}</p>
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
          {ticket.aiEnhanced && <Badge>AI</Badge>}
          <StatusBadge status={ticket.status} />
        </div>
      ))}
    </div>
  );
}
