import type { TicketStatus } from "../../api/types";
import { statusOptions } from "../../utils/format";

type FilterValue = TicketStatus | "all";

export function FilterChips({ value, onChange }: { value: FilterValue; onChange: (value: FilterValue) => void }) {
  return (
    <div className="chips" role="group" aria-label="Фильтр по статусу">
      <button className={value === "all" ? "chip active" : "chip"} onClick={() => onChange("all")}>Все</button>
      {statusOptions.map((status) => (
        <button key={status.value} className={value === status.value ? "chip active" : "chip"} onClick={() => onChange(status.value)}>
          {status.label}
        </button>
      ))}
    </div>
  );
}
