"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

import { categories } from "@/data/categories";
import LoadingRing from "@/components/LoadingRing";
import { useInfiniteProducts } from "@/hook/useInfiniteProducts";
import AnimatedProductCard from "@/components/AnimatedProductCard";

export default function MainCategoryPage() {
  const { main } = useParams();
  const mainSlug = Array.isArray(main) ? main[0] : main;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")        // convert & → and
    .replace(/[^\w\s-]/g, "")    // remove special characters
    .replace(/\s+/g, "-")        // spaces → dash
    .replace(/--+/g, "-");       // remove double dash


  // Always compute safe fallback values
  const mainCat = categories.find(
    (c) => mainSlug && slugify(c.name) === mainSlug
  );

  // 🔥 SAFE defaults so hook is NEVER conditional
  const key = `main-${mainSlug ?? "unknown"}`;
  const apiUrl = mainCat
    ? `/api/products?category=${encodeURIComponent(mainCat.name)}`
    : `/api/products?category=unknown`;

  // ✅ HOOK MUST BE CALLED UNCONDITIONALLY
  const {
    products,
    isLoading,
    isLoadingMore,
    loadMoreRef,
  } = useInfiniteProducts(key, apiUrl);

  // Now we can return safely
  if (!mainSlug || !mainCat) {
    return (
      <div className="p-8 text-center text-red-600">
        Category not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[100px] px-0.5">
      <Header />

      {/* Subcategories */}
      {mainCat.subCategories.length > 0 && (
        <div className="grid grid-cols-4 gap-2 lg:hidden sm:grid-cols-3 md:grid-cols-4 sm:gap-4 px-1 mb-2">
          {mainCat.subCategories.map((sub) => {
            const subSlug = slugify(sub.name);

            return (
              <Link
                key={sub.name}
                href={`/categories/${mainSlug}/${subSlug}`}
                className="relative group rounded-lg overflow-hidden shadow hover:shadow-lg transition-all"
              >
                <Image
                  src={sub.image}
                  alt={sub.name}
                  width={400}
                  height={300}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                />

                <div className="absolute bottom-0 w-full bg-black/35 text-white text-center py-20 text-sm font-semibold">
                  {sub.name}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Desktop Title */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 pb-4">
        <h1 className="text-lg font-semibold text-gray-900">
          {mainCat.name}
          <span className="text-sm font-normal text-gray-500 ml-2">
            – {products.length}{" "}
            {products.length === 1 ? "Product" : "Products"}
          </span>
        </h1>
      </div>

      {/* Products */}
      <main className="flex-grow sm:p-6 pb-2">
        {isLoading && products.length === 0 ? (
          <div className="flex justify-center py-20">
            <LoadingRing />
          </div>
        ) : products.length === 0 ? (
          <div className="text-gray-500 mt-4 text-center">
            No products available in this category.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-0.5 gap-y-6">
              {products.map((product: any, index: number) => (
                <AnimatedProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>

            {isLoadingMore && (
              <div className="flex justify-center py-8">
                <LoadingRing />
              </div>
            )}

            <div ref={loadMoreRef} className="h-12 w-full" />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
