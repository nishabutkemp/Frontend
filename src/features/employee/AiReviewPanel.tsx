import { Lock } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/StatusBadge";
import { TextArea } from "../../components/ui/TextArea";

export function AiReviewPanel({
  original,
  improved,
  onImprovedChange,
  onSubmit,
  onUseOriginal,
  submitting,
}: {
  original: string;
  improved: string;
  onImprovedChange: (value: string) => void;
  onSubmit: () => void;
  onUseOriginal: () => void;
  submitting: boolean;
}) {
  return (
    <div className="page-stack">
      <div className="split-grid">
        <Card>
          <h3>Исходный текст</h3>
          <p className="preserve">{original}</p>
        </Card>
        <Card>
          <div className="card-title-row">
            <h3>Улучшенный вариант</h3>
            <Badge>AI-enhanced</Badge>
          </div>
          <TextArea label="Улучшенное описание" value={improved} onChange={onImprovedChange} helper="Вы можете отредактировать текст перед отправкой." />
        </Card>
      </div>
      <div className="actions-row">
        <Button onClick={onSubmit} disabled={submitting}>{submitting ? "Создаем..." : "Создать тикет"}</Button>
        <Button variant="secondary" onClick={onUseOriginal} disabled={submitting}>Вернуть исходный текст</Button>
        <Button variant="ghost" onClick={() => document.querySelector<HTMLTextAreaElement>("textarea")?.focus()} disabled={submitting}>Редактировать</Button>
      </div>
      <p className="info-row"><Lock size={16} />AI-функция опциональна и не меняет приватность тикета.</p>
    </div>
  );
}
