"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

import { useWishlist } from "@/app/context/WishlistContext";
import { ProductCardProduct } from "@/types/product-card";

interface ProductCardProps {
  product: ProductCardProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const router = useRouter();

  const [hovered, setHovered] = useState(false);
  const [rating, setRating] = useState(product.rating ?? 0);
  const [reviewCount, setReviewCount] = useState(product.reviewCount ?? 0);

  const liked = isInWishlist(product.id);

  /* -------------------- FETCH RATING -------------------- */
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`/api/products/${product.id}/rating`);
        if (!res.ok) return;
        const data = await res.json();
        setRating(data.rating ?? 0);
        setReviewCount(data.reviewCount ?? 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRating();
  }, [product.id]);

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none)").matches;

  /* -------------------- IMAGES -------------------- */
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/placeholder.png"];

  const mainImage = hovered ? images[1] ?? images[0] : images[0];

  /* -------------------- WISHLIST -------------------- */
  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getCookie("token");
    if (!token) {
      router.push("/login?redirect=wishlist");
      return;
    }

    toggleWishlist({
      id: product.id,
      name: product.name,
      images: product.images,
      price: product.price,
    });
  };

  /* -------------------- VARIANT SIZES -------------------- */
  const variantSizes: string[] = Array.from(
    new Set(
      product.variants
        ?.filter((v) => v.stock > 0 && v.size)
        .map((v) => v.size)
    )
  );

  return (
    <Link
      href={`/product/${product.id}`}
      className="block w-full cursor-pointer touch-manipulation"
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/5] bg-white overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out pointer-events-none ${
            hovered ? "scale-[1.04]" : "scale-100"
          }`}
        />

        {/* WISHLIST */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={handleWishlistClick}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/70 backdrop-blur transition-opacity duration-300 opacity-80 hover:opacity-100"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                liked ? "text-black fill-black" : "text-gray-500"
              }`}
            />
          </button>
        </div>

        {/* SIZES (CAVA STYLE) */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 text-xs tracking-wide text-gray-700 bg-white/80 backdrop-blur px-3 py-1 transition-opacity duration-300 ${
            !isMobile && hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {variantSizes.length > 0
            ? `Sizes : ${variantSizes.join("  ")}`
            : "One Size"}
        </div>
      </div>

      {/* INFO */}
      <div className="pt-3">
        <h3 className="line-clamp-1 text-[#111111] text-sm md:text-base font-normal">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-1">
          <p className="text-[11px] uppercase tracking-widest text-gray-500">
            {product.brandName ?? "ARUNODAYA"}
          </p>

          {rating > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <span className="text-gray-700 font-medium">
                {rating.toFixed(1)}
              </span>
              <span className="text-gray-400">•</span>
              {reviewCount > 0 && (
                <span className="text-gray-400">
                  {reviewCount}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
              {product.mrp && product.mrp > product.price && (
            <span className="text-gray-400 line-through text-xs md:text-sm">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          )}
        
          <span className="text-gray-900 text-sm md:text-base font-medium">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
            {product.discount && product.discount > 0 && (
  <span className="text-[11px] tracking-wide text-gray-500">
    {product.discount}% off
  </span>
)}
      

        </div>
      </div>
    </Link>
  );
}
