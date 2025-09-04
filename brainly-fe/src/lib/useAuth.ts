import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

export type User = { id: string; username: string };

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const me = useCallback(async () => {
    try {
      const r = await api.get("/me");
      setUser(r.data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  const signin = useCallback(async (username: string, password: string) => {
    await api.post("/signin", { username, password });
    await me();
  }, [me]);

  const signup = useCallback(async (username: string, password: string) => {
    await api.post("/signup", { username, password });
    await me();
  }, [me]);

  const signout = useCallback(async () => {
    await api.post("/logout");
    setUser(null);
  }, []);

  const ensureFresh = useCallback(async () => {
    try {
      await api.post("/refresh");
    } catch {
      /* ignore - me() will null user */
    } finally {
      await me();
    }
  }, [me]);

  useEffect(() => {
    ensureFresh();
  }, [ensureFresh]);

  return { user, ready, signin, signup, signout };
}
