/* eslint-disable react-refresh/only-export-components */
/** Authentication state backed by the API's access-token and refresh-cookie flow. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../features/auth/services/authService";
import { setAuthToken } from "../lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const establishSession = useCallback((session) => {
    if (session?.accessToken) setAuthToken(session.accessToken);
    setUser(session?.user ?? null);
  }, []);

  const signOut = useCallback(async () => {
    try { await authService.logout(); } catch { /* Local logout still protects the UI. */ }
    setAuthToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;
    // The backend protects refresh-token rotation with its double-submit CSRF
    // token. Request it before attempting a cookie-based session restore.
    authService.getCsrfToken()
      .then(() => authService.refreshToken())
      .then((session) => {
        if (!active) return;
        if (session?.accessToken) setAuthToken(session.accessToken);
        return authService.getMe();
      })
      .then((currentUser) => { if (active && currentUser) setUser(currentUser); })
      .catch(() => setAuthToken(null))
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({ user, isLoading, establishSession, signOut }), [user, isLoading, establishSession, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
