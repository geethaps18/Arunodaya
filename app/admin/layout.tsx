"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { Menu } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* 🔹 Mobile Header */}
<header className="
  md:hidden
  flex items-center gap-3
  p-4
  bg-white
  border-b
  fixed top-0 left-0 right-0
  z-40
">

        <button onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
        <span className="font-semibold">Admin Panel</span>
      </header>

      {/* 🔹 Sidebar */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* 🔹 Main Content */}
      <main className="md:ml-64 min-h-screen bg-gray-50">
  <div className="p-4 md:p-6 max-w-7xl mx-auto">
    {children}
  </div>
</main>

    </div>
  );
}
