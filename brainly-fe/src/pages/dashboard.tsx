import { FormEvent, useEffect, useState, useCallback } from "react";
import api from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

type Item = { _id: string; title: string; link: string; type: string; createdAt: string; tags: string[] };

function getErrMessage(e: unknown): string {
  const ax = e as AxiosError<{ message?: string }>;
  return ax?.response?.data?.message ?? "Request failed";
}

export default function Dashboard() {
  const { token, ensureFresh } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const load = useCallback(async () => {
    try {
      if (!token) {
        const t = await ensureFresh();
        if (!t) return nav("/signin");
      }
      const { data } = await api.get<{ items: Item[] }>("/content");
      setItems(data.items ?? []);
    } catch (e: unknown) {
      setErr(getErrMessage(e));
    } finally {
      setLoading(false);
    }
  }, [token, ensureFresh, nav]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "");
    const link = String(form.get("link") ?? "");
    const type = String(form.get("type") ?? "article");

    try {
      const { data } = await api.post<Item>("/content", { title, link, type });
      setItems((prev) => [data, ...prev]);
      e.currentTarget.reset();
    } catch (e: unknown) {
      setErr(getErrMessage(e));
    }
  }

  async function onDelete(id: string) {
    await api.delete(`/content/${id}`);
    setItems((prev) => prev.filter((i) => i._id !== id));
  }

  async function onShare(id: string) {
    const { data } = await api.post<{ hash: string }>(`/brain/${id}`);
    const url = `${location.origin}/share/${data.hash}`;
    await navigator.clipboard.writeText(url);
    alert("Share link copied to clipboard:\n" + url);
  }

  if (loading) return <div>Loading…</div>;

  return (
    <div className="grid gap-6">
      <section className="bg-white rounded shadow-sm p-4">
        <h2 className="font-semibold mb-3">Add content</h2>
        <form onSubmit={onCreate} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <input name="title" required placeholder="Title" className="border rounded px-3 py-2" />
          <input name="link" required placeholder="https://…" className="border rounded px-3 py-2" />
          <select name="type" className="border rounded px-3 py-2">
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="note">Note</option>
          </select>
          <button className="px-4 py-2 rounded bg-black text-white">Save</button>
        </form>
        {err && <div className="text-sm text-red-600 mt-2">{err}</div>}
      </section>

      <section className="bg-white rounded shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Your items</h2>
          <span className="text-xs text-neutral-500">{items.length} total</span>
        </div>
        <ul className="grid gap-2">
          {items.map((i) => (
            <li key={i._id} className="border rounded p-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="grow">
                <div className="font-medium">{i.title}</div>
                <a href={i.link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 break-all">
                  {i.link}
                </a>
                <div className="text-xs text-neutral-500 mt-1">
                  {new Date(i.createdAt).toLocaleString()} • {i.type}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => void onShare(i._id)} className="px-3 py-1.5 rounded border">Share</button>
                <button onClick={() => void onDelete(i._id)} className="px-3 py-1.5 rounded border text-red-600">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        {items.length === 0 && <div className="text-sm text-neutral-500">No items yet. Add your first above.</div>}
      </section>

      <section className="text-sm text-neutral-500">
        Public share example: <Link to="/share/demo" className="underline">/share/demo</Link>
      </section>
    </div>
  );
}
