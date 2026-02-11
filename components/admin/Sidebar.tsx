"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackageSearch,
  ShoppingBag,
  Users2,
  BarChart3,
  Settings,
 UserCog,
  X,
} from "lucide-react";
import clsx from "clsx";

const menu = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Products", href: "/admin/products", icon: PackageSearch },
  { name: "Customers", href: "/admin/customers", icon: Users2 },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Staff", href: "/admin/sellers", icon: UserCog, },
  { name: "Settings", href: "/admin/cms", icon: Settings },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* 🔹 Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={clsx(
          // base
          "w-64 bg-white border-r shadow-sm",

          // position
          "fixed left-0 top-0 z-50 h-screen",

          // animation
          "transition-transform duration-200 ease-in-out",

          // mobile slide
          open ? "translate-x-0" : "-translate-x-full",

          // desktop always visible
          "md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <Link href="/" className="flex flex-col gap-1">
            <div className="h-10">
              <img
                src="/images/arclogo1.png"
                alt="Arunodaya Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-gray-500 ">Admin Panel</span>
          </Link>

          {/* Close (mobile only) */}
          <button onClick={onClose} className="md:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {menu.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-gray-900 text-white font-medium"
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
    </>
  );
}
