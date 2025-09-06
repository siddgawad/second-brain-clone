import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Signup() {
  const { doSignUp, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPw] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await doSignUp(email, password);
    if (res.ok) nav('/');
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 border p-6 rounded-lg">
        <h1 className="text-xl font-semibold">Create account</h1>
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
          autoComplete="new-password"
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPw(e.target.value)}
        />
        <button disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded">Sign up</button>
        <p className="text-sm">
          Have an account? <Link to="/signin" className="text-purple-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
