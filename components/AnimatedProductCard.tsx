"use client";

import ProductCard from "@/components/ProductCard";
import { useInViewOnce } from "@/hook/useInViewOnce";

interface Props {
  product: any;
  index: number;
}

export default function AnimatedProductCard({ product, index }: Props) {
  const { ref, visible } = useInViewOnce<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform
        ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-[0.97]"
        }
      `}
      style={{
        transitionDelay: `${index * 60}ms`,
      }}
    >
      <ProductCard product={product} />
    </div>
  );
}
