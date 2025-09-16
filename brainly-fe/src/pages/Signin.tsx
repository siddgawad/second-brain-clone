
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


const useAuthHook = useAuth;

export default function Signin() {
  const { doSignIn, loading } = useAuthHook();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await doSignIn(email.trim(), password);
    if (res.ok) {
      nav('/', { replace: true });
    } else {
      setErr(res.error);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 border p-6 rounded-lg">
        <h1 className="text-xl font-semibold">Sign in</h1>

        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="current-password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPw(e.target.value)}
        />

        {err && <div className="text-sm text-red-600">{err}</div>}

        <button disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-sm">
          No account? <Link to="/signup" className="text-purple-600 hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
