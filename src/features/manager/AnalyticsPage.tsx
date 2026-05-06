import { useEffect, useState } from "react";
import type { ManagerAnalyticsSummary } from "../../api/types";
import { getManagerAnalyticsSummary } from "../../api/manager";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/States";
import { formatDate } from "../../utils/format";

export function AnalyticsPage() {
  const [data, setData] = useState<ManagerAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getManagerAnalyticsSummary()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Не удалось загрузить аналитику."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState title="Аналитика пока недоступна" />;

  const totalGroups = data.groupsByStatus.open + data.groupsByStatus.in_review + data.groupsByStatus.resolved;
  const totalTickets = data.ticketsByStatus.open + data.ticketsByStatus.in_review + data.ticketsByStatus.resolved;

  return (
    <div className="page-stack">
      <PageHeader title="Аналитика" subtitle="Краткая сводка по повторяющимся проблемам." />
      <div className="metrics-grid">
        <Metric title="Всего групп" value={totalGroups} />
        <Metric title="Всего тикетов" value={totalTickets} />
        <Metric title="Открытые группы" value={data.groupsByStatus.open} />
        <Metric title="Группы на рассмотрении" value={data.groupsByStatus.in_review} />
        <Metric title="Решенные группы" value={data.groupsByStatus.resolved} />
      </div>
      <Card>
        <h3>Топ повторяющихся проблем</h3>
        <div className="analytics-list">
          {data.topRepeatedProblems.map((problem) => (
            <div key={problem.groupId} className="analytics-row">
              <div>
                <strong>{problem.title}</strong>
                <p>{problem.ticketCount} тикетов · последнее обращение {formatDate(problem.lastTicketCreatedAt)}</p>
              </div>
              <StatusBadge status={problem.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <Card className="metric-card">
      <span>{title}</span>
      <strong>{value}</strong>
    </Card>
  );
}
