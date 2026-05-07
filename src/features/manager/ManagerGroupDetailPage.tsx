import { CheckCircle2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { TicketGroup, TicketStatus } from "../../api/types";
import { getManagerTicketGroup, saveManagerTicketGroupComment, updateManagerTicketGroupStatus } from "../../api/manager";
import { useApp } from "../../app/providers";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/ui/BackButton";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/States";
import { formatTicketGroupTitle, statusOptions } from "../../utils/format";
import { ManagerCommentForm } from "./ManagerCommentForm";
import { RelatedTicketsList } from "./RelatedTicketsList";

export function ManagerGroupDetailPage() {
  const { groupId = "" } = useParams();
  const { showToast } = useApp();
  const [group, setGroup] = useState<TicketGroup | null>(null);
  const [comment, setComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>("open");
  const [showAllTickets, setShowAllTickets] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getManagerTicketGroup(groupId);
      setGroup(response);
      setComment(response.managerComment ?? "");
      setSelectedStatus(response.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить группу.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [groupId]);

  const saveComment = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await saveManagerTicketGroupComment(groupId, comment.trim());
      setGroup(updated);
      showToast("Комментарий сохранён.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить комментарий.");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateManagerTicketGroupStatus(groupId, selectedStatus);
      setGroup(updated);
      showToast("Статус обновлён.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось изменить статус.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error && !group) return <ErrorState message={error} onRetry={load} />;
  if (!group) return <EmptyState title="Группа не найдена" />;

  return (
    <div className="page-stack">
      <BackButton>Назад к группам тикетов</BackButton>
      <PageHeader title={formatTicketGroupTitle(group.title)} />
      {error && <ErrorState message={error} />}
      <div className="detail-grid">
        <Card className="summary-card">
          <div className="metric-inline"><Users size={18} />{group.ticketCount} тикетов</div>
          <div className="summary-status-actions">
            <StatusBadge status={group.status} className="summary-status-badge" />
            <Button variant="secondary" onClick={changeStatus} disabled={saving || selectedStatus === group.status}>Сохранить статус</Button>
          </div>
        </Card>
        <Card>
          <h3>Новый статус группы</h3>
          <div className="status-list">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                className={selectedStatus === status.value ? "status-option active" : "status-option"}
                onClick={() => setSelectedStatus(status.value)}
                disabled={saving}
              >
                <CheckCircle2 size={17} />{status.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <h3>Описание проблемы</h3>
        <p className="preserve">{group.aiSummary}</p>
      </Card>
      <Card>
        <div className="card-title-row">
          <h3>Связанные тикеты</h3>
          <Button variant="ghost" onClick={() => setShowAllTickets((value) => !value)}>
            {showAllTickets ? "Свернуть описания" : "Развернуть описания"}
          </Button>
        </div>
        <RelatedTicketsList tickets={group.relatedTickets} expanded={showAllTickets} />
      </Card>
      <Card>
        <ManagerCommentForm value={comment} onChange={setComment} onSave={saveComment} disabled={saving} />
      </Card>
    </div>
  );
}
