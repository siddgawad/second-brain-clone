import { Share2, Trash2, Link2, FileText, Twitter, Video, Image } from "lucide-react";
import { Card, Badge } from "./Kit";
import { ContentItem } from "../lib/types";
import { formatDate } from "../lib/utils";

export function NoteCard({
  item,
  onDelete,
  onShare
}: {
  item: ContentItem;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}) {
  const icon = {
    tweet: <Twitter size={16} />,
    video: <Video size={16} />,
    doc: <FileText size={16} />,
    link: <Link2 size={16} />,
    image: <Image size={16} />,
    text: <FileText size={16} />
  }[item.kind];

  const preview = (() => {
    if (item.kind === "image" && item.fileUrl) {
      return <img src={item.fileUrl} alt="" className="w-full h-40 object-cover rounded-md border" />;
    }
    if (item.kind === "video" && item.url) {
      // thumbnail best-effort for youtube
      const yt = /(?:v=|be\/)([A-Za-z0-9_-]{6,})/.exec(item.url);
      if (yt) return <img src={`https://img.youtube.com/vi/${yt[1]}/0.jpg`} alt="" className="w-full h-40 object-cover rounded-md border" />;
    }
    return null;
  })();

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-gray-700">
          {icon}
          <div className="text-sm font-medium">{
            item.kind === "tweet" ? "Tweet" :
            item.kind === "video" ? "Video" :
            item.kind === "doc" ? "Document" :
            item.kind === "image" ? "Image" : "Link"
          }</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onShare(item._id)} className="text-gray-500 hover:text-primary-700" title="Share">
            <Share2 size={16} />
          </button>
          <button onClick={() => onDelete(item._id)} className="text-gray-500 hover:text-red-600" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-semibold">{item.title}</h3>
      {preview}
      {item.description && <p className="text-sm text-gray-700 line-clamp-5">{item.description}</p>}

      <div className="flex flex-wrap gap-1">
        {item.tags?.map((t) => <Badge key={t}>#{t}</Badge>)}
      </div>

      <div className="text-xs text-gray-500">Added on {formatDate(item.createdAt)}</div>
    </Card>
  );
}
