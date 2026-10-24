import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

const KEY = "addis-eats-user";

// Fake sign-in: the phone number is the "account". The session is kept in
// localStorage, read ASYNC-style inside an effect, so `loading` is real:
// on the first render `user` is null even if someone is signed in.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      /* storage blocked: stay signed out */
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (phone) => {
    await new Promise((r) => setTimeout(r, 400)); // pretend network call
    if (!/^09\d{8}$/.test(phone)) {
      throw new Error("Enter a phone number like 0912345678.");
    }
    const next = { phone };
    setUser(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
