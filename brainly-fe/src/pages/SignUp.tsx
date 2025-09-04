import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { AxiosError } from "axios";

function getErrMessage(e: unknown): string {
  const ax = e as AxiosError<{ message?: string }>;
  return ax?.response?.data?.message ?? "Sign up failed";
}

export default function SignUp() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      setPending(true);
      setErr(null);
      await signup(username, password);
      nav("/");
    } catch (e: unknown) {
      setErr(getErrMessage(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-sm rounded p-6">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input name="username" className="border rounded px-3 py-2" placeholder="Username" />
        <input name="password" type="password" className="border rounded px-3 py-2" placeholder="Password" />
        {err && <div className="text-sm text-red-600">{err}</div>}
        <button disabled={pending} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
          {pending ? "Creating..." : "Sign up"}
        </button>
      </form>
      <p className="text-sm mt-3">
        Already have an account? <Link to="/signin" className="underline">Sign in</Link>
      </p>
    </div>
  );
}
