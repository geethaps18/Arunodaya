"use client";


import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Scrollbar, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import { ShoppingBag, Heart, Share2 } from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext";
import { useCart } from "@/app/context/BagContext";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Product as ProductType } from "@/types/product";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import LoadingRing from "@/components/LoadingRing";
import Link from "next/link";
import ProductAccordion from "@/components/ProductAccordion";
import { COLOR_OPTIONS } from "@/data/colors";
import { Zoom } from "swiper/modules";
import "swiper/css/zoom";


const productCache = new Map<string, ProductWithReviews>();


/** --------------------------
 * ZoomImage component (click to zoom + move-to-pan)
 * --------------------------- */
function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const MIN = 1;
  const MAX = 2;
  const [zoom, setZoom] = useState<number>(MIN);
  const [bgPos, setBgPos] = useState<string>("center");

  const toggleZoom = () => {
    setZoom((prev) => (prev === MIN ? MAX : MIN));
    if (zoom !== MIN) setBgPos("center");
  };

  const setPos = (x: number, y: number, el: HTMLDivElement) => {
    if (zoom === MIN) return;
    const rect = el.getBoundingClientRect();
    const rx = ((x - rect.left) / rect.width) * 100;
    const ry = ((y - rect.top) / rect.height) * 100;
    setBgPos(`${rx}% ${ry}%`);
  };

  return (
    <div className="relative w-full ">
      <div
        onClick={toggleZoom}
        onMouseMove={(e) => setPos(e.clientX, e.clientY, e.currentTarget)}
        onTouchMove={(e) =>
        
        setPos(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget)

        }
        className={`w-full aspect-[3/4] select-none  ${
          zoom === MIN ? "cursor-zoom-in" : "cursor-move"
        }`}
       style={{
  backgroundImage: `url(${src})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: zoom === MIN ? "center" : bgPos,
  backgroundSize: zoom === MIN ? "cover" : `${zoom * 140}%`,
}}

      >
        {/* Invisible Image keeps layout/resolution stable for Next/Image optimization */}
        <Image src={src} alt={alt} fill className="opacity-0" draggable={false} />
      </div>
    </div>
  );
}
type GalleryItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string };


/** ---- Types ---- */
interface Review {
  id: string;
  rating: number;
  comment?: string;
  images?: string[];
  createdAt?: string;
  // Prisma include gives user.name; or your API may return userName
  user?: { name?: string | null } | string | null;
  userName?: string | null;
}

type ProductWithReviews = {
  id: string;
  name: string;
  description: string;

  brandName?: string;
  category?: string;

  images: string[];
  video?: string | null;

  price: number;
  mrp?: number | null;
  discount?: number | null;
  discountAmount?: number | null; // ✅ ADD


  stock?: number;

  rating?: number;
  reviewCount?: number;

  sizes: string[];

 variants: {
  id: string;
  size?: string | null;
  color?: string | null;
  price?: number;
  stock?: number;
  images?: string[];
}[];


  reviews?: Review[];

  fit?: string[];
  fabricCare?: string[];
  features?: string[];
};

export default function ProductDetailPage() {
  const params = useParams<{ id?: string }>();
  const id = params?.id;

const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
const [showAllReviews, setShowAllReviews] = useState(false);

  const { addToCart } = useCart();
  const router = useRouter();
const [showSizeChart, setShowSizeChart] = useState(false);


 const [product, setProduct] = useState<ProductWithReviews | null>(() => {
  if (id && productCache.has(id)) {
    return productCache.get(id)!;
  }
  return null;
});
const [showStickyVariantPicker, setShowStickyVariantPicker] = useState(false);

  const [similarProducts, setSimilarProducts] = useState<ProductType[]>([]);
  const [networkError, setNetworkError] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addingToBag, setAddingToBag] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const sizesRef = useRef<HTMLDivElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
 const variants = React.useMemo(
  () => product?.variants ?? [],
  [product]
);

  
  // Gallery modal state for Real Images fullscreen slider
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(true);
  const visibleSimilarProducts = similarProducts.slice(0, 8);
const infoRef = useRef<HTMLDivElement | null>(null);
const [showStickyDesktopBar, setShowStickyDesktopBar] = useState(false);
const [selectedVariant, setSelectedVariant] = useState<{
  id: string;
  size?: string | null;
  color?: string | null;
  price?: number;
  stock?: number;
  images?: string[];
} | null>(null);
// ✅ Effective price (variant overrides base)
const effectivePrice =
  selectedVariant?.price ?? product?.price ?? 0;


const [activeIndex, setActiveIndex] = useState(0);

const getColorHex = (name: string) =>
  COLOR_OPTIONS.find(c => c.name === name)?.hex ?? "#ccc";



useEffect(() => {
  if (!selectedColor || !variants.length) return;

  // If size already selected → match BOTH
  if (selectedSize) {
    const v = variants.find(
      v =>
        v.color === selectedColor &&
        v.size === selectedSize &&
        (v.stock ?? 0) > 0
    );
    if (v) {
      setSelectedVariant(v);
      return;
    }
  }

  // Otherwise fallback → first available variant of that color
  const fallback = variants.find(
    v => v.color === selectedColor && (v.stock ?? 0) > 0
  );
  if (fallback) {
    setSelectedVariant(fallback);
  }
}, [selectedColor, selectedSize, variants]);



useEffect(() => {
  if (product) {
    console.log("VIDEO URL 👉", product.video);
  }
}, [product]);


useEffect(() => {
  if (!product?.category) return;

  const loadSimilar = async () => {
    try {
      const res = await fetch(
        `/api/products?category=${encodeURIComponent(product.category)}&limit=8`
      );
      if (!res.ok) return;

      const data = await res.json();

      // ❗ exclude current product
      const filtered = data.products.filter(
        (p: ProductType) => p.id !== product.id
      );

      setSimilarProducts(filtered);
    } catch (err) {
      console.error("Failed to load similar products", err);
    }
  };

  loadSimilar();
}, [product]);

  // ---------------- FETCH PRODUCT ----------------

  // 🛑 Prevent scroll resetting when coming back
useEffect(() => {
  window.history.scrollRestoration = "manual";
}, []);
// Auto-select One Size if product has no sizes
useEffect(() => {
  if (product && (!product.sizes || product.sizes.length === 0)) {
    setSelectedSize("One Size");
  }
}, [product]);

useEffect(() => {
  window.scrollTo({ top: 0, behavior: "instant" });
}, [id]);
useEffect(() => {
  const handleScroll = () => {
    if (!infoRef.current) return;

    const rect = infoRef.current.getBoundingClientRect();

    // when product info scrolls out of view
    setShowStickyDesktopBar(rect.bottom < 0);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

useEffect(() => {
  if (selectedVariant) {
    setShowStickyVariantPicker(false);
  }
}, [selectedVariant]);



 useEffect(() => {
  if (!id) return;

  if (productCache.has(id)) {
    return; // already set from initial state
  }

  const load = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) return;

      const data = (await res.json()) as ProductWithReviews;

      const finalProduct = {
        ...data,
        reviews: Array.isArray(data.reviews) ? data.reviews : [],
        rating: data.rating ?? 0,
        reviewCount: data.reviewCount ?? 0,
      };

      productCache.set(id, finalProduct);
      setProduct(finalProduct);
    } catch (err) {
      console.error(err);
    }
  };

  load();
}, [id]);


  
useEffect(() => {
  if (!product) return;

  const saved = sessionStorage.getItem(`pdp-${product.id}`);
  if (!saved) return;

  try {
    const { color, size, variantId } = JSON.parse(saved);

    if (color) setSelectedColor(color);
    if (size) setSelectedSize(size);

    if (variantId) {
      const v = product.variants.find(v => v.id === variantId);
      if (v) setSelectedVariant(v);
    }
  } catch {}
}, [product]);




// ✅ useMemo MUST be here (before any return)
// ---------------- Derived / Safe data ----------------
const cleanImages = (arr?: string[]) =>
  (arr ?? []).filter(
    (img) => typeof img === "string" && img.trim().length > 0
  );
const imagesBySelectedColor = React.useMemo(() => {
  if (!selectedColor) return [];

  return variants
    .filter(v => v.color === selectedColor)
    .flatMap(v => v.images ?? []);
}, [selectedColor, variants]);

// ✅ MOVE THIS UP — BEFORE ANY RETURN
const galleryItems = React.useMemo<GalleryItem[]>(() => {
  if (!product) return [];

 const images =
  selectedVariant && cleanImages(selectedVariant.images).length > 0
    ? cleanImages(selectedVariant.images)
    : cleanImages(product.images);


  const items: GalleryItem[] = [];

  if (images.length > 0) {
    items.push({ type: "image", src: images[0] });
  }

  if (product.video && product.video.trim().length > 0) {
    items.push({ type: "video", src: product.video });
  }

  images.slice(1).forEach((img) => {
    items.push({ type: "image", src: img });
  });

  return items.length > 0
    ? items
    : [{ type: "image", src: "/placeholder.png" }];
}, [product, selectedVariant]);
const getVariantPriceBySize = (size: string) => {
  const v = variants.find(
    v =>
      v.size === size &&
      (!selectedColor || v.color === selectedColor)
  );

  return v?.price ?? null;
};


// ✅ NOW the early return is SAFE
if (!product) {
  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      <Header productName="" />

      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <LoadingRing />
      </div>
    </div>
  );
}



// ✅ Product-level out of stock (ALL variants = 0)
const isProductOutOfStock =
  variants.length > 0 &&
  variants.every(v => (v.stock ?? 0) <= 0);

// ✅ Selected variant out of stock
const isSelectedVariantOutOfStock =
  !!selectedVariant && (selectedVariant.stock ?? 0) <= 0;

// ✅ Final Add-to-Bag disable flag (Vuori logic)
const disableAddToBag =
  isProductOutOfStock || isSelectedVariantOutOfStock;





const isWishlisted = isInWishlist(product.id);


const price = effectivePrice;

  const mrp = product.mrp ?? null;
const discount =
  mrp && mrp > price
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;


  // Reviews safe
  const reviewsList: Review[] = Array.isArray(product.reviews) ? product.reviews : [];

  // Real images array (only images submitted by reviewers)
  const realImageEntries = reviewsList.flatMap((r) =>
    (r.images || []).map((img) => ({
      img,
      reviewId: r.id,
      reviewer:
        typeof r.user === "string"
          ? r.user
          : (r.user && (r.user as any).name) || r.userName || "BSCFashion User",
      createdAt: r.createdAt,
    }))
  );

  // Rating breakdown in 5 → 1 order (user requested 5 first)
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviewsList.filter((r) => Math.round(r.rating) === star).length;
    return { star, count };
  });

  const totalReviews = reviewsList.length;

  const ratingLabels: Record<number, string> = {
    5: "Excellent",
    4: "Very Good",
    3: "Good",
    2: "Average",
    1: "Poor",
  };

const handleWishlistClick = () => {
  const token = getCookie("token");

  if (!token) {
    router.push("/login?redirect=wishlist");
    return;
  }

  const wishlistImages =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : product.images;

  toggleWishlist({
    id: product.id,
    name: product.name,
    images: wishlistImages,
    price: effectivePrice,
  });

  toast.success(
    isWishlisted ? "Removed from wishlist" : "Added to wishlist"
  );
};
const isVariantSelectionInvalid = () => {
  // Product has variants but nothing selected
  if (variants.length > 0 && !selectedVariant) return true;

  // Product has sizes but size not selected
  if (product.sizes?.length > 0 && !selectedSize) return true;

  // Selected variant is out of stock
  if (selectedVariant && (selectedVariant.stock ?? 0) <= 0) return true;

  return false;
};

const handleAddToBagWithLoginCheck = () => {
  const token = getCookie("token");

  if (!token) {
    router.push("/login?redirect=bag");
    return;
  }

  handleAddToBag();
};

const handleAddToBagOnly = () => {
  const token = getCookie("token");
  if (!token) {
    router.push("/login?redirect=address");
    return;
  }

  handleAddToBag(); // existing logic already pushes to /bag
};

const handleBuyNow = () => {
  const token = getCookie("token");
  if (!token) {
    router.push("/login?redirect=address");
    return;
  }

  if (!selectedVariant) {
    toast.error("Please select variant");
    return;
  }

  const buyNowItem = {
    id: product.id,
    name: product.name,
    price: effectivePrice,
    quantity: 1,
    size: selectedSize,
    color: selectedColor,
    variantId: selectedVariant.id,
    images:
      selectedVariant.images?.length
        ? selectedVariant.images
        : product.images,
  };

  // ✅ TEMP STORAGE (IMPORTANT)
  sessionStorage.setItem("BUY_NOW_ITEM", JSON.stringify(buyNowItem));

  router.push("/checkout/address?mode=buynow");
};



const sizes = Array.from(
  new Set(variants.map(v => v.size).filter(Boolean))
) as string[];


  const colors = Array.from(
  new Set(
    variants
      .filter(v => (v.stock ?? 0) > 0)
      .map(v => v.color)
      .filter(Boolean)
  )
) as string[];


const getVariantBySize = (size: string) =>
  variants.find(
    v =>
      v.size === size &&
      (!selectedColor || v.color === selectedColor)
  ) ?? null;

const getVariant = (size: string, color: string | null) =>
  variants.find(
    v =>
      v.size === size &&
      (!color || v.color === color)
  ) ?? null;


const isSizeOutOfStock = (size: string) => {
  const v = getVariantBySize(size);
  return !v || (v.stock ?? 0) <= 0;
};

const getImagesForBag = () => {
  if (
    selectedVariant &&
    Array.isArray(selectedVariant.images) &&
    selectedVariant.images.length > 0
  ) {
    return selectedVariant.images; // ✅ variant images
  }

  return product.images; // ✅ fallback to main product images
};

const handleAddToBag = () => {
  if (!selectedVariant) {
    toast.error("Please select color");
    return;
  }

  if (product.sizes?.length > 0 && !selectedSize) {
    setSizeError(true);
    toast.error("Please select size");
    return;
  }

  if ((selectedVariant.stock ?? 0) <= 0) {
    toast.error("Selected variant is out of stock");
    return;
  }

  setAddingToBag(true);

  const finalImages =
    selectedVariant.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : product.images;

  addToCart(
    {
      id: product.id,
      name: product.name,
      mrp: product.mrp,
      price: effectivePrice,
      images: finalImages,
      availableSizes: product.sizes,
    },
    effectivePrice,
    selectedSize!,
    selectedColor,
    selectedVariant.id,
    finalImages,
    selectedVariant.stock
  );

  router.push("/bag");
};




  const openGalleryAt = (index: number) => {
    setGalleryStartIndex(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = "";
  };
console.log(product.fit, product.fabricCare, product.features);
// Detect kids category
const isKidsCategory =
  product.category?.toLowerCase().includes("kid");

// Full standard chart
const STANDARD_CHART = [
  { size: "XS", chest: 34, waist: 28, length: 26 },
  { size: "S", chest: 36, waist: 30, length: 27 },
  { size: "M", chest: 38, waist: 32, length: 28 },
  { size: "L", chest: 40, waist: 34, length: 29 },
  { size: "XL", chest: 42, waist: 36, length: 30 },
  { size: "XXL", chest: 44, waist: 38, length: 31 },
  { size: "FREE", chest: "Free", waist: "Free", length: "Free" },
  { size: "One Size", chest: "Free", waist: "Free", length: "Free" },
];

// Kids chart
const KIDS_CHART = [
  { size: "0-3M", chest: 16, waist: 15, length: 14 },
  { size: "3-6M", chest: 17, waist: 16, length: 15 },
  { size: "6-9M", chest: 18, waist: 17, length: 16 },
  { size: "9-12M", chest: 19, waist: 18, length: 17 },
  { size: "1-2Y", chest: 20, waist: 19, length: 18 },
  { size: "2-3Y", chest: 21, waist: 20, length: 19 },
  { size: "3-4Y", chest: 22, waist: 21, length: 20 },
];

// Select correct chart
const baseChart = isKidsCategory ? KIDS_CHART : STANDARD_CHART;

// 🔥 Show only sizes available in product
const sizeChartData = baseChart.filter(row =>
  sizes.includes(row.size)
);
  // ---------------- UI ----------------
  return (
  <div className="min-h-screen bg-white pt-20 md:pt-24">


   <Header productName={product.name} />
   

{showStickyDesktopBar && (
 <div
  className={`hidden md:flex fixed left-0 right-0 z-40
  top-[72px]
  backdrop-blur-md bg-white/90
  border-b border-black/10
  transition-all duration-300 ease-out
  ${showStickyDesktopBar
    ? "opacity-100 translate-y-0"
    : "opacity-0 -translate-y-4 pointer-events-none"}
  `}
>

    <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 py-3">

      {/* LEFT: IMAGE + INFO */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-14 relative rounded overflow-hidden border">
         <Image
  src={
    selectedVariant?.images?.[0] ||
    product.images?.[0] ||
    "/placeholder.png"
  }
  alt={product.name}
  fill
  className="object-cover"
/>

        </div>

        <div className="leading-tight">
          <p className="text-sm font-medium line-clamp-1">
            {product.name}
          </p>
          <p className="text-sm text-gray-700">
            Rs.{price}
          </p>
        </div>
      </div>

{showStickyVariantPicker && (
  <div className="flex items-center gap-4 mr-4">

    {/* COLOR */}
    {colors.length > 0 && (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Color</span>
        {colors.map(color => (
          <button
            key={color}
            onClick={() => {
              setSelectedColor(color);
              setSelectedSize(null);
              setSelectedVariant(null);
            }}
            className={`h-6 w-6 rounded-full border
              ${selectedColor === color ? "ring-2 ring-black" : ""}`}
            style={{ backgroundColor: getColorHex(color) }}
          />
        ))}
      </div>
    )}

    {/* SIZE */}
    {sizes.length > 0 && (
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">Size</span>
        {sizes.map(size => {
          const v = getVariantBySize(size);
          const disabled = !v || (v.stock ?? 0) <= 0;

          return (
            <button
              key={size}
              disabled={disabled}
              onClick={() => {
                setSelectedSize(size);
                setSelectedVariant(v);
              }}
              className={`px-2 py-1 text-xs border rounded
                ${selectedSize === size ? "border-black" : "border-gray-300"}
                ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {size}
            </button>
          );
        })}
      </div>
    )}
  </div>
)}

      {/* RIGHT: BUTTON */}
