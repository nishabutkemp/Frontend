import { ChevronRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { Ticket } from "../../api/types";
import { Badge, StatusBadge } from "../../components/ui/StatusBadge";
import { excerpt, formatDate, stripAiEnhancedPrefix } from "../../utils/format";

export function TicketListItem({ ticket }: { ticket: Ticket }) {
  return (
    <Link className="list-item" to={`/employee/tickets/${ticket.id}`}>
      <div className="list-main">
        <div className="meta-row">
          <strong>{ticket.number}</strong>
          <span>{formatDate(ticket.createdAt)}</span>
          {ticket.aiEnhanced && <Badge>AI-enhanced</Badge>}
        </div>
        <h3>{ticket.title}</h3>
        <p>{excerpt(stripAiEnhancedPrefix(ticket.description))}</p>
        <span className={ticket.managerComment ? "comment-indicator active" : "comment-indicator"}>
          <MessageCircle size={15} />{ticket.managerComment ? "Есть комментарий менеджера" : "Комментария пока нет"}
        </span>
      </div>
      <StatusBadge status={ticket.status} />
      <ChevronRight size={18} className="chevron" />
    </Link>
  );
}
