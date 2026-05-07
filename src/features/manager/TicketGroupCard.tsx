import type { KeyboardEvent, MouseEvent } from "react";
import { CalendarDays, RotateCcw, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TicketGroup } from "../../api/types";
import { Card } from "../../components/ui/Card";
import { formatDate, formatTicketGroupTitle } from "../../utils/format";

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
    ? { label: "Вернуть группу", icon: <RotateCcw size={12} />, onClick: () => onRestore(group.id) }
    : onHide
      ? { label: "Скрыть группу", icon: <X size={12} />, onClick: () => onHide(group.id) }
      : null;

  const openGroup = () => navigate(`/manager/groups/${group.id}`);
  const topicTitle = formatTicketGroupTitle(group.title);

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
    <Card className={`group-card group-note status-${group.status}`} role="link" tabIndex={0} onClick={openGroup} onKeyDown={handleKeyDown}>
      <span className="group-note-pin" aria-hidden="true" />
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
        <h3 title={topicTitle}>{topicTitle}</h3>
        <div className="group-meta">
          <span><Users size={13} />{group.ticketCount} тикетов</span>
          <span><CalendarDays size={13} />{formatDate(group.lastTicketCreatedAt)}</span>
        </div>
      </div>
    </Card>
  );
}