<button
  onClick={() => {
    if (isVariantSelectionInvalid()) {
      setShowStickyVariantPicker(true);
      return;
    }
    handleBuyNow();
  }}
  disabled={disableAddToBag}
  className="px-6 py-2 text-sm font-semibold rounded-md
             bg-gradient-to-r from-gray-800 to-black text-white"
>
  Buy Now
</button>



    </div>
  </div>
)}



   <div className="flex flex-col md:flex-row w-full mt-4">

        {/* Images */}
     <div className="w-full md:w-[67%] relative md:mx-0 overflow-hidden">



          

      {/* Mobile Swiper */}
<div className="relative md:hidden">
  <Swiper
     modules={[Zoom, Pagination]}
    zoom={{ maxRatio: 3 }}
    pagination={{ type: "progressbar" }}
    slidesPerView={1}
    className="bscfashion-swiper"
  >

  {galleryItems.map((item, idx) => (
    <SwiperSlide key={idx}>
      {item.type === "video" ? (
        <video
          src={item.src}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="w-full aspect-[3/4] object-cover"
        />
      ) : (
        
       <ZoomImage src={item.src} alt={product.name} />

      )}
    </SwiperSlide>
  ))}
</Swiper>

  <div className="mt-2 h-[px] w-full bg-black/20">
  <div
    className="h-full bg-black transition-all duration-300"
    style={{
      width: `${((activeIndex + 1) / galleryItems.length) * 100}%`,
    }}
  />
