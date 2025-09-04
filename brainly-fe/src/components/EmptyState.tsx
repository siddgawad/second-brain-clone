export function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
      <div className="w-full py-20 flex flex-col items-center text-center">
        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='120'/>" alt="" className="opacity-0" />
        <h2 className="text-lg font-semibold">No notes yet</h2>
        <p className="text-gray-600 mt-1">Click “Add Content” to save a link, tweet, video, image or document.</p>
        <button onClick={onAdd} className="mt-4 text-primary-700 hover:underline">Add your first item →</button>
      </div>
    );
  }
  