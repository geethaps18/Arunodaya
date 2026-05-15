"use client";

import { Config } from "@measured/puck";
import SingleMediaField from "@/components/puck/SingleMediaField";

export const puckConfig: Config = {
  components: {
    HeroBanner: {
      label: "Premium Hero Banner",

      fields: {
        title: {
          type: "text",
          label: "Title",
        },

        subtitle: {
          type: "text",
          label: "Subtitle",
        },

        image: {
          type: "custom",
          render: ({ value, onChange }) => (
            <SingleMediaField
              value={value}
              onChange={onChange}
            />
          ),
        },

        buttonText: {
          type: "text",
          label: "Button Text",
        },

        buttonLink: {
          type: "text",
          label: "Button Link",
        },
      },

      render: (props) => {
        if (!props) return null;

        const {
          title,
          subtitle,
          image,
          buttonText,
          buttonLink,
        } = props as any;

        const imageUrl =
          typeof image === "object"
            ? image?.url
            : image || "";

        if (!imageUrl) {
          return (
            <div className="h-[70vh] flex items-center justify-center bg-neutral-100 text-gray-400 text-lg">
              Upload Premium Hero Banner
            </div>
          );
        }

        return (
          <section className="relative w-full h-[40vh] sm:h-[85vh] lg:h-screen overflow-hidden group">

            {/* Background Image */}
            <img
              src={imageUrl}
              alt={title || "Hero Banner"}
              className="
                absolute
                inset-0
                 w-screen
                h-full
               object-cover object-[center_top]
                scale-100
                group-hover:scale-105
                transition-transform
                duration-[5000ms]
                ease-out
              "
            />

            {/* Premium Luxury Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />

            {/* Extra Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Decorative Glow */}
            <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full" />

            {/* Content */}
            <div className="relative z-20 h-full flex items-center">

              <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-20">

                <div className="max-w-[95%] sm:max-w-2xl">

                  {/* Subtitle */}
                  {subtitle && (
                    <p
                      className="
                        uppercase
                        tracking-[0.35em]
                        text-[10px]
                        sm:text-xs
                        md:text-sm
                        text-white/80
                        mb-4
                        font-medium
                      "
                    >
                      {subtitle}
                    </p>
                  )}

                  {/* Title */}
                  {title && (
                    <h1
                      className="
                        text-[34px]
                        leading-[1.05]
                        sm:text-5xl
                        md:text-6xl
                        lg:text-7xl
                        xl:text-8xl
                        font-light
                        tracking-[0.06em]
                        text-white
                        font-[var(--font-newsreader)]
                        drop-shadow-2xl
                      "
                    >
                      {title}
                    </h1>
                  )}

                  {/* Luxury Divider */}
                  <div className="mt-6 w-20 h-[1px] bg-white/60" />

                  {/* CTA */}
                  {buttonText && (
                    <div className="mt-8 sm:mt-10">
                      <a
                        href={buttonLink || "#"}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          px-7
                          sm:px-9
                          py-3
                          sm:py-4
                          rounded-full
                          bg-white/95
                          backdrop-blur-md
                          text-black
                          text-[11px]
                          sm:text-xs
                          uppercase
                          tracking-[0.25em]
                          font-semibold
                          border
                          border-white/50
                          shadow-[0_8px_30px_rgba(255,255,255,0.15)]
                          hover:bg-black
                          hover:text-white
                          hover:border-white
                          hover:scale-105
                          transition-all
                          duration-300
                        "
                      >
                        {buttonText}
                      </a>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/30 to-transparent" />

          </section>
        );
      },
    },
  },
};