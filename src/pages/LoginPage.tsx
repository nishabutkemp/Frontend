import { FormEvent, useState } from "react";
import { BriefcaseBusiness, HardHat, LogIn } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../app/providers";
import { loginAsDevEmployee, loginAsDevManager, loginWithCredentials } from "../api/auth";
import type { User } from "../api/types";
import { getMe } from "../api/me";
import { Button } from "../components/ui/Button";
import { FastretroLogo } from "../components/ui/FastretroLogo";
import { LoadingState } from "../components/ui/States";

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, setAuthenticatedUser, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [devSubmitting, setDevSubmitting] = useState<"employee" | "manager" | null>(null);

  if (loading) return <LoadingState />;
  if (user) return <Navigate to={user.role === "manager" ? "/manager/groups" : "/employee"} replace />;

  const finishLogin = async (userFromToken?: User) => {
    const currentUser = userFromToken ?? (await getMe());
    setAuthenticatedUser(currentUser);
    showToast("Вход выполнен");
    navigate(currentUser.role === "manager" ? "/manager/groups" : "/employee", { replace: true });
  };

  const handlePasswordLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await loginWithCredentials({ email: email.trim(), password });
      await finishLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDevLogin = async (role: "employee" | "manager") => {
    setDevSubmitting(role);
    setError(null);
    try {
      const response = role === "employee" ? await loginAsDevEmployee() : await loginAsDevManager();
      await finishLogin(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти через dev-auth.");
    } finally {
      setDevSubmitting(null);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand">
          <FastretroLogo />
          <span>Вход в рабочее пространство</span>
        </div>

        <form className="auth-form" onSubmit={handlePasswordLogin}>
          <label className="field">
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          </label>
          <label className="field">
            Пароль
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" disabled={submitting || !email.trim() || !password}>
            <LogIn size={18} />
            Войти
          </Button>
        </form>

        <div className="dev-auth-block">
          <span>Dev auth</span>
          <div className="dev-auth-actions">
            <Button type="button" variant="secondary" onClick={() => void handleDevLogin("employee")} disabled={submitting || devSubmitting !== null}>
              <HardHat size={17} />
              {devSubmitting === "employee" ? "Signing in..." : "Continue as employee"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => void handleDevLogin("manager")} disabled={submitting || devSubmitting !== null}>
              <BriefcaseBusiness size={17} />
              {devSubmitting === "manager" ? "Signing in..." : "Continue as manager"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
