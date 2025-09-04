import { Share2, Plus } from "lucide-react";
import { Button } from "./Kit";

export function Topbar({
  onAdd,
  onShare
}: {
  onAdd: () => void;
  onShare: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">All Notes</h1>
        <div className="flex gap-2">
          <Button variant="secondary" text="Share Brain" startIcon={<Share2 size={16} />} onClick={onShare} />
          <Button variant="primary" text="Add Content" startIcon={<Plus size={16} />} onClick={onAdd} />
        </div>
      </div>
    </header>
  );
}
