import { FormEvent, useState } from "react";
import { KeyRound, LogIn } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../app/providers";
import { loginWithCredentials, loginWithToken } from "../api/auth";
import { getMe } from "../api/me";
import { Button } from "../components/ui/Button";
import { LoadingState } from "../components/ui/States";

export function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, setAuthenticatedUser, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <LoadingState />;
  if (user) return <Navigate to={user.role === "manager" ? "/manager/groups" : "/employee"} replace />;

  const finishLogin = async () => {
    const currentUser = await getMe();
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

  const handleTokenLogin = async () => {
    if (!token.trim()) {
      setError("Введите Bearer-токен.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await loginWithToken(token.trim());
      await finishLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось проверить токен.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <div className="brand auth-brand">
          <div className="brand-mark"><span className="brand-letter" style={{ color: "#ffffff" }}>F</span></div>
          <div>
            <strong>Fastretro</strong>
            <span>Вход в рабочее пространство</span>
          </div>
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

        <div className="auth-divider">или</div>

        <div className="auth-form">
          <label className="field">
            Bearer-токен
            <textarea value={token} onChange={(event) => setToken(event.target.value)} rows={4} />
          </label>
          <Button type="button" variant="secondary" onClick={handleTokenLogin} disabled={submitting}>
            <KeyRound size={18} />
            Войти по токену
          </Button>
        </div>
      </section>
    </div>
  );
}