</div>


</div>





<div className="hidden md:grid grid-cols-2 gap-[2px]">
  {galleryItems.map((item, idx) =>
    item.type === "video" ? (
  <div key={idx} className="relative">
    <video
      src={item.src}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      className="w-full aspect-[3/4] object-cover"
    />

    {/* ▶ Video badge */}
    <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
      ▶ Video
    </div>
  </div>
) : (
  <ZoomImage key={idx} src={item.src} alt={product.name} />
)
  )}
</div>



        </div>

        {/* Information */}
        
   <div className="flex flex-col gap-4 w-full md:w-[33%] px-6">


          <div ref={infoRef}>
          <div className="flex justify-between items-center">
  <h1 className="text-lg font-light tracking-tight">
    {product.name}
  </h1>

  {/* ACTIONS */}
  <div className="flex items-center gap-4">
    {/* Wishlist */}
<button
  type="button"
  onClick={handleWishlistClick}
  className="p-1"
  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
>
  <Heart
    className={`h-5 w-5 transition duration-200 ${
      isWishlisted
        ? "text-black fill-black"
        : "text-gray-700"
    }`}
  />
</button>



    {/* Share */}
    <button
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: product.name,
            url: window.location.href,
          });
        } else {
          navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard");
        }
      }}
      className="p-1"
      aria-label="Share product"
    >
      <Share2 className="h-5 w-5 text-gray-700" />
    </button>
  </div>
