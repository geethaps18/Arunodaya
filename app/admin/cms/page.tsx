"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@measured/puck/puck.css";
import { puckConfig } from "@/cms/puck.config";

// Disable SSR for Puck
const Puck = dynamic(
  () => import("@measured/puck").then((mod) => mod.Puck),
  { ssr: false }
);

export default function AdminCMSPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  async function loadData() {
    try {
      const res = await fetch("/api/cms/home", { cache: "no-store" });
      const saved = await res.json();
      setData(saved);
    } catch (error) {
      console.error("Failed to load CMS data:", error);
    } finally {
      setLoading(false); // ✅ IMPORTANT
    }
  }

  loadData();
}, []);
 if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }


  return (
    <div className="px-2 py-12 sm:px-6 lg:px-12 space-y-4">
      
      {/* 🔗 MEDIA PAGE BUTTON */}
      <div className="flex justify-end">
        <a
          href="/admin/media"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          📁 Open Media Upload
        </a>
      </div>

      <div className="h-screen">
        <Puck
          config={puckConfig}
          data={data}
          onPublish={async (newData) => {
            await fetch("/api/cms/home", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newData),
            });
            alert("Homepage updated ✅");
          }}
        />
      </div>
    </div>
  );
}
