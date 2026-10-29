import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, loadToken, saveToken, setUnauthorizedHandler } from './api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  const signOut = useCallback(async () => { await saveToken(null); setUser(null); }, []);

  useEffect(() => {
    setUnauthorizedHandler(signOut);
    (async () => {
      try { if (await loadToken()) setUser(await api.me()); } catch { await saveToken(null); }
      setBooting(false);
    })();
  }, [signOut]);

  const value = useMemo(() => ({
    user, booting, signOut,
    signIn: async (email, password) => { const r = await api.login(email, password); await saveToken(r.token); setUser(r.user); },
    signUp: async (payload) => { const r = await api.register(payload); await saveToken(r.token); setUser(r.user); },
  }), [user, booting, signOut]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
