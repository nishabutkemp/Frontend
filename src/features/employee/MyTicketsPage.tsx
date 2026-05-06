import { useEffect, useMemo, useState } from "react";
import type { Ticket, TicketStatus } from "../../api/types";
import { listMyTickets } from "../../api/tickets";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/States";
import { FilterChips } from "../../components/ui/FilterChips";
import { SearchInput } from "../../components/ui/SearchInput";
import { TicketListItem } from "./TicketListItem";

export function MyTicketsPage() {
  const [items, setItems] = useState<Ticket[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => ({ query, status: status === "all" ? undefined : status }), [query, status]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    listMyTickets(params)
      .then((response) => active && setItems(response.items))
      .catch((err) => active && setError(err instanceof Error ? err.message : "Не удалось загрузить тикеты."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [params]);

  return (
    <div className="page-stack">
      <PageHeader title="Мои тикеты" subtitle="Отслеживайте статус своих обращений и ответы менеджера." />
      <div className="toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="Поиск по моим тикетам" label="Поиск по моим тикетам" />
        <FilterChips value={status} onChange={setStatus} />
      </div>
      <Card className="list-card">
        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}
        {!loading && !error && items.length === 0 && <EmptyState title="Тикеты не найдены" text="Попробуйте изменить поиск или фильтр." />}
        {!loading && !error && items.map((ticket) => <TicketListItem key={ticket.id} ticket={ticket} />)}
      </Card>
    </div>
  );
}
