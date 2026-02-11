"use client";

import { useState } from "react";

export default function AdminMediaPage() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUrl(data.path);
    setCopied(false);
  }

  function copyUrl() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="p-10 space-y-4 max-w-lg">
      <h1 className="text-xl font-bold">Media Upload</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            uploadImage(e.target.files[0]);
          }
        }}
      />

      {url && (
        <div className="space-y-2">
          <img src={url} className="h-40 object-cover rounded" />

          <div className="flex gap-2 items-center">
            <code className="bg-gray-100 p-2 text-sm flex-1">
              {url}
            </code>

            <button
              onClick={copyUrl}
              className="bg-black text-white px-3 py-2 rounded text-sm"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Paste this into <b>Image URL</b> field in CMS
          </p>
        </div>
      )}
    </div>
  );
}
