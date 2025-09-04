import React, { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/SideBar";
import { Topbar } from "../components/TopBar";
import { AddContentModal } from "../components/AddContentModal";
import { EmptyState } from "../components/EmptyState";
import { NoteCard } from "../components/NoteCard";
import { ContentItem } from "../lib/types";
import { createContent, deleteContent, listContent, shareContent, shareDashboard } from "../lib/api";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState<"all" | "tweets" | "videos" | "documents" | "links" | "tags">("all");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAll() {
    setLoading(true);
    try {
      const data = await listContent();
      setItems(data.items ?? data); // supports either {items:[]} or []
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  const filtered = useMemo(() => {
    if (active === "all") return items;
    if (active === "tweets") return items.filter(it => it.kind === "tweet");
    if (active === "videos") return items.filter(it => it.kind === "video");
    if (active === "documents") return items.filter(it => it.kind === "doc");
    if (active === "links") return items.filter(it => it.kind === "link" || it.kind === "image");
    if (active === "tags") return items; // we will render a tag-cloud like list below
    return items;
  }, [active, items]);

  async function handleSubmit(fd: FormData) {
    const created = await createContent(fd);
    setItems((prev) => [created.item ?? created, ...prev]);
  }

  async function handleDelete(id: string) {
    await deleteContent(id);
    setItems((prev) => prev.filter((x) => x._id !== id));
  }

  async function handleShareCard(id: string) {
    const { url } = await shareContent(id);
    await navigator.clipboard.writeText(url);
    alert("Share link copied:\n" + url);
  }

  async function handleShareAll() {
    const { url } = await shareDashboard();
    await navigator.clipboard.writeText(url);
    alert("Dashboard share link copied:\n" + url);
  }

  // Build tag index
  const tagIndex = useMemo(() => {
    const idx: Record<string, number> = {};
    items.forEach((i) => i.tags?.forEach((t) => (idx[t] = (idx[t] ?? 0) + 1)));
    return Object.entries(idx).sort((a, b) => b[1] - a[1]);
  }, [items]);

  return (
    <div className="h-screen w-full flex">
      <Sidebar current={active} onChange={(id) => setActive(id as any)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onAdd={() => setModalOpen(true)} onShare={handleShareAll} />

        <main className="mx-auto w-full max-w-7xl px-4 md:px-8 py-6">
          {loading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : filtered.length === 0 && active !== "tags" ? (
            <EmptyState onAdd={() => setModalOpen(true)} />
          ) : active === "tags" ? (
            <div className="flex flex-wrap gap-2">
              {tagIndex.length === 0 ? (
                <div className="text-sm text-gray-500">No tags yet.</div>
              ) : tagIndex.map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => setActive("all")} // switch back and show all; simple behaviour
                  className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm"
                  title={`${count} items`}
                >
                  #{tag} <span className="text-gray-500">({count})</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((it) => (
                <NoteCard key={it._id} item={it} onDelete={handleDelete} onShare={handleShareCard} />
              ))}
            </div>
          )}
        </main>

        <AddContentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
