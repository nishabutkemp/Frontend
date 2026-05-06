import { useEffect, useMemo, useState } from "react";
import type { TicketGroup, TicketStatus } from "../../api/types";
import { listManagerTicketGroups } from "../../api/manager";
import { PageHeader } from "../../components/layout/PageHeader";
import { Badge } from "../../components/ui/StatusBadge";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/States";
import { FilterChips } from "../../components/ui/FilterChips";
import { SearchInput } from "../../components/ui/SearchInput";
import { TicketGroupCard } from "./TicketGroupCard";

export function ManagerGroupsPage() {
  const [groups, setGroups] = useState<TicketGroup[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useMemo(() => ({ query, status: status === "all" ? undefined : status }), [query, status]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    listManagerTicketGroups(params)
      .then((response) => active && setGroups(response.items))
      .catch((err) => active && setError(err instanceof Error ? err.message : "Не удалось загрузить группы."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [params]);

  return (
    <div className="page-stack">
      <PageHeader
        title="AI-пул проблем"
        subtitle="Похожие тикеты автоматически объединены в группы, чтобы быстрее увидеть повторяющиеся темы."
        aside={<Badge>Роль: Менеджер</Badge>}
      />
      <div className="toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="Поиск по группам" label="Поиск по группам" />
        <FilterChips value={status} onChange={setStatus} />
      </div>
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!loading && !error && groups.length === 0 && <EmptyState title="Группы не найдены" text="Попробуйте изменить поиск или фильтр." />}
      {!loading && !error && <div className="group-list">{groups.map((group) => <TicketGroupCard key={group.id} group={group} />)}</div>}
    </div>
  );
}
