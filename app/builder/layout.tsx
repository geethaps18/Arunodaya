"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Package,
  ShoppingBag,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { SiteProvider, useSite } from "@/components/SiteContext";
import { useState } from "react";

const menu = [
  { name: "Products", href: "/builder/products", icon: Package },
  { name: "Orders", href: "/builder/orders", icon: ShoppingBag },
  { name: "Analytics", href: "/builder/analytics", icon: BarChart3 },
];

function BuilderLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { siteId } = useSite();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* 🔹 MOBILE HEADER */}
      <header className="
        md:hidden
        fixed top-0 left-0 right-0
        z-40
        flex items-center gap-3
        px-4 py-3
        bg-white border-b
      ">
        <button onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
        <span className="font-semibold">Staff Panel</span>
      </header>

      {/* 🔹 MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* 🔹 SIDEBAR */}
      <aside
        className={clsx(
          // base
          "fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r shadow-sm p-4",

          // animation
          "transition-transform duration-200 ease-in-out",

          // mobile
          open ? "translate-x-0" : "-translate-x-full",

          // desktop (ALWAYS FIXED)
          "md:translate-x-0 md:fixed"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex flex-col gap-2 mb-8 px-2">
          <div className="h-12">
            <img
              src="/images/arunodaya.png"
              alt="Arunodaya Logo"
              className="max-h-full object-contain"
            />
          </div>
          <span className="text-xs text-gray-500">
            Online Staff Panel
          </span>
        </Link>

        {/* Close button (mobile only) */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 md:hidden"
        >
          <X size={20} />
        </button>

        {/* Menu */}
        <nav className="space-y-1">
          {menu.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-yellow-500 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 🔹 MAIN CONTENT */}
      <main className="md:ml-64 pt-16 md:pt-0 p-4 md:p-6">
        {!siteId ? (
          <div className="mt-20 text-center text-gray-500">
            No website assigned to your account.
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteProvider>
      <BuilderLayoutInner>{children}</BuilderLayoutInner>
    </SiteProvider>
  );
}
