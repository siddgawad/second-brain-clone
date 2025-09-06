import { useEffect, useState } from 'react';
import { listContent, createContent, deleteContent } from '../lib/api';

type Item = {
  _id: string;
  title?: string;
  type: 'link' | 'tweet' | 'video' | 'doc' | 'note' | 'image';
  url?: string;
  text?: string;
  tags?: string[];
};

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);

  async function load() {
    const { data } = await listContent();
    setItems(data.items ?? []);
  }

  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = {
      title: fd.get('title'),
      type: fd.get('type'),
      url: fd.get('url') || undefined,
      text: fd.get('text') || undefined,
      tags: (fd.get('tags') as string || '').split(',').map(s=>s.trim()).filter(Boolean),
    };
    await createContent(payload);
    setOpen(false);
    await load();
  }

  async function remove(id: string) {
    await deleteContent(id);
    await load();
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Notes</h1>
        <button onClick={() => setOpen(true)} className="bg-purple-600 text-white px-4 py-2 rounded">Add Content</button>
      </div>

      {items.length === 0 ? (
        <div className="border rounded-lg p-10 text-center text-gray-500">No content yet. Click “Add Content”.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(it => (
            <div key={it._id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{it.title || it.type}</div>
                <div className="flex gap-2">
                  <button className="text-sm text-purple-600">Share</button>
                  <button onClick={()=>remove(it._id)} className="text-sm text-red-600">Delete</button>
                </div>
              </div>
              {it.url && <a className="text-blue-600 break-all" href={it.url} target="_blank">{it.url}</a>}
              {it.text && <p className="text-sm text-gray-700">{it.text}</p>}
              <div className="flex flex-wrap gap-1">
                {(it.tags ?? []).map(t => <span key={t} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">#{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <>
          <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 grid place-items-center">
            <form onSubmit={submit} className="bg-white rounded-xl p-6 w-[90vw] max-w-lg relative">
              <button type="button" onClick={()=>setOpen(false)} className="absolute right-4 top-4 text-gray-500">✕</button>
              <h2 className="text-lg font-semibold mb-4">Add Content</h2>
              <div className="space-y-3">
                <input name="title" placeholder="Title" className="w-full border p-2 rounded" />
                <select name="type" className="w-full border p-2 rounded" defaultValue="note">
                  <option value="note">Note</option>
                  <option value="link">Link</option>
                  <option value="tweet">Tweet</option>
                  <option value="video">YouTube</option>
                  <option value="doc">Document</option>
                  <option value="image">Image</option>
                </select>
                <input name="url" placeholder="Link/Tweet/YouTube URL (optional)" className="w-full border p-2 rounded" />
                <textarea name="text" placeholder="Text (optional)" className="w-full border p-2 rounded" rows={4} />
                <input name="tags" placeholder="tags (comma separated)" className="w-full border p-2 rounded" />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={()=>setOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded">Submit</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
