"use client";

export function HeroBanner({ image, link, mobileOnly }: any) {
  const imageUrl =
    typeof image === "string"
      ? image
      : image?.url;

  if (!imageUrl) return null;

  return (
    <a href={link || "#"} className={mobileOnly ? "block lg:hidden" : ""}>
      <img
        src={imageUrl}
        alt="Hero Banner"
        className="w-full h-[420px] object-cover"
      />
    </a>
  );
}