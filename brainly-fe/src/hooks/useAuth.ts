// brainly-fe/src/hooks/useAuth.ts
import { useState, useCallback } from "react";
import { signIn, signUp, signOut } from "../lib/api";

type Ok = { ok: true };
type Fail = { ok: false; error: string };

function extractToken(data: any): string | undefined {
  return data?.accessToken ?? data?.token ?? data?.access_token;
}

function useAuth() {
  const [loading, setLoading] = useState(false);

  const doSignIn = useCallback(async (email: string, password: string): Promise<Ok | Fail> => {
    setLoading(true);
    try {
      const { data } = await signIn(email, password);
      const token = extractToken(data);
      if (token) localStorage.setItem("access_token", token);
      return { ok: true };
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Sign in failed";
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const doSignUp = useCallback(async (email: string, password: string): Promise<Ok | Fail> => {
    setLoading(true);
    try {
      const { data } = await signUp(email, password);
      const token = extractToken(data);
      if (token) localStorage.setItem("access_token", token);
      return { ok: true };
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        "Sign up failed";
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const doSignOut = useCallback(async () => {
    try {
      await signOut();
    } finally {
      localStorage.removeItem("access_token");
    }
  }, []);

  return { loading, doSignIn, doSignUp, doSignOut };
}

export default useAuth;          // supports: import useAuth from ...
export { useAuth };              // supports: import { useAuth } from ...
