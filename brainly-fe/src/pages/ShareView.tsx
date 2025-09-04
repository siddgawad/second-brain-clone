import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchShared } from "../lib/api";
import { ContentItem } from "../lib/types";
import { NoteCard } from "../components/NoteCard";

export default function ShareView() {
  const { slug = "" } = useParams();
  const [items, setItems] = useState<ContentItem[] | null>(null);

  useEffect(() => {
    (async () => {
      const data = await fetchShared(slug);
      setItems(data.items ?? data);
    })();
  }, [slug]);

  if (!items) return <div className="p-6 text-gray-600">Loading…</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 py-6">
      <h1 className="text-2xl font-bold mb-4">Shared Brain</h1>
      {items.length === 0 ? (
        <div className="text-sm text-gray-500">No shared items.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((it) => <NoteCard key={it._id} item={it} onDelete={() => {}} onShare={() => {}} />)}
        </div>
      )}
    </div>
  );
}
