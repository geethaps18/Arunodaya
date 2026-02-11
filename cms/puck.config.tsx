"use client";

import { Config } from "@measured/puck";

export const puckConfig: Config = {
  components: {
    HeroBanner: {
      label: "Hero Banner",

      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "text", label: "Subtitle" },
        image: { type: "text", label: "Image URL" },
        buttonText: { type: "text", label: "Button Text" },
        buttonLink: { type: "text", label: "Button Link" },
      },

      render: (props) => {
        if (!props) return null;
        const { title, subtitle, image, buttonText, buttonLink } = props as any;
        if (!image) return null;

        return (
          <section className="relative w-full h-80 lg:h-screen">
            <img
              src={image}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-xl px-6 lg:px-20 text-white">
                <h1 className="text-4xl lg:text-6xl font-bold">{title}</h1>
                <p className="mt-4">{subtitle}</p>

                {buttonText && (
                  <a
                    href={buttonLink}
                    className="inline-block  mt-6 bg-white text-black px-8 py-3"
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
