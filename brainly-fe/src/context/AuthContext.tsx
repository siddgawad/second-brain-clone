import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, signOut } from "../lib/api";

interface AuthCtx {
  authed: boolean;
  setAuthed: (v: boolean) => void;
  signOutNow: () => void;
}

const Ctx = createContext<AuthCtx>({ authed: false, setAuthed: () => {}, signOutNow: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean>(!!getToken());
  useEffect(() => { setAuthed(!!getToken()); }, []);
  function signOutNow() { signOut(); setAuthed(false); }
  return <Ctx.Provider value={{ authed, setAuthed, signOutNow }}>{children}</Ctx.Provider>;
}

export function useAuth() { return useContext(Ctx); }
