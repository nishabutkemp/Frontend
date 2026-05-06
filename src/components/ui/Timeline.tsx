import type { TicketHistoryEvent } from "../../api/types";
import { formatDate } from "../../utils/format";

export function Timeline({ events }: { events: TicketHistoryEvent[] }) {
  return (
    <ol className="timeline">
      {events.map((event) => (
        <li key={event.id}>
          <span className="timeline-dot" />
          <div>
            <strong>{event.label}</strong>
            <p>{event.actor.displayName} · {formatDate(event.createdAt)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