</div>


            <div className="flex items-center gap-2 mt-1">
            {mrp && mrp > price ? (
  <span className="line-through text-gray-400 text-sm">
    Rs.{mrp}
  </span>
) : (
  <span className="text-green-600 text-xs font-semibold">
    Best Price
  </span>
)}
              <span className="text-gray-900">Rs.{price}</span>
              {discount > 0 && (
                <span className="text-gray-500 text-xs font-semibold">{discount}% off</span>
              )}
            </div>
          </div>


            <div className="flex items-center gap-2 mt-1">
  <p className="text-xs uppercase tracking-wide text-gray-500">
    {product.brandName ?? "BSCFASHION"}
  </p>

  {product.rating > 0 && (
    <div className="flex items-center gap-1 text-[12px] text-gray-500">
      
      <span className="font-medium text-gray-700">
        {product.rating.toFixed(1)}
      </span>
      <span className="leading-none">★</span>
      {product.reviewCount && (
        <span className="text-gray-400">
          ({product.reviewCount})
        </span>
      )}
    </div>
  )}
</div>

 <div className="flex items-center gap-1">
{colors.length > 0 && (
  <div className="mt-1">
    <p className="text-sm font-medium text-gray-700 mb-2">
      Color {selectedColor && `: ${selectedColor}`}
    </p>

    <div className="flex flex-wrap gap-2">
      {colors.map(color => (
        <button
          key={color}
          onClick={() => {
            setSelectedColor(color);
            setSelectedSize(null);
            setSelectedVariant(null);
          }}
          className={`
            h-8 w-8 rounded-full border
            flex items-center justify-center
            ${selectedColor === color
              ? "ring-2 ring-black"
              : "ring-1 ring-gray-300"}
          `}
          title={color}
        >
          <span
            className="h-6 w-6 rounded-full"
            style={{ backgroundColor: getColorHex(color) }}

          />
        </button>
      ))}
    </div>
  </div>
)}</div>


    <div
  ref={sizesRef}
  className={`${sizeError ? "ring-1 ring-red-400 rounded-md p-2" : ""}`}
