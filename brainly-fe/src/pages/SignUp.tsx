// brainly-fe/src/pages/SignUp.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// works with both exports; prefer default import for consistency
import useAuth from "../hooks/useAuth";

export default function Signup() {
  const { doSignUp, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await doSignUp(email.trim(), password);
    if (res.ok) {
      nav("/", { replace: true });
    } else {
      setErr(res.error);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 border p-6 rounded-lg">
        <h1 className="text-xl font-semibold">Create account</h1>

        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPw(e.target.value)}
        />

        {err && <div className="text-sm text-red-600">{err}</div>}

        <button disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded">
          {loading ? "Creating…" : "Sign up"}
        </button>

        <p className="text-sm">
          Have an account?{" "}
          <Link to="/signin" className="text-purple-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
