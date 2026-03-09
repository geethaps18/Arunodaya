"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ExchangePage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params?.id as string;
  const itemId = params?.itemId as string;

  const [item, setItem] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();

      const found = data.order.items.find((i: any) => i.id === itemId);
      setItem(found);
    };

    load();
  }, [orderId, itemId]);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Select exchange reason");
      return;
    }

    if (reason === "SIZE_ISSUE" && !selectedSize) {
      toast.error("Select new size");
      return;
    }

    const res = await fetch(`/api/orders/${orderId}/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        newSize: reason === "SIZE_ISSUE" ? selectedSize : item.size,
        reason,
      }),
    });

    if (res.ok) {
      toast.success("Exchange request submitted");
      router.push(`/orders/${orderId}`);
    } else {
      toast.error("Failed");
    }
  };

  if (!item) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Request Exchange</h1>

      {/* Product Info */}
      <div className="border p-4 rounded bg-gray-50">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-600">
          Current Size: {item.size}
        </p>
      </div>

      {/* Reason Selection */}
      <div>
        <p className="text-sm font-medium mb-2">Reason for Exchange</p>
        <select
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setSelectedSize(null);
          }}
          className="w-full border p-2 rounded"
        >
          <option value="">Select reason</option>
          <option value="SIZE_ISSUE">Size doesn't fit</option>
          <option value="DEFECT">Received defective item</option>
        </select>
      </div>

      {/* Size Options (Only if size issue) */}
      {reason === "SIZE_ISSUE" && (
        <div>
          <p className="text-sm font-medium mb-2">Select New Size</p>
          <div className="flex gap-2 flex-wrap">
            {item.product?.variants
              ?.filter(
                (v: any) => v.stock > 0 && v.size !== item.size
              )
              .map((variant: any) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`px-3 py-1 border rounded ${
                    selectedSize === variant.size
                      ? "border-black bg-gray-800 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {variant.size}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-gray-800 text-white rounded hover:opacity-90"
      >
        Submit Exchange Request
      </button>
    </div>
  );
}