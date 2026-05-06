import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Ticket } from "../../api/types";
import { getMyTicket } from "../../api/tickets";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/ui/BackButton";
import { Card } from "../../components/ui/Card";
import { Badge, StatusBadge } from "../../components/ui/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/States";
import { Timeline } from "../../components/ui/Timeline";
import { formatDate, stripAiEnhancedPrefix } from "../../utils/format";

export function TicketDetailPage() {
  const { ticketId = "" } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMyTicket(ticketId)
      .then(setTicket)
      .catch((err) => setError(err instanceof Error ? err.message : "Не удалось загрузить тикет."))
      .finally(() => setLoading(false));
  }, [ticketId]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!ticket) return <EmptyState title="Тикет не найден" />;

  return (
    <div className="page-stack">
      <BackButton>Назад к моим тикетам</BackButton>
      <PageHeader title="Тикет" subtitle="Просмотр статуса обращения и комментария менеджера." />
      <Card>
        <div className="detail-header">
          <div>
            <h2>{ticket.title}</h2>
            <p>{formatDate(ticket.createdAt)}</p>
          </div>
          <StatusBadge status={ticket.status} />
          <span className="lock-label"><Lock size={15} />Приватный</span>
        </div>
      </Card>
      <Card>
        <div className="card-title-row">
          <h3>Описание</h3>
          {ticket.aiEnhanced && <Badge>AI-enhanced</Badge>}
        </div>
        <p className="preserve">{stripAiEnhancedPrefix(ticket.description)}</p>
      </Card>
      <Card>
        <h3>Комментарий менеджера</h3>
        {ticket.managerComment ? <p className="preserve">{ticket.managerComment}</p> : <EmptyState title="Комментарий менеджера пока не добавлен." />}
      </Card>
      <Card>
        <h3>История</h3>
        <Timeline events={ticket.history} />
      </Card>
    </div>
  );
}
