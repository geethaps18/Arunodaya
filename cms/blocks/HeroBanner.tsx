"use client";

export function HeroBanner({ image, link, mobileOnly }: any) {
  if (!image) return null;

  return (
    <a href={link || "#"} className={mobileOnly ? "block lg:hidden" : ""}>
      <img
        src={image}
        alt="Hero Banner"
        className="w-full h-[420px] object-cover"
      />
    </a>
  );
}
