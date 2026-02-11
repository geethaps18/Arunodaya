"use client";

import Image from "next/image";
import Link from "next/link";
import { useInViewOnce } from "@/hook/useInViewOnce";

interface Props {
  name: string;
  image: string;
  href: string;
  index: number;
}

export default function AnimatedCategoryCard({
  name,
  image,
  href,
  index,
}: Props) {
  const { ref, visible } = useInViewOnce<HTMLDivElement>();

  return (
    <Link href={href}>
      <div
        ref={ref}
        className={`relative shrink-0 transition-all duration-700 ease-out will-change-transform
          ${
           visible
  ? "opacity-100 translate-x-0 scale-100"
  : "opacity-0 translate-x-6 scale-[0.97]"

          }
        `}
        style={{
          transitionDelay: `${index * 70}ms`,
        }}
      >
        <div className="w-[96px] h-[120px] relative rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />

          {/* Label */}
          <div className="absolute bottom-0 w-full bg-black/35 text-white text-center py-13 text-sm font-semibold">
            {name}
          </div>
        </div>
      </div>
    </Link>
  );
}
