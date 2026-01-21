"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminSellerDetailPage() {
  const { id } = useParams();
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/seller/${id}`)
      .then((res) => res.json())
      .then((data) => setSeller(data.seller))
      .catch(() => toast.error("Failed to load online store"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading store…</div>;
  if (!seller) return <div className="p-6">Store not found</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">{seller.name}</h1>

      {/* Store Info */}
      <div className="bg-white border rounded-xl p-4 space-y-2">
        <p><b>Store Phone:</b> {seller.phone}</p>
        <p><b>Store Email:</b> {seller.email || "—"}</p>
        <p>
          <b>Status:</b>{" "}
          {seller.blocked ? (
            <span className="text-red-600">Inactive</span>
          ) : (
            <span className="text-green-600">Active</span>
          )}
        </p>
      </div>

      {/* Storefront Info */}
      {seller.sites?.[0] && (
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Storefront</h2>
          <p><b>Name:</b> {seller.sites[0].name}</p>
          <p><b>URL:</b> /store/{seller.sites[0].slug}</p>
        </div>
      )}

      {/* Activate / Deactivate Store */}
      <button
        onClick={async () => {
          try {
            const res = await fetch(`/api/admin/seller/${id}/block`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ blocked: !seller.blocked }),
            });

            if (!res.ok) throw new Error("Failed");

            setSeller((prev: any) => ({
              ...prev,
              blocked: !prev.blocked,
            }));
          } catch {
            toast.error("Failed to update store status");
          }
        }}
        className={`px-4 py-2 rounded-lg text-sm font-medium ${
          seller.blocked
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        {seller.blocked ? "Activate Store" : "Deactivate Store"}
      </button>
    </div>
  );
}
