"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingRing from "@/components/LoadingRing";
import AnimatedProductCard from "@/components/AnimatedProductCard";

import { categories, SubCategory } from "@/data/categories";
import { useInfiniteProducts } from "@/hook/useInfiniteProducts";

export default function Sub3Page() {
  const { main, sub1, sub2, sub3 } = useParams();

  const mainSlug = Array.isArray(main) ? main[0] : main;
  const sub1Slug = Array.isArray(sub1) ? sub1[0] : sub1;
  const sub2Slug = Array.isArray(sub2) ? sub2[0] : sub2;
  const sub3Slug = Array.isArray(sub3) ? sub3[0] : sub3;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")        // convert & → and
    .replace(/[^\w\s-]/g, "")    // remove special characters
    .replace(/\s+/g, "-")        // spaces → dash
    .replace(/--+/g, "-");       // remove double dash


  // Safe category lookup
  const mainCat: SubCategory | undefined = categories.find(
    (cat) => mainSlug && slugify(cat.name) === mainSlug
  );

  const sub1Cat: SubCategory | undefined = mainCat?.subCategories.find(
    (sub) => sub1Slug && slugify(sub.name) === sub1Slug
  );

  const sub2Cat: SubCategory | undefined = sub1Cat?.subCategories.find(
    (sub) => sub2Slug && slugify(sub.name) === sub2Slug
  );

  const sub3Cat: SubCategory | undefined = sub2Cat?.subCategories.find(
    (sub) => sub3Slug && slugify(sub.name) === sub3Slug
  );

  // 🔥 SAFE fallback values
  const key = `sub3-${mainSlug ?? "x"}-${sub1Slug ?? "x"}-${sub2Slug ?? "x"}-${sub3Slug ?? "x"}`;

  const apiURL =
    mainCat && sub1Cat && sub2Cat && sub3Cat
      ? `/api/products?category=${encodeURIComponent(mainCat.name)}&subCategory=${encodeURIComponent(sub1Cat.name)}&subSubCategory=${encodeURIComponent(sub2Cat.name)}&subSubSubCategory=${encodeURIComponent(sub3Cat.name)}`
      : `/api/products?category=invalid`;

  // ✅ ALWAYS CALL HOOK
  const {
    products,
    isLoading,
    isLoadingMore,
    loadMoreRef,
  } = useInfiniteProducts(key, apiURL);

  // 🚨 AFTER hook
  if (!mainSlug || !sub1Slug || !sub2Slug || !sub3Slug || !mainCat || !sub1Cat || !sub2Cat || !sub3Cat) {
    return (
      <div className="p-8 text-center text-red-600">
        Category not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white pt-[100px] pb-24 px-0.5">
      <Header />

      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-4">
        <div className="text-sm text-gray-500 mb-1">
          <Link href="/">Home</Link>
          {" / "}{mainCat.name}
          {" / "}{sub1Cat.name}
          {" / "}{sub2Cat.name}
          {" / "}
          <span className="text-gray-900">{sub3Cat.name}</span>
        </div>

        <h1 className="text-lg font-semibold text-gray-900">
          {sub3Cat.name}
          <span className="font-normal text-gray-500">
            {" "}– {products.length} items
          </span>
        </h1>
      </div>

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
