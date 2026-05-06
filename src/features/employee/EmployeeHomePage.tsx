import { Clock, Lock, MessageSquare, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SearchInput } from "../../components/ui/SearchInput";

export function EmployeeHomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-stack">
      <SearchInput value="" onChange={() => undefined} placeholder="Где оставить обращение?" label="Поиск способа оставить обращение" />
      <PageHeader
        title="Есть проблема или пожелание?"
        subtitle="Опишите ситуацию и отправьте её менеджеру в пару кликов."
      />
      <Card className="hero-card">
        <div className="hero-icon"><MessageSquare size={30} /></div>
        <Button onClick={() => navigate("/employee/tickets/new")}>Сообщить о проблеме</Button>
        <p><Lock size={16} />Все тикеты в MVP приватные по умолчанию и видны только вам и менеджеру.</p>
        <span><Clock size={16} />Обычно занимает меньше 1 минуты</span>
      </Card>
      <section className="how-grid" aria-label="Как это работает">
        {["Опишите проблему", "При желании улучшите текст с помощью ИИ", "Отправьте тикет менеджеру"].map((item, index) => (
          <Card key={item}>
            <div className="step">{index + 1}</div>
            <h3>{item}</h3>
            {index === 1 && <Sparkles size={18} className="accent-icon" />}
          </Card>
        ))}
      </section>
    </div>
  );
}
