import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Signin() {
  const { doSignIn, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPw] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await doSignIn(email, password);
    if (res.ok) nav('/');
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 border p-6 rounded-lg">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <input
          name="email"
          autoComplete="email"
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          name="password"
          autoComplete="current-password"
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPw(e.target.value)}
        />
        <button disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded">Sign in</button>
        <p className="text-sm">
          No account? <Link to="/signup" className="text-purple-600 hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
