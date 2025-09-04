import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { token, logout, ensureFresh } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const wantsProtected = ["/", "/dashboard"].includes(loc.pathname);
    if (!token && wantsProtected) {
      void ensureFresh().then((t) => {
        if (!t) nav("/signin");
      });
    }
  }, [loc.pathname, token, ensureFresh, nav]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container flex items-center justify-between py-3 gap-4">
          <Link to="/" className="font-semibold text-lg">Second Brain</Link>
          <nav className="flex items-center gap-3">
            <Link to="/share/demo" className="text-sm underline">Share demo</Link>
            {token ? (
              <button onClick={logout} className="px-3 py-1.5 rounded bg-black text-white text-sm">
                Logout
              </button>
            ) : (
              <>
                <Link to="/signin" className="px-3 py-1.5 rounded border text-sm">Sign in</Link>
                <Link to="/signup" className="px-3 py-1.5 rounded bg-black text-white text-sm">Sign up</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container grow py-6">
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="container py-4 text-xs text-neutral-500">
          Built for fast, resilient auth + sharing. © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
