import { Navigate, createBrowserRouter } from "react-router-dom";
import { useApp } from "./providers";
import { AppLayout } from "../components/layout/AppLayout";
import { LoadingState, ErrorState } from "../components/ui/States";
import { AccessDeniedPage } from "../pages/AccessDeniedPage";
import { EmployeeHomePage } from "../features/employee/EmployeeHomePage";
import { CreateTicketPage } from "../features/employee/CreateTicketPage";
import { MyTicketsPage } from "../features/employee/MyTicketsPage";
import { TicketDetailPage } from "../features/employee/TicketDetailPage";
import { ManagerGroupsPage } from "../features/manager/ManagerGroupsPage";
import { ManagerGroupDetailPage } from "../features/manager/ManagerGroupDetailPage";
import { AnalyticsPage } from "../features/manager/AnalyticsPage";
import type { UserRole } from "../api/types";

function RootRedirect() {
  const { user, loading, error, reloadUser } = useApp();
  if (loading) return <LoadingState label="Получаем текущего пользователя..." />;
  if (error) return <ErrorState message={error} onRetry={reloadUser} />;
  return <Navigate to={user?.role === "manager" ? "/manager/groups" : "/employee"} replace />;
}

function RoleLayout({ role }: { role: UserRole }) {
  const { user, loading, error, reloadUser } = useApp();
  if (loading) return <LoadingState label="Получаем текущего пользователя..." />;
  if (error) return <ErrorState message={error} onRetry={reloadUser} />;
  if (user?.role !== role) return <AccessDeniedPage />;
  return <AppLayout role={role} />;
}

export const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  {
    path: "/employee",
    element: <RoleLayout role="employee" />,
    children: [
      { index: true, element: <EmployeeHomePage /> },
      { path: "tickets/new", element: <CreateTicketPage /> },
      { path: "tickets", element: <MyTicketsPage /> },
      { path: "tickets/:ticketId", element: <TicketDetailPage /> },
    ],
  },
  {
    path: "/manager",
    element: <RoleLayout role="manager" />,
    children: [
      { path: "groups", element: <ManagerGroupsPage /> },
      { path: "groups/:groupId", element: <ManagerGroupDetailPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { index: true, element: <Navigate to="/manager/groups" replace /> },
    ],
  },
  { path: "/403", element: <AccessDeniedPage /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);
