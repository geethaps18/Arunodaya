"use client";

import { useEffect, useState } from "react";

export default function MediaPicker({ value, onChange }: any) {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/media")
      .then(res => res.json())
      .then((data) => setMedia(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading media...</p>;

  return (
    <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto border p-2 rounded">
      {media.map((item) => (
        <img
          key={item._id}
          src={item.url}
          onClick={() => onChange(item.url)}
          className={`cursor-pointer rounded border ${
            value === item.url ? "border-black" : "border-gray-200"
          }`}
        />
      ))}
    </div>
  );
}