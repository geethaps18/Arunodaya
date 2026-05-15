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
import { useRouter } from "next/navigation";


import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination,  Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


/* -------------------- Categories -------------------- */
const highlightCategories: any = {
  Women: [
   {
  name: "Arunodaya Gold",
  image: "/images/gold.png",
  main: "women",
  sub: "ethnic-wear",
  child: "arunodaya-gold",
  link: "categories/women/ethnic-wear/arunodaya-gold",

},
 { name: "Western Wear", image: "/images/western-wear.png" },
    { name: "Embroidery Tops", image: "/images/embroidery.png" ,
      link:"categories/women/western-wear/tops/embroidery-tops",
    },
    { name: "Kurta Sets", image: "/images/kurta-set.png" ,
      link: "categories/women/ethnic-wear/kurta-sets",
    },
    { name: "CropTop Set", image: "/images/croptop-set.png",
      link:"categories/women/western-wear/crop-top-sets",
     },
    { name: "Night Wear Set", image: "/images/night.png",
      link: "categories/women/night-wear/night-wear-sets",
     },
    { name: "Coardset", image: "/images/coard.png",
      link: "categories/women/ethnic-wear/kurta-sets/coard-sets",
     },
    { name: "Umbrella Set", image: "/images/umbrella.png",
      link: "/categories/women/ethnic-wear/kurta-sets/grand-umbrella-sets",
     },
   
  


  ],
};


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
 const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("Women");
const [animateCategories, setAnimateCategories] = useState(false);
const router = useRouter();

useEffect(() => {
  setAnimateCategories(true);
}, []);

useEffect(() => {
  fetch("/api/products/new-arrivals")
    .then((res) => res.json())
    .then((data) => {
      setRecentProducts(data.products || []);
    });
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
const sortedProducts = [...products].sort(
  (a: any, b: any) =>
    Number(String(a.price).replace(/,/g, "")) -
    Number(String(b.price).replace(/,/g, ""))
);

  return (
 <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#faf7f2] via-white to-[#f8f8f8] overflow-x-hidden">
      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= PAGE CONTENT ================= */}
      <main className="pt-[72px] lg:pt-[9px] flex-grow">
        
        {/* ================= HOME CATEGORY ROW ================= */}
   
<section className="bg-white pt-8 ">


    {/* Top Word Tabs */}
    <div className="flex justify-center gap-10 pb-4 lg:hidden ">
      {["Women", "Men", "Kids",].map((tab) => (
<Link
  key={tab}
  href={`/categories/${tab.toLowerCase()}`}
className="text-[26px] font-medium tracking-wide text-gray-900 hover:text-black transition-all duration-300 font-[var(--font-newsreader)]"
>
  {tab}
</Link>
      ))}
    </div>
    

     {/* ================= HERO / CMS ================= */}
    

{cmsData && (
  <section className="relative w-screen">
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


   {/* Highlight Cards - Single Row */}
<div className="mt-5 lg:hidden">
  <div className="grid grid-cols-2 gap-4">

{highlightCategories[activeTab].map((item: any) => {
  const href =
    item.link ||
    `/categories/${activeTab.toLowerCase()}/${item.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

  return (
    <Link
      key={item.name}
      href={href}
      className="relative w-[240px] h-[300px] flex-shrink-0 rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
    >

  <div className="relative w-full h-full">
    <Image
      src={item.image}
      alt={item.name}
      fill
      sizes="120px"
      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
    />
  </div>

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
    <span className="text-white text-m font-semibold text-center px-2">
      {item.name}
    </span>
  </div>
</Link>

      );
    })}

  </div>
</div>


</section>



        {/* ================= RECENT PRODUCTS ================= */}
        {!isLoading && recentProducts.length > 4 && (
          <section className="py- ">
              <RecentProductsSlider products={recentProducts} />
          
          </section>
        )}

        {/* ================= PRODUCT GRID ================= */}
        <section className="py-1">
          <div className="max-w-7xl mx-auto px-2">
            {initialLoading ? (
              <div className="flex justify-center py-24">
                <LoadingRing />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-4">
                {sortedProducts.map((product: any, index: number) => (
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
