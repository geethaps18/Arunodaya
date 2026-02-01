"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import { useMemo } from "react";

type Slide = {
  image: string;
  link?: string;
};

export default function Hero({ slides = [] }: { slides: Slide[] }) {
  const router = useRouter();

  // ✅ Hooks MUST be called unconditionally
  const settings = useMemo(
    () => ({
      dots: false,
      arrows: false,
      infinite: slides.length > 1,
      autoplay: slides.length > 1,
      autoplaySpeed: 4000,
      speed: 700,
      slidesToShow: 1,
      slidesToScroll: 1,
      pauseOnHover: false,
      cssEase: "ease-in-out",
    }),
    [slides.length]
  );

  // ✅ Early return AFTER hooks
  if (!slides || slides.length === 0) return null;

  return (
    <section className="w-full overflow-hidden">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => slide.link && router.push(slide.link)}
          >
            <Image
              src={slide.image}
              alt={`Hero Slide ${index + 1}`}
              width={1920}
              height={920}
              priority={index === 0}
              className="w-full h-[920px] object-cover"
            />
          </div>
        ))}
      </Slider>
    </section>
  );
}
