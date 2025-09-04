import React, { useMemo, useState } from "react";
import { Button, Input, Modal } from "./Kit";
import { classifyKindFromUrl } from "../lib/utils";
import type { ContentKind, CreateContentInput } from "../lib/types";

export function AddContentModal({
  isOpen,
  onClose,
  onSubmit
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const inferredKind: ContentKind = useMemo(() => {
    if (file) return file.type.startsWith("image/") ? "image" : "doc";
    return classifyKindFromUrl(url);
  }, [url, file]);

  function reset() {
    setTitle(""); setUrl(""); setDesc(""); setTags(""); setFile(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("description", desc.trim());
      if (url) fd.append("url", url.trim());
      fd.append("kind", inferredKind);
      fd.append("tags", JSON.stringify(tags.split(",").map(s => s.trim()).filter(Boolean)));
      if (file) fd.append("file", file);
      await onSubmit(fd);
      reset();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Content" maxWidth="max-w-2xl">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Title" required value={title} onChange={setTitle} placeholder="Future Projects" />
          <Input label="URL (optional)" type="url" value={url} onChange={setUrl} placeholder="https://twitter.com/..." />
        </div>

        <Input label="Description" textarea value={desc} onChange={setDesc} placeholder="Add a short note..." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-gray-700">Upload (image/pdf)</span>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border file:border-gray-300 file:bg-white hover:file:bg-gray-50"
            />
            <span className="text-xs text-gray-500">Optional. If provided, we infer type from file.</span>
          </label>
          <Input label="Tags (comma separated)" value={tags} onChange={setTags} placeholder="productivity, ideas" />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>Detected type: <span className="font-medium capitalize">{inferredKind}</span></div>
          <div className="flex gap-2">
            <Button variant="ghost" text="Cancel" onClick={onClose} />
            <Button variant="primary" type="submit" text="Submit" loading={saving} />
          </div>
        </div>
      </form>
    </Modal>
  );
}
