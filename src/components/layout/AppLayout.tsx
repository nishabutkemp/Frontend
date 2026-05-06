import { BarChart3, Home, Inbox, LogOut, PlusCircle, UserCircle } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useApp } from "../../app/providers";
import type { UserRole } from "../../api/types";

const nav = {
  employee: [
    { to: "/employee", label: "Главная", icon: Home },
    { to: "/employee/tickets/new", label: "Создать тикет", icon: PlusCircle },
    { to: "/employee/tickets", label: "Мои тикеты", icon: Inbox },
  ],
  manager: [
    { to: "/manager/groups", label: "Группы тикетов", icon: Inbox },
    { to: "/manager/analytics", label: "Аналитика", icon: BarChart3 },
  ],
};

export function AppLayout({ role }: { role: UserRole }) {
  const { logout } = useApp();
  const items = nav[role];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><span className="brand-letter" style={{ color: "#ffffff" }}>F</span></div>
          <div>
            <strong>Fastretro</strong>
          </div>
        </div>
        <nav>
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink key={`${item.to}-${item.label}-${index}`} to={item.to} end={item.to.endsWith("groups") || item.to === "/employee"} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button className="icon-button" aria-label="Выйти" title="Выйти" onClick={logout}><LogOut size={19} /></button>
          <div className="avatar" aria-label="Пользователь"><UserCircle size={22} /></div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
