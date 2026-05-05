"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "../context/BagContext";
import Footer from "@/components/Footer";

export default function FreeGiftPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get("type");
  const qty = Number(searchParams.get("qty") || 1);

  const [products, setProducts] = useState<any[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, any>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const { addToCart, bagItems } = useCart();

  useEffect(() => {
    if (!type) return;

    fetch(`/api/free-gift?type=${type}`)
      .then(res => res.json())
      .then(setProducts);
  }, [type]);

  const handleSelectFree = async (product: any) => {
    const freeItemsCount = bagItems
      .filter(i => i.price === 0)
      .reduce((sum, i) => sum + i.quantity, 0);

    if (freeItemsCount >= qty) {
      alert("Free items already selected");
      return;
    }

    const selectedVariant = selectedVariants[product.id];
    const size = selectedSizes[product.id];

    if (!selectedVariant) return alert("Select color");
    if (!size) return alert("Select size");

    const sizeObj = selectedVariant.sizes.find(
      (s: any) => s.size === size
    );

    await addToCart(
      product,
      0,
      sizeObj.size,
      selectedVariant.color,
      sizeObj.id,
      selectedVariant.images || product.images,
      sizeObj.stock
    );

    if (freeItemsCount + 1 >= qty) {
      router.push("/bag");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* 🔥 HEADER WITH BACK BUTTON */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push("/bag")}
          className="text-lg font-bold"
        >
          ←
        </button>

        <h1 className="text-base font-semibold">
          Select your FREE {type}
        </h1>
      </div>

      {/* 🔥 CONTENT */}
      <div className="flex-grow p-4 max-w-6xl mx-auto w-full">

        <p className="text-green-700 text-sm font-medium mb-3">
          🎉 Free Gift Unlocked!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition"
            >

              {/* IMAGE */}
              <div className="relative w-46 h-46">
                <Image
                  src={
                    selectedVariants[p.id]?.images?.[0] ||
                    p.images?.[0]
                  }
                  alt={p.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* NAME */}
              <p className="text-sm mt-2 font-medium line-clamp-1">
                {p.name}
              </p>

              {/* PRICE */}
              <div className="flex items-center gap-2 text-xs mt-1">
                <span className="text-green-600 font-semibold">
                  FREE
                </span>
                <span className="line-through text-gray-400">
                  ₹{p.price}
                </span>
              </div>

              {/* COLOR SELECT */}
              <div className="mt-2">
                <label className="text-xs text-gray-500">
                  Color
                </label>

                <select
                  value={selectedVariants[p.id]?.color || ""}
                  onChange={(e) => {
                    const selectedColor = e.target.value;

                    const variant = p.variants.find(
                      (v: any) => v.color === selectedColor
                    );

                    setSelectedVariants(prev => ({
                      ...prev,
                      [p.id]: variant,
                    }));

                    setSelectedSizes(prev => ({
                      ...prev,
                      [p.id]: "",
                    }));
                  }}
                  className="mt-1 w-full border px-2 py-1 text-sm rounded-lg"
                >
                  <option value="">Select Color</option>
                  {p.variants.map((v: any) => (
                    <option key={v.color} value={v.color}>
                      {v.color}
                    </option>
                  ))}
                </select>
              </div>

              {/* SIZE */}
              {selectedVariants[p.id]?.sizes?.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">
                    Size
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedVariants[p.id].sizes.map((s: any) => {
                      const isSelected =
                        selectedSizes[p.id] === s.size;

                      return (
                        <button
                          key={s.id}
                          onClick={() =>
                            setSelectedSizes(prev => ({
                              ...prev,
                              [p.id]: s.size,
                            }))
                          }
                          className={`px-3 py-1 text-xs rounded border ${
                            isSelected
                              ? "border-green-600 bg-green-50 text-green-700"
                              : "border-gray-300"
                          }`}
                        >
                          {s.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BUTTON */}
              <button
                onClick={() => handleSelectFree(p)}
                disabled={
                  !selectedVariants[p.id] ||
                  !selectedSizes[p.id]
                }
                className={`mt-3 w-full py-2 rounded text-sm ${
                  !selectedVariants[p.id] ||
                  !selectedSizes[p.id]
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 text-white"
                }`}
              >
                Add Free 🎁
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 FOOTER */}
      <Footer />
    </div>
  );
}