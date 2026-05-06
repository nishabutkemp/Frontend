import { Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enhanceTicketDescription } from "../../api/ai";
import { createTicket } from "../../api/tickets";
import { useApp } from "../../app/providers";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ErrorState } from "../../components/ui/States";
import { TextArea } from "../../components/ui/TextArea";
import { stripAiEnhancedPrefix } from "../../utils/format";
import { AiReviewPanel } from "./AiReviewPanel";

export function CreateTicketPage() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [description, setDescription] = useState("");
  const [original, setOriginal] = useState("");
  const [improved, setImproved] = useState("");
  const [isReview, setIsReview] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const validationError = description.trim().length > 0 && description.trim().length < 10 ? "Минимум 10 символов." : null;

  const canSubmit = description.trim().length >= 10;

  const handleAi = async () => {
    if (!canSubmit) return;
    setError(null);
    setLoadingAi(true);
    try {
      const response = await enhanceTicketDescription(description.trim());
      setOriginal(response.originalText);
      setImproved(stripAiEnhancedPrefix(response.enhancedText));
      setIsReview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось улучшить описание.");
    } finally {
      setLoadingAi(false);
    }
  };

  const submit = async (text: string, aiEnhanced: boolean, originalDescription?: string | null) => {
    setSubmitting(true);
    setError(null);
    try {
      const ticket = await createTicket({
        description: stripAiEnhancedPrefix(text),
        originalDescription,
        aiEnhanced,
      });
      showToast("Тикет создан.");
      navigate(`/employee/tickets/${ticket.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать тикет.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isReview) {
    return (
      <>
        <PageHeader
          title="Проверьте улучшенное описание"
          subtitle="ИИ исправил грамматику и сделал формулировку понятнее. Вы можете отредактировать текст перед отправкой."
        />
        {error && <ErrorState message={error} />}
        <AiReviewPanel
          original={original}
          improved={improved}
          onImprovedChange={setImproved}
          onSubmit={() => submit(improved, true, original)}
          onUseOriginal={() => submit(original, false, null)}
          submitting={submitting}
        />
      </>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Создать тикет"
        subtitle="Опишите проблему или пожелание. Все тикеты в MVP приватные по умолчанию."
      />
      {error && <ErrorState message={error} />}
      <Card className="form-card">
        <TextArea
          label="Описание проблемы / пожелания"
          value={description}
          onChange={setDescription}
          placeholder="Например: после смены пароля не получается войти в корпоративную почту..."
          helper="Чем подробнее описание, тем быстрее менеджер сможет помочь."
          error={validationError}
          disabled={submitting}
        />
        <div className="actions-row">
          <Button variant="secondary" onClick={handleAi} disabled={!canSubmit || loadingAi || submitting}>
            <Sparkles size={17} />{loadingAi ? "Улучшаем..." : "Улучшить описание с помощью ИИ"}
          </Button>
          <Button onClick={() => submit(description, false, null)} disabled={!canSubmit || submitting}>
            {submitting ? "Создаем..." : "Создать тикет"}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/employee")} disabled={submitting}>Отмена</Button>
        </div>
        <p className="info-row"><Lock size={16} />Тикет будет виден только вам и менеджеру.</p>
      </Card>
    </div>
  );
}
