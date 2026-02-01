"use client";

import { useEffect, useState } from "react";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { puckConfig } from "@/cms/puck.config";

export default function AdminCMSPage() {
  const [data, setData] = useState<{ content: any[] } | null>(null);

  // 🔹 Load saved CMS data
  useEffect(() => {
    fetch("/api/cms/home", { cache: "no-store" })
      .then((res) => res.json())
      .then((saved) => {
        setData(saved);
      });
  }, []);

  if (!data) {
    return <div className="p-10">Loading CMS…</div>;
  }

  return (
    <div className="h-screen p-12">
      <Puck
        config={puckConfig}
        data={data}
        onPublish={async (newData) => {
          // ✅ ENFORCE ONLY ONE HERO BANNER
          let heroBannerSeen = false;

          const cleanedContent = newData.content.filter((block: any) => {
            if (block.type !== "HeroBanner") return true;

            if (!heroBannerSeen) {
              heroBannerSeen = true;
              return true; // keep first
            }

            return false; // drop others
          });

          await fetch("/api/cms/home", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...newData,
              content: cleanedContent,
            }),
          });

          alert(
            "Homepage updated ✅\n\nNote: Only ONE Hero Banner is allowed. Extra ones were removed automatically."
          );
        }}
      />
    </div>
  );
}
