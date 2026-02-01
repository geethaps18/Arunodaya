import React from "react";
import { Config } from "@measured/puck";

export const puckConfig: Config = {
  components: {
    /* ================= HERO BANNER (SINGLE – FULL WIDTH) ================= */
    HeroBanner: {
      label: "Hero Banner (Single)",

      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "text", label: "Subtitle" },

        image: {
          type: "custom",
          label: "Banner Image",
          render: ({ value, onChange }: any) => (
            <div className="space-y-2">
              {value && (
                <img
                  src={value}
                  className="w-full h-40 object-cover rounded border"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("file", file);

                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });

                  const data = await res.json();
                  onChange(data.url);
                }}
              />
            </div>
          ),
        },

        buttonText: { type: "text", label: "Button Text" },
        buttonLink: { type: "text", label: "Button Link" },
      },

      render: ({ title, subtitle, image, buttonText, buttonLink }: any) => {
        if (!image) return null;

        return (
          <section className="w-full overflow-hidden">
            <div className="relative w-full aspect-[1920/920]">
              <img
                src={image}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 sm:px-10 text-white">
                <h1 className="text-2xl sm:text-4xl font-bold max-w-xl">
                  {title}
                </h1>

                <p className="mt-3 text-sm sm:text-base text-neutral-200 max-w-lg">
                  {subtitle}
                </p>

                {buttonText && (
                  <a
                    href={buttonLink}
                    className="mt-6 inline-flex w-fit px-6 py-3 bg-white text-black text-sm font-medium hover:bg-neutral-100 transition"
                  >
                    {buttonText}
                  </a>
                )}
              </div>
            </div>
          </section>
        );
      },
    },

    /* ================= HERO BANNER SPLIT (2-UP SIDE BY SIDE) ================= */
  HeroBannerSplit: {
  label: "Hero Banner Split (2 banners)",

  fields: {
    banners: {
      type: "array",
      label: "Banners",
      min: 2,
      max: 2,

      arrayFields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "text", label: "Subtitle" },

        image: {
          type: "custom",
          label: "Banner Image",
          render: ({ value, onChange }: any) => (
            <div className="space-y-2">
              {value && (
                <img
                  src={value}
                  className="w-full h-32 object-cover rounded border"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("file", file);

                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });

                  const data = await res.json();
                  onChange(data.url);
                }}
              />
            </div>
          ),
        },

        buttonText: { type: "text", label: "Button Text" },
        buttonLink: { type: "text", label: "Button Link" },
      },
    },
  },

  render: ({ banners }: any) => {
    if (!banners || banners.length !== 2) return null;

    return (
      <section className="w-full h-[920px] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {banners.map((banner: any, index: number) => (
          <div key={index} className="relative w-full h-full">
            <img
              src={banner.image}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 sm:px-10 text-white">
              <h2 className="text-2xl sm:text-4xl font-bold max-w-md">
                {banner.title}
              </h2>

              <p className="mt-3 text-sm sm:text-base text-neutral-200 max-w-md">
                {banner.subtitle}
              </p>

              {banner.buttonText && (
                <a
                  href={banner.buttonLink}
                  className="mt-6 inline-flex w-fit px-6 py-3 bg-white text-black text-sm font-medium hover:bg-neutral-100 transition"
                >
                  {banner.buttonText}
                </a>
              )}
            </div>
          </div>
        ))}
      </section>
    );
  },
},

  },
};
