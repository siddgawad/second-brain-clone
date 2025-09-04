import { Link, useLocation } from "react-router-dom";
import { Hash, Link2, FileText, Video, Twitter, Layers } from "lucide-react";
import clsx from "clsx";

const items = [
  { id: "all", label: "All", icon: Layers },
  { id: "tweets", label: "Tweets", icon: Twitter },
  { id: "videos", label: "Videos", icon: Video },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "links", label: "Links", icon: Link2 },
  { id: "tags", label: "Tags", icon: Hash }
];

export function Sidebar({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  const loc = useLocation();
  return (
    <aside className="hidden md:flex md:w-56 lg:w-64 flex-col gap-1 border-r border-gray-200 bg-white">
      <div className="px-4 py-4 font-semibold text-xl">Second Brain</div>
      <nav className="px-2 pb-4">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
              current === id ? "bg-primary-50 text-primary-700" : "hover:bg-gray-100 text-gray-700"
            )}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto p-3 text-xs text-gray-400">
        <Link to="/share/preview" className="hover:underline">Public Preview</Link>
      </div>
    </aside>
  );
}
