import { useCallback, useEffect, useState } from "react";
import api, { setAccessToken } from "../lib/api";

type AuthState = {
  token: string | null;
  loading: boolean;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({ token: null, loading: true });

  const setToken = useCallback((t: string | null) => {
    setAccessToken(t);
    setState((s) => ({ ...s, token: t }));
  }, []);

  const ensureFresh = useCallback(async () => {
    const { data } = await api.post("/refresh", {});
    const token = (data?.accessToken as string | undefined) ?? null;
    setToken(token);
    return token;
  }, [setToken]);

  const signin = useCallback(
    async (username: string, password: string) => {
      const { data } = await api.post("/signin", { username, password });
      const token = (data?.accessToken as string | undefined) ?? null;
      setToken(token);
      setState((s) => ({ ...s, loading: false }));
    },
    [setToken]
  );

  const signup = useCallback(
    async (username: string, password: string) => {
      await api.post("/signup", { username, password });
      await signin(username, password);
    },
    [signin]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/logout", {});
    } catch (err) {
      if (import.meta.env.MODE === "development") console.debug(err);
    } finally {
      setToken(null);
      setState((s) => ({ ...s, loading: false }));
    }
  }, [setToken]);
  

  useEffect(() => {
    // silent refresh on first mount
    ensureFresh().finally(() => setState((s) => ({ ...s, loading: false })));
  }, [ensureFresh]);

  return { ...state, signin, signup, logout, ensureFresh };
}
