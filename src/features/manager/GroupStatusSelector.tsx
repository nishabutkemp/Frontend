import type { TicketStatus } from "../../api/types";
import { statusOptions } from "../../utils/format";

export function GroupStatusSelector({ value, onChange, disabled }: { value: TicketStatus; onChange: (value: TicketStatus) => void; disabled?: boolean }) {
  return (
    <label className="select-field">
      <span>Выбрать статус группы</span>
      <select value={value} onChange={(event) => onChange(event.target.value as TicketStatus)} disabled={disabled}>
        {statusOptions.map((status) => (
          <option key={status.value} value={status.value}>{status.label}</option>
        ))}
      </select>
    </label>
  );
}
