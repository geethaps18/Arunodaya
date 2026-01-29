"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle,
  Boxes,
  AlertTriangle,
  Users,
  BarChart2,
  Flame,
  Heart,
} from "lucide-react";

type DashboardStats = {
  todaySales: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  outOfStock: number;
  totalCustomers: number;
  monthlyRevenue: number;
  topCategory: string;
  wishlistCount?: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="h-10 w-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (!stats) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load dashboard data.
      </div>
    );
  }

  /* ---------------- CARDS ---------------- */
  const cards = [
    {
      title: "Sales Today",
      value: `₹${stats.todaySales}`,
      icon: ShoppingBag,
      color: "bg-blue-50 border-blue-200 text-blue-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: Package,
      color: "bg-green-50 border-green-200 text-green-600",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-yellow-50 border-yellow-200 text-yellow-600",
    },
    {
      title: "Delivered",
      value: stats.deliveredOrders,
      icon: CheckCircle,
      color: "bg-emerald-50 border-emerald-200 text-emerald-600",
    },
    {
      title: "Products",
      value: stats.totalProducts,
      icon: Boxes,
      color: "bg-purple-50 border-purple-200 text-purple-600",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock,
      icon: AlertTriangle,
      color: "bg-red-50 border-red-200 text-red-600",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-indigo-50 border-indigo-200 text-indigo-600",
    },
    {
      title: "Monthly Revenue",
      value: `₹${stats.monthlyRevenue}`,
      icon: BarChart2,
      color: "bg-teal-50 border-teal-200 text-teal-600",
    },
    {
      title: "Top Category",
      value: stats.topCategory,
      icon: Flame,
      color: "bg-orange-50 border-orange-200 text-orange-600",
    },
    {
      title: "Wishlist",
      value: stats.wishlistCount ?? 0,
      icon: Heart,
      color: "bg-pink-50 border-pink-200 text-pink-600",
    },
  ];


 return (
  <div className="space-y-4">
    <div className="max-w-7xl mx-auto p-12 md:p-6">

      {/* Title */}
      <h1 className="text-xl md:text-3xl text-center font-semibold p-3">
        Admin Dashboard
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;

          return (
            <div
              key={i}
              className={`border rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-4 ${c.color}`}
            >
              {/* Icon */}
              <div className="p-2 md:p-3 bg-white rounded-full shadow-sm">
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600 font-medium truncate">
                  {c.title}
                </p>
                <p className="text-lg md:text-xl font-bold">
                  {c.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
