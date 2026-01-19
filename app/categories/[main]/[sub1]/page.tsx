"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import LoadingRing from "@/components/LoadingRing";

import { categories, SubCategory } from "@/data/categories";
import { useInfiniteProducts } from "@/hook/useInfiniteProducts";

export default function Sub1Page() {
  const { main, sub1 } = useParams();
  const mainSlug = Array.isArray(main) ? main[0] : main;
  const sub1Slug = Array.isArray(sub1) ? sub1[0] : sub1;

  const key = `sub1-${mainSlug}-${sub1Slug}`;
  const apiURL = `/api/products?category=${mainSlug}&subCategory=${sub1Slug}`;

  const {
    products,
    isLoading,
    isLoadingMore,
    loadMoreRef, // 👈 REQUIRED
  } = useInfiniteProducts(key, apiURL);

  if (!mainSlug || !sub1Slug) {
    return (
      <div className="p-8 text-center text-red-600">
        Category not found
      </div>
    );
  }

  const mainCat: SubCategory | undefined = categories.find(
    (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === mainSlug
  );

  const sub1Cat: SubCategory | undefined = mainCat?.subCategories.find(
    (sub) => sub.name.toLowerCase().replace(/\s+/g, "-") === sub1Slug
  );

  return (
    <div className="min-h-screen flex flex-col bg-white pt-[100px] pb-24 px-0.5">
      {/* ✅ HEADER */}
      <Header />

      {/* ✅ DESKTOP BREADCRUMB + TITLE */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-4">
        <div className="text-sm text-gray-500 mb-1">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          {mainCat && <> / <span>{mainCat.name}</span></>}
          {sub1Cat && <> / <span>{sub1Cat.name}</span></>}
        </div>

        <h1 className="text-lg font-semibold text-gray-900">
          {sub1Cat?.name}{" "}
          <span className="font-normal text-gray-500">
            – {products.length} items
          </span>
        </h1>
      </div>

      {/* ✅ MOBILE SUB-CATEGORIES */}
      {sub1Cat?.subCategories.length ? (
        <div className="lg:hidden mb-2 grid grid-cols-2 gap-0.5 px-0">
          {sub1Cat.subCategories.map((sub2) => {
            const sub2Slug = sub2.name.toLowerCase().replace(/\s+/g, "-");
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
      ) : null}

      {/* ✅ PRODUCTS */}
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
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {isLoadingMore && (
              <div className="flex justify-center py-8">
                <LoadingRing />
              </div>
            )}

            {/* 🔥 REQUIRED sentinel */}
            <div ref={loadMoreRef} className="h-12 w-full" />
          </>
        )}
      </main>

      {/* ✅ FOOTER */}
      <Footer />
    </div>
  );
}
