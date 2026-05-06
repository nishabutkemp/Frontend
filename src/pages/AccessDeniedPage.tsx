import { Card } from "../components/ui/Card";

export function AccessDeniedPage() {
  return (
    <div className="narrow-page">
      <Card>
        <h1>Нет доступа</h1>
        <p className="muted">У текущей роли нет прав на просмотр этой страницы.</p>
      </Card>
    </div>
  );
}
