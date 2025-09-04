export function classifyKindFromUrl(url?: string): "tweet" | "video" | "link" {
    if (!url) return "link";
    const u = url.toLowerCase();
    if (u.includes("twitter.com") || u.includes("x.com")) return "tweet";
    if (u.includes("youtube.com") || u.includes("youtu.be")) return "video";
    return "link";
  }
  
  export function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString();
  }
  