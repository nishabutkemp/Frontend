import type { KeyboardEvent, MouseEvent } from "react";
import { RotateCcw, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TicketGroup } from "../../api/types";
import { Card } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { formatDate } from "../../utils/format";

export function TicketGroupCard({
  group,
  onHide,
  onRestore,
}: {
  group: TicketGroup;
  onHide?: (groupId: string) => void;
  onRestore?: (groupId: string) => void;
}) {
  const navigate = useNavigate();
  const action = onRestore
    ? { label: "Вернуть группу", icon: <RotateCcw size={14} />, onClick: () => onRestore(group.id) }
    : onHide
      ? { label: "Скрыть группу", icon: <X size={14} />, onClick: () => onHide(group.id) }
      : null;

  const openGroup = () => navigate(`/manager/groups/${group.id}`);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGroup();
    }
  };

  const handleActionClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    action?.onClick();
  };

  return (
    <Card className="group-card" role="link" tabIndex={0} onClick={openGroup} onKeyDown={handleKeyDown}>
      {action && (
        <button
          type="button"
          className="icon-button group-hide-button"
          aria-label={action.label}
          title={action.label}
          onClick={handleActionClick}
        >
          {action.icon}
        </button>
      )}
      <div className="group-content">
        <div className="card-title-row">
          <h3>{group.title}</h3>
        </div>
        <div className="group-meta">
          <span><Users size={15} />Количество тикетов: {group.ticketCount}</span>
          <span>Последнее обращение: {formatDate(group.lastTicketCreatedAt)}</span>
        </div>
      </div>
      <StatusBadge status={group.status} />
    </Card>
  );
}
