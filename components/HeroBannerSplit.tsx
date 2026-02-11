"use client";

export default function HeroBannerSplit({ banners }: { banners: any[] }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 w-full">
      {banners.map((banner, i) => (
        <div key={i} className="relative aspect-[1920/920]">
          <img
            src={banner.image}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 sm:px-10 text-white">
            <h1 className="text-2xl sm:text-4xl font-bold max-w-md">
              {banner.title}
            </h1>

            <p className="mt-3 text-sm sm:text-base max-w-md text-neutral-200">
              {banner.subtitle}
            </p>

            {banner.buttonText && (
              <a
                href={banner.buttonLink}
                className="mt-6 inline-flex px-6 py-3 bg-white text-black text-sm font-medium"
              >
                {banner.buttonText}
              </a>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
