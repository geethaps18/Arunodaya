"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingRing from "@/components/LoadingRing";
import AnimatedProductCard from "@/components/AnimatedProductCard";

import { categories } from "@/data/categories";
import { useInfiniteProducts } from "@/hook/useInfiniteProducts";

export default function Sub1Page() {
  const { main, sub1 } = useParams();

  const mainSlug = Array.isArray(main) ? main[0] : main;
  const sub1Slug = Array.isArray(sub1) ? sub1[0] : sub1;

  const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")        // convert & → and
    .replace(/[^\w\s-]/g, "")    // remove special characters
    .replace(/\s+/g, "-")        // spaces → dash
    .replace(/--+/g, "-");       // remove double dash


  // Safe find
  const mainCat = categories.find(
    (c) => mainSlug && slugify(c.name) === mainSlug
  );

  const sub1Cat = mainCat?.subCategories.find(
    (s) => sub1Slug && slugify(s.name) === sub1Slug
  );

  // 🔥 SAFE FALLBACK VALUES
  const key = `sub1-${mainSlug ?? "x"}-${sub1Slug ?? "x"}`;

  const apiURL =
    mainCat && sub1Cat
      ? `/api/products?category=${encodeURIComponent(mainCat.name)}&subCategory=${encodeURIComponent(sub1Cat.name)}`
      : `/api/products?category=invalid`;

  // ✅ ALWAYS CALL HOOK
  const {
    products,
    isLoading,
    isLoadingMore,
    loadMoreRef,
  } = useInfiniteProducts(key, apiURL);

  // 🚨 AFTER hook → now safe to return
  if (!mainSlug || !sub1Slug || !mainCat || !sub1Cat) {
    return (
      <div className="p-8 text-center text-red-600">
        Category not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white pt-[100px] pb-24 px-0.5">
      <Header />

      {/* Desktop breadcrumb + title */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-4">
        <div className="text-sm text-gray-500 mb-1">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          {" / "}{mainCat.name}
          {" / "}
          <span>{sub1Cat.name}</span>
        </div>

        <h1 className="text-lg font-semibold text-gray-900">
          {sub1Cat.name}
          <span className="font-normal text-gray-500">
            {" "}– {products.length} items
          </span>
        </h1>
      </div>

      {/* Mobile subcategories */}
      {sub1Cat.subCategories.length > 0 && (
        <div className="lg:hidden mb-2 grid grid-cols-4 gap-1 px-0">
          {sub1Cat.subCategories.map((sub2) => {
            const sub2Slug = slugify(sub2.name);

            return (
              <Link
                key={sub2.name}
                href={`/categories/${mainSlug}/${sub1Slug}/${sub2Slug}`}
                className="relative block w-full h-40 rounded-lg overflow-hidden"
              >
                <Image
                  src={sub2.image}
                  alt={sub2.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {sub2.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Products */}
      <main className="flex-grow px-1 pb-4">
        {isLoading && products.length === 0 ? (
          <div className="flex justify-center py-20">
            <LoadingRing />
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-center py-16">
            No products found.
          </p>
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
