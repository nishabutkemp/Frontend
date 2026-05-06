import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearAuthToken, hasAuthToken, USE_MOCKS } from "../api/client";
import { getMe } from "../api/me";
import type { User } from "../api/types";

type AppContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  reloadUser: () => Promise<void>;
  setAuthenticatedUser: (user: User | null) => void;
  logout: () => void;
  toast: string | null;
  showToast: (message: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const reloadUser = async () => {
    if (!hasAuthToken()) {
      setUser(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setUser(await getMe());
    } catch (err) {
      setUser(null);
      if (!USE_MOCKS && err instanceof Error && "status" in err && err.status === 401) {
        clearAuthToken();
        setError(null);
        return;
      }
      setError(err instanceof Error ? err.message : "Не удалось получить текущего пользователя.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reloadUser();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    setError(null);
  };

  const value = useMemo(
    () => ({ user, loading, error, reloadUser, setAuthenticatedUser: setUser, logout, toast, showToast }),
    [user, loading, error, toast],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && <div className="toast" role="status">{toast}</div>}
    </AppContext.Provider>
  );
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used within AppProviders");
  return value;
}
