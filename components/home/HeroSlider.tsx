"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function HeroSlider({ slides }: { slides: any[] }) {
  if (!slides?.length) return null;

  return (
    <Swiper
      modules={[Pagination, Autoplay, Navigation]}
      pagination={{ clickable: true }}
      navigation
      autoplay={{ delay: 3000 }}
      loop
      className="w-full h-[500px]"
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div
            className="h-[500px] flex items-center bg-cover bg-center px-12"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="bg-black/40 p-8 rounded text-white max-w-md">
              <h1 className="text-3xl font-bold">{slide.title}</h1>
              <p className="mt-2">{slide.subtitle}</p>
              {slide.buttonText && (
                <a
                  href={slide.buttonLink}
                  className="inline-block mt-4 bg-white text-black px-6 py-2 rounded"
                >
                  {slide.buttonText}
                </a>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
