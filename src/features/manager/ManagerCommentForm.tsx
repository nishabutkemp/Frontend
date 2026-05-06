import { Button } from "../../components/ui/Button";
import { TextArea } from "../../components/ui/TextArea";

export function ManagerCommentForm({
  value,
  onChange,
  onSave,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  disabled?: boolean;
}) {
  const invalid = value.trim().length === 0;
  return (
    <div className="comment-form">
      <TextArea label="Комментарий менеджера" value={value} onChange={onChange} helper="Комментарий будет отражен в связанных тикетах сотрудников." />
      <Button onClick={onSave} disabled={disabled || invalid}>{disabled ? "Сохраняем..." : "Сохранить комментарий"}</Button>
    </div>
  );
}