>
<div className="flex items-center justify-between mb-2">
  <p className="text-gray-700 text-sm font-medium">Size</p>

  <button
    type="button"
    onClick={() => setShowSizeChart(true)}
    className="text-xs underline text-gray-600 hover:text-black"
  >
    Size Chart
  </button>
</div>
  {product.sizes && product.sizes.length > 0 ? (
    <div className="flex flex-wrap gap-2">
  {sizes.map((size) => {
    const variant = getVariantBySize(size);
    const outOfStock = !variant || (variant.stock ?? 0) <= 0;

    return (
   <button
  key={size}
  disabled={outOfStock}
  onClick={() => {
    if (outOfStock) return;

    setSelectedSize(size);
    setSelectedVariant(variant);
    setSizeError(false);
  }}
  className={`
    min-w-[56px] px-3 py-2
    flex flex-col items-center justify-center
    border transition
    ${
      selectedSize === size
        ? "border-gray-900 text-gray-900"
        : "border-gray-300 text-gray-600 hover:border-gray-500"
    }
    ${outOfStock ? "opacity-40 cursor-not-allowed line-through" : ""}
  `}
>
  <span className="text-sm font-medium">{size}</span>

  {/* ✅ Variant price under size */}
  {(() => {
    const vPrice = getVariantPriceBySize(size);

    if (!vPrice) return null;

    return (
      <span className="text-xs text-gray-500 mt-0.5">
        ₹{vPrice}
      </span>
    );
  })()}
</button>

    );
  })}
</div>

  ) : (
   <button
  onClick={() => {
    setSelectedSize("One Size");
    setSizeError(false);
  }}
  className={`
    min-w-[80px] h-10 px-4
    text-sm font-medium
    border transition
    ${
      selectedSize === "One Size"
        ? "border-gray-900 text-gray-900"
        : "border-gray-300 text-gray-600 hover:border-gray-500"
    }
  `}
>
  One Size
</button>

  )}

  {sizeError && (
    <p className="text-red-500 text-xs mt-1">Please select your size</p>
  )}
