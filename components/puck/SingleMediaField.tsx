"use client";

import { useEffect, useRef, useState } from "react";

export default function SingleMediaField({ value, onChange }: any) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<any[]>([]);

  // 🔥 LOAD MEDIA LIBRARY
  useEffect(() => {
    if (!open) return;

    fetch("/api/media")
      .then((res) => res.json())
      .then(setMedia)
      .catch(console.error);
  }, [open]);

  // 🔥 UPLOAD
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
            <video src={value.url} controls className="w-full h-40 object-cover" />
          ) : (
            <img src={value.url} className="w-full h-40 object-cover" />
          )}
        </div>
      )}

      {/* 🔥 BUTTONS */}
      <div className="flex gap-2">
        
        {/* Upload */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-3 py-2 bg-black text-white rounded w-full"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {/* Library */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-3 py-2 border rounded w-full"
        >
          Library
        </button>

      </div>

      {/* Hidden input */}
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

      {/* 🔥 REMOVE */}
      {value?.url && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-red-500 text-sm"
        >
          Remove
        </button>
      )}

      {/* 🔥 MEDIA LIBRARY MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-[600px] max-h-[80vh] overflow-y-auto">

            <h2 className="font-semibold mb-3">Media Library</h2>

            <div className="grid grid-cols-3 gap-3">
              {media.map((item) => (
                <img
                  key={item._id}
                  src={item.url}
                  className="cursor-pointer rounded hover:opacity-80"
                  onClick={() => {
                    onChange({
                      url: item.url,
                      type: item.mediaType,
                    });
                    setOpen(false);
                  }}
                />
              ))}
            </div>

            {media.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-6">
                No media found
              </p>
            )}

            <button
              onClick={() => setOpen(false)}
              className="mt-4 px-4 py-2 border rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}