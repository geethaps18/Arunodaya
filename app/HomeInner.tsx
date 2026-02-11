"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import LoadingRing from "@/components/LoadingRing";
import RecentProductsSlider from "@/components/home/RecentProductsSlider";

import { useInfiniteProducts } from "@/hook/useInfiniteProducts";
import { Render } from "@measured/puck";
import { puckConfig } from "@/cms/puck.config";
import AnimatedProductCard from "@/components/AnimatedProductCard";
import AnimatedCategoryCard from "@/components/AnimatedCategoryCard";


import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination,  Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


/* -------------------- Categories -------------------- */
const categories = [
  { name: "Men", image: "/images/men.png" },
  { name: "Ethnic", image: "/images/ethnic.png" },
  { name: "Western", image: "/images/western.png" },
  { name: "Kids", image: "/images/kids.png" },
  { name: "Groom Collections", image: "/images/groom.png" },
  { name: "Bridal Collections", image: "/images/bridal.png" },
  { name: "Couple Wedding Collections", image: "/images/couple.png" },
  { name: "Home", image: "/images/home.png" },
];

export default function HomeInner() {
  /* -------------------- Products -------------------- */
  const {
    products,
    isLoading,
    isLoadingMore,
    loadMoreRef,
  } = useInfiniteProducts("home", "/api/products?home=true");
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const initialLoading = isLoading && products.length === 0;
  const recentProducts = products.slice(0, 10);
  
const [animateCategories, setAnimateCategories] = useState(false);

useEffect(() => {
  setAnimateCategories(true);
}, []);

  /* -------------------- CMS -------------------- */
/* -------------------- CMS -------------------- */
const [cmsData, setCmsData] = useState<any>(null);

useEffect(() => {
  fetch("/api/cms/home")
    .then((res) => res.json())
    .then((data) => setCmsData(data));
}, []);

/* ✅ NOW cmsData exists — safe to use */
const orderedContent = cmsData?.content
  ? [
      ...cmsData.content.filter((b: any) => b.type === "HeroSlider"),
      ...cmsData.content.filter((b: any) => b.type !== "HeroSlider"),
    ]
  : [];
const heroBanners =
  cmsData?.content.filter((b: any) => b.type === "HeroBanner") || [];


  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= PAGE CONTENT ================= */}
      <main className="pt-[72px] lg:pt-[9px] flex-grow">
        {/* ================= HOME CATEGORY ROW ================= */}
      <section className="bg-white border-b lg:hidden">
  <div className="overflow-x-auto scrollbar-hide">
    <div className="flex gap-6 px-4 py-6 snap-x snap-mandatory">
      {categories.map((cat, index) => (
        <AnimatedCategoryCard
          key={cat.name}
          name={cat.name}
          image={cat.image}
          href={`/categories/${cat.name
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
          index={index}
        />
      ))}
    </div>
  </div>
</section>


     {/* ================= HERO / CMS ================= */}
    

{cmsData && (
  <section className="w-full">
   <Swiper
  modules={[Autoplay, Pagination, Thumbs]}
  autoplay={{
    delay: 3000,
    disableOnInteraction: false, // 🔑 keeps autoplay after arrow click
    pauseOnMouseEnter: false,    // 🔑 keeps autoplay on desktop hover
  }}
  pagination={{ clickable: true }}
  loop
  speed={800}
>

      {cmsData.content
        .filter((block: any) => block.type === "HeroBanner")
        .map((block: any) => (
          <SwiperSlide key={block.id}>
           <Render
  config={puckConfig}
  data={{
    content: [
      {
        ...block,
        props: block.props ?? {},
      },
    ],
  }}
/>

          </SwiperSlide>
        ))}
    </Swiper>
  </section>
  
)}



        {/* ================= RECENT PRODUCTS ================= */}
        {!isLoading && recentProducts.length > 4 && (
          <section className="py-14 bg-[#f5f5f5]">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-semibold mb-8">
                New Arrivals
              </h2>
              <RecentProductsSlider products={recentProducts} />
            </div>
          </section>
        )}

        {/* ================= PRODUCT GRID ================= */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            {initialLoading ? (
              <div className="flex justify-center py-24">
                <LoadingRing />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {products.map((product: any, index: number) => (
  <AnimatedProductCard
    key={product.id}
    product={product}
    index={index}
  />
))}

                </div>

                {isLoadingMore && (
                  <div className="flex justify-center py-12">
                    <LoadingRing />
                  </div>
                )}

                {/* Infinite scroll trigger */}
                <div ref={loadMoreRef} className="h-10 w-full" />
              </>
            )}
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}