</div>


{/* ----------------- OUT OF STOCK UI ----------------- */}
<div className="hidden md:flex flex-col gap-3 mt-4">
{isProductOutOfStock ? (
  <button
    onClick={async () => {
      const token = getCookie("token");
      if (!token) {
        router.push("/login?redirect=product");
        return;
      }

      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("We will notify you when it's back in stock!");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    }}
    className="w-full py-3 mt-4 font-semibold bg-black text-white rounded-md"
  >
    🔔 Remind Me
  </button>
) : (
 <div className="flex flex-col gap-3 mt-4">
  {/* ADD TO BAG */}
  <button
    onClick={handleAddToBagOnly}
    disabled={disableAddToBag || addingToBag}
    className="w-full py-3 text-sm font-medium rounded-md border border-gray-900 text-gray-900 hover:bg-gray-50 transition"
  >
    <ShoppingBag className="inline w-5 h-5 mr-2 " />
     Add to Bag
  </button>

  {/* BUY NOW */}
  <button
    onClick={handleBuyNow}
    disabled={disableAddToBag || addingToBag}
    className="w-full py-3 text-sm font-semibold rounded-md bg-gradient-to-r from-gray-800 to-black text-white"
  >
     Buy Now
  </button>
</div>

)}

    
  
  
  
