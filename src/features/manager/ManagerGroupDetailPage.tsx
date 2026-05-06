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
import { statusOptions } from "../../utils/format";
import { GroupStatusSelector } from "./GroupStatusSelector";
import { ManagerCommentForm } from "./ManagerCommentForm";
import { RelatedTicketsList } from "./RelatedTicketsList";

export function ManagerGroupDetailPage() {
  const { groupId = "" } = useParams();
  const { showToast } = useApp();
  const [group, setGroup] = useState<TicketGroup | null>(null);
  const [comment, setComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>("open");
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
      <BackButton>Назад к AI-пулу</BackButton>
      <PageHeader title={`Группа: ${group.title}`} subtitle="AI объединил похожие тикеты в одну группу для обработки." />
      {error && <ErrorState message={error} />}
      <div className="detail-grid">
        <Card className="summary-card">
          <GroupStatusSelector value={selectedStatus} onChange={setSelectedStatus} disabled={saving} />
          <div className="metric-inline"><Users size={18} />{group.ticketCount} тикетов</div>
          <StatusBadge status={group.status} />
          <span className="overline">AI-резюме</span>
          <p>{group.aiSummary}</p>
          <Button variant="secondary" onClick={changeStatus} disabled={saving || selectedStatus === group.status}>Изменить статус</Button>
        </Card>
        <Card>
          <h3>Статусы</h3>
          <div className="status-list">
            {statusOptions.map((status) => (
              <button key={status.value} className={selectedStatus === status.value ? "status-option active" : "status-option"} onClick={() => setSelectedStatus(status.value)}>
                <CheckCircle2 size={17} />{status.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <div className="card-title-row">
          <h3>Связанные тикеты</h3>
          <Button variant="ghost">Показать все {group.ticketCount} тикетов</Button>
        </div>
        <RelatedTicketsList tickets={group.relatedTickets} />
      </Card>
      <Card>
        <ManagerCommentForm value={comment} onChange={setComment} onSave={saveComment} disabled={saving} />
      </Card>
    </div>
  );
}
