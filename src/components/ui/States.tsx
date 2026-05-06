import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { Button } from "./Button";

export function LoadingState({ label = "Загрузка..." }: { label?: string }) {
  return <div className="state"><Loader2 className="spin" size={22} />{label}</div>;
}

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return <div className="state"><Inbox size={24} /><strong>{title}</strong>{text && <span>{text}</span>}</div>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state state-error">
      <AlertCircle size={24} />
      <strong>Что-то пошло не так</strong>
      <span>{message}</span>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Повторить</Button>}
    </div>
  );
}