</div>
<div className=" divide-y">
  <ProductAccordion
    title="Product Description"
    content={product.description}
  />
  

  <ProductAccordion
    title="Fit"
    items={product.fit ?? []}
  />

  <ProductAccordion
    title="Fabric & Care"
    items={product.fabricCare ?? []}
  />

  <ProductAccordion
    title="Product Features"
    items={product.features ?? []}
  />
</div>



<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white flex gap-2 p-3 z-50">
  {isProductOutOfStock ? (
    <button
      onClick={async () => {
        const token = getCookie("token");
        if (!token) {
          router.push("/login?redirect=product");
          return;
        }

        await fetch("/api/reminders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });

        toast.success("We will notify you when it's back in stock!");
      }}
      className="w-full py-3 text-sm font-semibold bg-black text-white rounded-md"
    >
      🔔 Remind Me
    </button>
  ) : (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white flex gap-2 p-3 z-50">
  <button
    onClick={handleAddToBagOnly}
    disabled={disableAddToBag}
    className="w-1/2 py-3 text-sm font-medium border border-gray-900 rounded-md"
  >
    <ShoppingBag className="inline w-5 h-5 mr-2" />
     Add to Bag
  </button>

  <button
    onClick={handleBuyNow}
    disabled={disableAddToBag}
    className="w-1/2 py-3 text-white text-sm font-semibold rounded-md bg-gradient-to-r from-gray-800 to-black"
  >
   Buy Now
  </button>
</div>

    </>
  )}
</div>

</div>
</div>


      {/* Similar products */}
      {similarProducts.length > 0 && (
        <div className="mt-12 w-full px-2 sm:px-6 lg:px-12">

          <h2 className="text-lg font-medium mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-0.5 gap-y-6">
            {similarProducts.map((p) => (
            <ProductCard
  key={p.id}
  product={{
    ...p,
    brandName: p.brandName || "BSCFASHION",
  }}
/>

            ))}
          </div>
        </div>
      )}





      {/* Fullscreen gallery modal (Swiper) for real images */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" role="dialog" aria-modal="true">
          <button onClick={closeGallery} className="absolute top-4 right-4 z-50 text-white text-xl p-2" aria-label="Close gallery">
            ✕
          </button>

          <div className="w-full max-w-4xl h-[80vh]">
            <Swiper
              initialSlide={galleryStartIndex}
              spaceBetween={10}
              slidesPerView={1}
              modules={[Pagination, Navigation]}
              navigation
              pagination={{ clickable: true }}
            >
              {realImageEntries.map((entry, idx) => (
                <SwiperSlide key={`${entry.img}-${idx}`}>
                  <div className="w-full h-[80vh] flex items-center justify-center">
                    <img src={entry.img} alt={`photo-${idx}`} className="max-h-[80vh] object-contain" />
                  </div>
                  <div className="text-sm text-white/90 text-center mt-2">
                    {entry.reviewer} {entry.createdAt ? `• ${new Date(entry.createdAt).toLocaleDateString("en-IN")}` : ""}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
      {showSizeChart && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div className="bg-white w-[90%] max-w-md rounded-lg p-6 relative">
      
      <button
        onClick={() => setShowSizeChart(false)}
        className="absolute top-3 right-3 text-gray-500"
      >
        ✕
      </button>

      <h3 className="text-lg font-semibold mb-4">Size Chart</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Size</th>
              <th className="p-2 border">Chest (in)</th>
              <th className="p-2 border">Waist (in)</th>
              <th className="p-2 border">Length (in)</th>
            </tr>
          </thead>
        <tbody>
  {sizeChartData.map((row) => (
    <tr key={row.size}>
      <td className="p-2 border">{row.size}</td>
      <td className="p-2 border">{row.chest}</td>
      <td className="p-2 border">{row.waist}</td>
      <td className="p-2 border">{row.length}</td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Measurements may vary by 0.5–1 inch.
      </p>
    </div>
  </div>
)}
    </div>
  );
}
