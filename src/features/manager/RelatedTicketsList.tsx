import type { RelatedTicket } from "../../api/types";
import { Badge, StatusBadge } from "../../components/ui/StatusBadge";
import { formatDate } from "../../utils/format";

export function RelatedTicketsList({ tickets }: { tickets: RelatedTicket[] }) {
  return (
    <div className="related-list">
      {tickets.map((ticket) => (
        <div className="related-row" key={ticket.ticketId}>
          <div className="mini-avatar">{ticket.authorSummary.initials}</div>
          <div>
            <strong>#{ticket.ticketId.replace("tkt_", "")} · {ticket.authorSummary.fullName}</strong>
            <p>{ticket.descriptionExcerpt}</p>
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
          {ticket.aiEnhanced && <Badge>AI</Badge>}
          <StatusBadge status={ticket.status} />
        </div>
      ))}
    </div>
  );
}
