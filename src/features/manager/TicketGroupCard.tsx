import { Layers, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TicketGroup } from "../../api/types";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { excerpt, formatDate } from "../../utils/format";

export function TicketGroupCard({ group, onHide }: { group: TicketGroup; onHide: (groupId: string) => void }) {
  const navigate = useNavigate();
  return (
    <Card className="group-card">
      <button
        type="button"
        className="icon-button group-hide-button"
        aria-label="Скрыть группу"
        title="Скрыть группу"
        onClick={() => onHide(group.id)}
      >
        <X size={17} />
      </button>
      <div className="group-icon"><Layers size={22} /></div>
      <div className="group-content">
        <div className="card-title-row">
          <h3>{group.title}</h3>
          <StatusBadge status={group.status} />
        </div>
        <span className="overline">AI-резюме</span>
        <p>{excerpt(group.aiSummary, 190)}</p>
        <div className="group-meta">
          <span><Users size={15} />Количество тикетов: {group.ticketCount}</span>
          <span>Последнее обращение: {formatDate(group.lastTicketCreatedAt)}</span>
        </div>
      </div>
      <Button onClick={() => navigate(`/manager/groups/${group.id}`)}>Открыть группу</Button>
    </Card>
  );
}
