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

 if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }
  if (!seller) return <div className="p-6">Seller not found</div>;

  return (
     <div className="px-1 py-12 sm:px-6 lg:px-12">
      <h1 className="text-3xl font-semibold">{seller.name}</h1>

      {/* Store Info */}
      <div className="px-1 py-6 sm:px-6 lg:px-12">
      <div className="bg-white border rounded-xl p-4 space-y-2 ">
        <p><b>Seller Phone:</b> {seller.phone}</p>
        <p><b>Seller Email:</b> {seller.email || "—"}</p>
        <p>
          <b>Status:</b>{" "}
          {seller.blocked ? (
            <span className="text-red-600">Inactive</span>
          ) : (
            <span className="text-green-600">Active</span>
          )}
        </p>
      </div>
      </div>

      {/* Storefront Info */}
       <div className="px-1 py-4 sm:px-6 lg:px-12">
      {seller.sites?.[0] && (
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Storefront</h2>
          <p><b>Name:</b> {seller.sites[0].name}</p>
          <p><b>URL:</b> /store/{seller.sites[0].slug}</p>
        </div>
        
      )}
</div>
      {/* Activate / Deactivate Store */}
      <div className="px-1 py-4 sm:px-6 lg:px-12">
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
            toast.error("Failed to update seller status");
          }
        }}
        className={`px-4 py-2 rounded-lg text-sm font-medium ${
          seller.blocked
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        {seller.blocked ? "Activate Seller" : "Deactivate Seller"}
      </button>
    </div>
    </div>
  );
}
