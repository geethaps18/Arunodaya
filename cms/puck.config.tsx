"use client";

import { Config } from "@measured/puck";
import SingleMediaField from "@/components/puck/SingleMediaField";

export const puckConfig: Config = {
  components: {
    HeroBanner: {
      label: "Hero Banner",

      fields: {
        title: { type: "text", label: "Title" },

        subtitle: { type: "text", label: "Subtitle" },

        // 🔥 UPDATED: Upload instead of text input
        image: {
          type: "custom",
          render: ({ value, onChange }) => (
            <SingleMediaField value={value} onChange={onChange} />
          ),
        },

        buttonText: { type: "text", label: "Button Text" },

        buttonLink: { type: "text", label: "Button Link" },
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

        // 🔥 support new media object
const imageUrl =
  typeof image === "object"
    ? image?.url
    : image || "";

        // 🔥 empty state inside CMS
        if (!imageUrl) {
          return (
            <div className="h-80 flex items-center justify-center text-gray-500">
              Upload Hero Image
            </div>
          );
        }

        return (
          <section className="relative w-full h-80 lg:h-screen overflow-hidden">
            
            {/* 🔥 Background Image */}
            <img
              src={imageUrl}
              alt={title || "Hero"}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* 🔥 Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* 🔥 Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-xl px-6 lg:px-20 text-white">
                
                {title && (
                  <h1 className="text-4xl lg:text-6xl font-bold">
                    {title}
                  </h1>
                )}

                {subtitle && (
                  <p className="mt-4 text-lg">
                    {subtitle}
                  </p>
                )}

                {buttonText && (
                  <a
                    href={buttonLink || "#"}
                    className="inline-block mt-6 bg-white text-black px-8 py-3 rounded hover:bg-gray-200"
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
  },
};