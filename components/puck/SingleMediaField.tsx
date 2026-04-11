"use client";

import { useRef, useState } from "react";

export default function SingleMediaField({ value, onChange }: any) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      onChange({
        url: data.url,
        type: file.type.startsWith("video") ? "video" : "image",
      });

    } catch (err) {
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">

      {/* 🔥 Preview */}
      {value?.url && (
        <div className="border rounded overflow-hidden">
          {value.type === "video" ? (
            <video
              src={value.url}
              controls
              className="w-full h-40 object-cover"
            />
          ) : (
            <img
              src={value.url}
              className="w-full h-40 object-cover"
            />
          )}
        </div>
      )}

      {/* 🔥 Upload Button ONLY */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="px-3 py-2 bg-black text-white rounded w-full"
      >
        {loading ? "Uploading..." : "Upload Image / Video"}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {/* 🔥 Remove */}
      {value?.url && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-red-500 text-sm"
        >
          Remove
        </button>
      )}
    </div>
  );
}