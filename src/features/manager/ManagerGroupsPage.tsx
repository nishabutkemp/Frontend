import { useEffect, useMemo, useState } from "react";
import { EyeOff, Ticket } from "lucide-react";
import { useApp } from "../../app/providers";
import type { TicketGroup, TicketStatus } from "../../api/types";
import { listManagerTicketGroups } from "../../api/manager";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/States";
import { FilterChips } from "../../components/ui/FilterChips";
import { SearchInput } from "../../components/ui/SearchInput";
import { TicketGroupCard } from "./TicketGroupCard";

export function ManagerGroupsPage() {
  const { user, showToast } = useApp();
  const [groups, setGroups] = useState<TicketGroup[]>([]);
  const [hiddenGroupIds, setHiddenGroupIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [showHidden, setShowHidden] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useMemo(() => ({ query, status: status === "all" ? undefined : status }), [query, status]);
  const hiddenStorageKey = `manager:hidden-ticket-groups:${user?.id ?? "anonymous"}`;
  const hiddenGroupSet = useMemo(() => new Set(hiddenGroupIds), [hiddenGroupIds]);
  const visibleGroups = useMemo(() => groups.filter((group) => !hiddenGroupSet.has(group.id)), [groups, hiddenGroupSet]);
  const hiddenGroups = useMemo(() => groups.filter((group) => hiddenGroupSet.has(group.id)), [groups, hiddenGroupSet]);
  const displayedGroups = useMemo(
    () =>
      [...(showHidden ? hiddenGroups : visibleGroups)].sort(
        (firstGroup, secondGroup) =>
          new Date(secondGroup.lastTicketCreatedAt).getTime() - new Date(firstGroup.lastTicketCreatedAt).getTime(),
      ),
    [hiddenGroups, showHidden, visibleGroups],
  );

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(hiddenStorageKey);
      const parsedValue = rawValue ? JSON.parse(rawValue) : [];
      setHiddenGroupIds(Array.isArray(parsedValue) ? parsedValue.filter((value): value is string => typeof value === "string") : []);
    } catch {
      setHiddenGroupIds([]);
    }
  }, [hiddenStorageKey]);

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

  const hideGroup = (groupId: string) => {
    setHiddenGroupIds((current) => {
      if (current.includes(groupId)) return current;
      const next = [...current, groupId];
      window.localStorage.setItem(hiddenStorageKey, JSON.stringify(next));
      return next;
    });
    showToast("Группа скрыта из списка менеджера.");
  };

  const restoreGroup = (groupId: string) => {
    setHiddenGroupIds((current) => {
      const next = current.filter((id) => id !== groupId);
      window.localStorage.setItem(hiddenStorageKey, JSON.stringify(next));
      return next;
    });
    showToast("Группа возвращена в список менеджера.");
  };

  return (
    <div className="page-stack">
      <PageHeader
        title={showHidden ? "Скрытые тикеты" : "Группы тикетов"}
        subtitle="Похожие тикеты автоматически объединены в группы, чтобы менеджер быстрее видел повторяющиеся проблемы."
        aside={
          <Button className="manager-groups-toggle" variant="secondary" onClick={() => setShowHidden((value) => !value)}>
            {showHidden ? <><Ticket size={17} />К тикетам</> : <><EyeOff size={17} />Скрытые тикеты ({hiddenGroupIds.length})</>}
          </Button>
        }
      />
      <div className="toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="Поиск по группам тикетов" label="Поиск по группам тикетов" />
        <FilterChips value={status} onChange={setStatus} />
      </div>
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!loading && !error && displayedGroups.length === 0 && (
        <EmptyState
          title={showHidden ? "Скрытых групп нет" : "Группы не найдены"}
          text={showHidden ? "Скрытые группы появятся здесь после нажатия на крестик в карточке." : "Попробуйте изменить поиск или фильтр."}
        />
      )}
      {!loading && !error && (
        <div className="group-list">
          {displayedGroups.map((group) => (
            <TicketGroupCard
              key={group.id}
              group={group}
              onHide={showHidden ? undefined : hideGroup}
              onRestore={showHidden ? restoreGroup : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
