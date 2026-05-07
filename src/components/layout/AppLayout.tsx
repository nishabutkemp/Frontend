import { BarChart3, Home, Inbox, LogOut, PlusCircle } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useApp } from "../../app/providers";
import type { UserRole } from "../../api/types";
import { FastretroLogo } from "../ui/FastretroLogo";
import eiffelTowerImage from "../../../image_2026-05-07_15-13-08.png";
import themeImage from "../../../theme.png";

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
      <img className="app-theme-background" src={themeImage} alt="" aria-hidden="true" />
      <aside className="sidebar">
        <div className="brand">
          <FastretroLogo size="small" />
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
        <img className="sidebar-bottom-image" src={eiffelTowerImage} alt="" aria-hidden="true" />
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button className="icon-button logout-button" aria-label="Выйти" title="Выйти" onClick={logout}>
            <LogOut size={19} />
            <span>Выйти</span>
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
