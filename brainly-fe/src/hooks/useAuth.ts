import { useState, useCallback } from 'react';
import { signIn, signUp, signOut } from '../lib/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const doSignIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await signIn(email, password);
      localStorage.setItem('access_token', data.accessToken);
      return { ok: true };
    } finally {
      setLoading(false);
    }
  }, []);

  const doSignUp = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await signUp(email, password);
      localStorage.setItem('access_token', data.accessToken);
      return { ok: true };
    } finally {
      setLoading(false);
    }
  }, []);

  const doSignOut = useCallback(async () => {
    await signOut();
    localStorage.removeItem('access_token');
  }, []);

  return { loading, doSignIn, doSignUp, doSignOut };
}
