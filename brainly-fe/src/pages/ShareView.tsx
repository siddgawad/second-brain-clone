// brainly-fe/src/pages/ShareView.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchShared } from "../lib/api";
import type { ContentItem } from "../lib/types";
import { NoteCard } from "../components/NoteCard";

export default function ShareView() {
  const { slug } = useParams<{ slug: string }>();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);

      if (!slug) {
        setErr("Missing share link.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchShared(slug);
        if (!alive) return;

        // Accept either { items: [...] } or [...] from the API
        const list = (Array.isArray(data) ? data : data?.items) as ContentItem[] | undefined;
        if (!list && (data?.error || data?.message)) {
          throw new Error(data.error || data.message);
        }
        setItems(list ?? []);
      } catch (e: any) {
        if (!alive) return;
        // Treat 404 as “no items” to keep UX friendly
        const status = e?.response?.status;
        if (status === 404) {
          setItems([]);
          setErr(null);
        } else {
          setErr(e?.response?.data?.error || e?.message || "Failed to load shared content");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) return <div className="p-6 text-gray-600">Loading…</div>;
  if (err) return <div className="p-6 text-red-600 text-sm">{err}</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 py-6">
      <h1 className="text-2xl font-bold mb-4">Shared Brain</h1>
      {items.length === 0 ? (
        <div className="text-sm text-gray-500">No shared items.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((it) => (
            <NoteCard
              key={String((it as any)._id ?? (it as any).id)}
              item={it}
              onDelete={() => {}}
              onShare={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
