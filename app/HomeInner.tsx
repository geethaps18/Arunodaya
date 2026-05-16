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
import { Autoplay, Pagination, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { categories } from "@/data/categories";

/* -------------------- Categories -------------------- */
const buildWomenHighlights = () => {
  const womenCategory = categories.find(
    (cat) => cat.name === "Women"
  );

  if (!womenCategory) return [];

  const items: any[] = [];

  womenCategory.subCategories.forEach((sub) => {

    // LEVEL 1
    items.push({
      name: sub.name,
      image: sub.image,
      link: `/categories/women/${sub.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
    });

    // LEVEL 2
    sub.subCategories?.forEach((child) => {

      items.push({
        name: child.name,
        image: child.image,
        link: `/categories/women/${sub.name
          .toLowerCase()
          .replace(/\s+/g, "-")}/${child.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      });

      // LEVEL 3
      child.subCategories?.forEach((subchild) => {

        items.push({
          name: subchild.name,
          image: subchild.image,
          link: `/categories/women/${sub.name
            .toLowerCase()
            .replace(/\s+/g, "-")}/${child.name
            .toLowerCase()
            .replace(/\s+/g, "-")}/${subchild.name
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
        });

        // LEVEL 4
        subchild.subCategories?.forEach((deepchild) => {

          items.push({
            name: deepchild.name,
            image: deepchild.image,
            link: `/categories/women/${sub.name
              .toLowerCase()
              .replace(/\s+/g, "-")}/${child.name
              .toLowerCase()
              .replace(/\s+/g, "-")}/${subchild.name
              .toLowerCase()
              .replace(/\s+/g, "-")}/${deepchild.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
          });

        });

      });

    });

  });

  return items;
};

const highlightCategories: any = {
  Women: buildWomenHighlights(),
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

const sortedProducts = [...products]
  .filter(
    (product: any) =>
      Number(String(product.price).replace(/,/g, "")) > 165
  )
  .sort(
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
   
<section className="bg-white pt-6">


    {/* Top Word Tabs */}
 {/* ================= DYNAMIC CATEGORY SWIPERS ================= */}
<section className="bg-white py-4 lg:hidden">

  {categories.map((mainCategory) => {  <h2 className="text-[22px] font-bold px-4 mb-3 font-[var(--font-newsreader)]">
      {mainCategory.name}
    </h2>
  

    // collect all nested categories
    const allItems: any[] = [];

    mainCategory.subCategories.forEach((sub) => {

      allItems.push({
        name: sub.name,
        image: sub.image,
        link: `/categories/${mainCategory.name.toLowerCase()}/${sub.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      });

      sub.subCategories?.forEach((child) => {

        allItems.push({
          name: child.name,
          image: child.image,
          link: `/categories/${mainCategory.name.toLowerCase()}/${sub.name
            .toLowerCase()
            .replace(/\s+/g, "-")}/${child.name
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
        });

        child.subCategories?.forEach((subchild) => {

          allItems.push({
            name: subchild.name,
            image: subchild.image,
            link: `/categories/${mainCategory.name.toLowerCase()}/${sub.name
              .toLowerCase()
              .replace(/\s+/g, "-")}/${child.name
              .toLowerCase()
              .replace(/\s+/g, "-")}/${subchild.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
          });

        });

      });

    });

    return (
      <div key={mainCategory.id} className="mb-3">
         <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-[24px] font-bold font-[var(--font-newsreader)]">
            {mainCategory.name}
          </h2>

          <Link
            href={`/categories/${mainCategory.name.toLowerCase()}`}
            className="text-sm text-gray-500"
          >
            View All
          </Link>
        </div>
        {/* SWIPER */}
      <Swiper
  modules={[FreeMode]}
  slidesPerView={5.5}
  spaceBetween={0.5}
  freeMode={true}
  grabCursor={true}
  className="px-0.5"
>
          {allItems.map((item, index) => (
            <SwiperSlide key={index}>

              <Link
                href={item.link}
                className="flex flex-col items-center"
              >

                {/* IMAGE */}
            <div className="relative w-[58px] h-[58px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                className="object-cover"
                  />

                </div>

                {/* NAME */}
                <p className="text-[11px] text-center mt-1 leading-tight line-clamp-2">
                  {item.name}
                </p>

              </Link>

            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    );
  })}

</section>
    

     {/* ================= HERO / CMS ================= */}
    

{cmsData && (
  <section className="relative w-screen-mt-1">
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
  <div className="grid grid-cols-2 gap-2">

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
      className="relative w-full h-[300px] flex-shrink-0 rounded-lg overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
    >

  <div className="relative w-full h-full">
    <Image
      src={item.image}
      alt={item.name}
      fill
      sizes="120px"
      className="object-cover  group-hover:scale-105 transition-transform duration-500"
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
