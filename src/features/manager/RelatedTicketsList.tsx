import type { RelatedTicket } from "../../api/types";
import { Badge, StatusBadge } from "../../components/ui/StatusBadge";
import { formatDate, stripAiEnhancedPrefix } from "../../utils/format";

export function RelatedTicketsList({ tickets, expanded = false }: { tickets: RelatedTicket[]; expanded?: boolean }) {
  return (
    <div className="related-list">
      {tickets.map((ticket) => (
        <div className={expanded ? "related-row expanded" : "related-row"} key={ticket.ticketId}>
          <div>
            <p className={expanded ? "related-description preserve" : undefined}>
              {stripAiEnhancedPrefix(ticket.description ?? ticket.descriptionExcerpt)}
            </p>
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
          {ticket.aiEnhanced && <Badge>AI</Badge>}
          <StatusBadge status={ticket.status} />
        </div>
      ))}
    </div>
  );
}
