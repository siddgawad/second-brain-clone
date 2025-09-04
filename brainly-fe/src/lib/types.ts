export type ContentKind = "tweet" | "video" | "doc" | "link" | "image" | "text";

export interface ContentItem {
  _id: string;
  title: string;
  description?: string;
  url?: string;        // for links (twitter/youtube/other)
  fileUrl?: string;    // for uploaded assets
  kind: ContentKind;
  tags: string[];
  createdAt: string;
}

export interface CreateContentInput {
  title: string;
  description?: string;
  url?: string;
  kind: ContentKind;
  tags: string[];
  // file: handled as FormData when present
}

export interface ShareResponse {
  url: string;
  id?: string;
}
