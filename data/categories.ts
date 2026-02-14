// /data/categories.ts

export type SubCategory = {
  id: string;
  name: string;
  image: string;
  subCategories: SubCategory[];
};

let idCounter = 1;
function genId() {
  return (idCounter++).toString();
}

export const categories: SubCategory[] = [

  // ================= MEN =================
  {
    id: genId(),
    name: "Men",
    image: "/images/men.png",
    subCategories: [

      {
        id: genId(),
        name: "Top Wear",
        image: "/images/shirt.png",
        subCategories: [
          { id: genId(), name: "Casual Shirts", image: "/images/casual-shirt.png", subCategories: [] },
          { id: genId(), name: "Formal Shirts", image: "/images/formal-shirt.png", subCategories: [] },
          { id: genId(), name: "Party Wear Shirts", image: "/images/party-shirt.png", subCategories: [] },
          { id: genId(), name: "T-Shirts", image: "/images/tshirt.png", subCategories: [] },
          { id: genId(), name: "Jackets", image: "/images/jackets-men.png", subCategories: [] },
        ],
      },

      {
        id: genId(),
        name: "Bottom Wear",
        image: "/images/jeans.png",
        subCategories: [
          { id: genId(), name: "Formal Pants", image: "/images/formal-trouser.png", subCategories: [] },
          { id: genId(), name: "Jeans", image: "/images/jeans.png", subCategories: [] },
          { id: genId(), name: "Cargo Pants", image: "/images/cargo-pant.png", subCategories: [] },
          { id: genId(), name: "Baggy Jeans", image: "/images/baggy.png", subCategories: [] },
        ],
      },

      {
        id: genId(),
        name: "Ethnic Wear",
        image: "/images/kurtha-men.png",
        subCategories: [
          { id: genId(), name: "Kurta Sets", image: "/images/pyjama-set.png", subCategories: [] },
        ],
      },

      {
        id: genId(),
        name: "Blazers & Suits",
        image: "/images/blazer.png",
        subCategories: [
          { id: genId(), name: "Blazer Sets", image: "/images/blazer.png", subCategories: [] },
        ],
      },
    ],
  },

  // ================= WOMEN =================
  {
    id: genId(),
    name: "Women",
    image: "/images/women.png",
    subCategories: [

      // ---------- ETHNIC WEAR ----------
      {
        id: genId(),
        name: "Ethnic Wear",
        image: "/images/kurti.png",
        subCategories: [

          {
            
            id: genId(),
            name: "Kurtas",
            image: "/images/kurta.png",
            subCategories: [
              { id: genId(), name: "Regular Kurta", image: "/images/regular-kurta.png", subCategories: [] },
              { id: genId(), name: "Silk Kurta", image: "/images/silk-kurta.png", subCategories: [] },
            ],
          },

          {
            id: genId(),
            name: "Kurta Sets",
            image: "/images/kurtaset-women.png",
            subCategories: [
              { id: genId(), name: "Cotton Sets", image: "/images/cotton-set.png", subCategories: [] },
              { id: genId(), name: "Coard Sets", image: "/images/coard-set.png", subCategories: [] },
              { id: genId(), name: "Patiyala Sets", image: "/images/patiyala-set.png", subCategories: [] },
              { id: genId(), name: "Sharara Sets", image: "/images/sharara-set.png", subCategories: [] },
              { id: genId(), name: "Premium Sets", image: "/images/premium-set.png", subCategories: [] },
              { id: genId(), name: "Full Sets", image: "/images/full-set.png", subCategories: [] },
              { id: genId(), name: "Grand Sets", image: "/images/grand-set.png", subCategories: [] },
              { id: genId(), name: "Grand Umbrella Sets", image: "/images/umbrella-set.png", subCategories: [] },
              { id: genId(), name: "Premium Umbrella Sets", image: "/images/premium-umbrella-set.png", subCategories: [] },
            ],
          },

          { id: genId(), name: "Dupatta", image: "/images/duppata-set.png", subCategories: [] },
          { id: genId(), name: "Palazzo", image: "/images/palazzo.png", subCategories: [] },
          { id: genId(), name: "Arunodaya Gold", image: "/images/arunodaya-gold.png", subCategories: [] },
        ],
      },

      // ---------- WESTERN WEAR ----------
      {
        id: genId(),
        name: "Western Wear",
        image: "/images/dress.png",
        subCategories: [

          { id: genId(), name: "Western Sets", image: "/images/western-set.png", subCategories: [] },
          { id: genId(), name: "Crop Top Sets", image: "/images/crop-top.png", subCategories: [] },

          {
            id: genId(),
            name: "Tops",
            image: "/images/top.png",
            subCategories: [
              { id: genId(), name: "Jeans Tops", image: "/images/jeans-top.png", subCategories: [] },
              { id: genId(), name: "Embroidery Tops", image: "/images/embroidery-top.png", subCategories: [] },
            ],
          },

          { id: genId(), name: "Skirts", image: "/images/skirt.png", subCategories: [] },
          { id: genId(), name: "Shrugs", image: "/images/shrug.png", subCategories: [] },
          { id: genId(), name: "Leggings", image: "/images/leggings.png", subCategories: [] },
          { id: genId(), name: "Jeans", image: "/images/women-jeans.png", subCategories: [] },
          { id: genId(), name: "Jeans Jacket", image: "/images/jeans-jacket.png", subCategories: [] },
        ],
      },

      // ---------- NIGHT WEAR ----------
      {
        id: genId(),
        name: "Night Wear",
        image: "/images/nightgirl.png",
        subCategories: [
          { id: genId(), name: "Nighty", image: "/images/nighty.png", subCategories: [] },
          { id: genId(), name: "Branded Nighty", image: "/images/branded-nighty.png", subCategories: [] },
          { id: genId(), name: "Night Wear Sets", image: "/images/night-set.png", subCategories: [] },
        ],
      },

      // ---------- BOTTOM WEAR ----------
      {
        id: genId(),
        name: "Bottom Wear",
        image: "/images/leggings.png",
        subCategories: [
          { id: genId(), name: "Leggings", image: "/images/leggings.png", subCategories: [] },
          { id: genId(), name: "Women’s Jeans", image: "/images/women-jeans.png", subCategories: [] },
        ],
      },
    ],
  },

  // ================= KIDS =================
  {
    id: genId(),
    name: "Kids",
    image: "/images/kids.png",
    subCategories: [

      {
        id: genId(),
        name: "Boys",
        image: "/images/boys.png",
        subCategories: [
          { id: genId(), name: "Casual Shirts", image: "/images/shirt-boys.png", subCategories: [] },
          { id: genId(), name: "Boys Jeans", image: "/images/jeans-boy.png", subCategories: [] },
          { id: genId(), name: "Blazer Sets", image: "/images/blazer-boys.png", subCategories: [] },
          { id: genId(), name: "Kurta Sets Boys", image: "/images/kurta-set-boys.png", subCategories: [] },
        ],
      },

      {
        id: genId(),
        name: "Girls",
        image: "/images/girls.png",
        subCategories: [
          { id: genId(), name: "Kids Gown", image: "/images/girls-gown.png", subCategories: [] },
          { id: genId(), name: "Kids Sharara Sets", image: "/images/girls-sharara.png", subCategories: [] },
          { id: genId(), name: "Kids Girls Jeans", image: "/images/girl-jean.png", subCategories: [] },
        ],
      },

    
    ],
  },

];
