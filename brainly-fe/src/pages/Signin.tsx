import { useState } from "react";
import { Button, Card, Input } from "../components/Kit";
import { signIn } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { setAuthed } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, pw);
      setAuthed(true);
      nav("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <form className="space-y-4" onSubmit={submit}>
          <Input label="Email" type="email" value={email} onChange={setEmail} required />
          <Input label="Password" type="password" value={pw} onChange={setPw} required />
          <Button type="submit" text="Sign in" variant="primary" loading={loading} fullWidth />
        </form>
        <p className="text-sm text-gray-600 mt-3">
          No account? <Link to="/signup" className="text-primary-700 hover:underline">Sign up</Link>
        </p>
      </Card>
    </div>
  );
}
