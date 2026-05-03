// /data/categories.ts

export type SubCategory = {
  id: string;
  name: string;
  image: string;
  slug?: string; // ✅ ADD THIS
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
    { id: genId(), name: "Blazers", image: "/images/blazer.png", subCategories: [] }, // ✅ ADD THIS
    { id: genId(), name: "Blazer Sets", image: "/images/blazer.png", subCategories: [] },
  ],
}
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
              { id: genId(), name: "Short Umbrella", image: "/images/umbrella.png", subCategories: [] },
              { id: genId(), name: "Regular Kurta", image: "/images/regular-kurta.png", subCategories: [] },
              { id: genId(), name: "Silk Kurta", image: "/images/silk-kurta.png", subCategories: [] },
              { id: genId(), name: "Arthapoorna Tops", image: "/images/kurta.png", subCategories: [] },
            ],
          },

          {
            id: genId(),
            name: "Kurta Sets",
            image: "/images/kurtaset-women.png",
            subCategories: [
              { id: genId(), name: "Cotton Sets", image: "/images/cotton-set.png", subCategories: [] },
              { id: genId(), name: "Arunodaya Sets", image: "/images/arunodaya-sets.png", subCategories: [] },
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
         
          { id: genId(), name: "Arunodaya Gold", image: "/images/arunodaya-gold.png", subCategories: [] },
       {
  id: genId(),
  name: "1 Minute Saree",
  image: "/images/one-minute-saree.png",
  slug: "one-minute-saree", // ✅ IMPORTANT
  subCategories: [],
},
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
          { id: genId(), name: "Formal Shirt", image: "/images/women-formal-shirt.png", subCategories: [] },
          { id: genId(), name: "Casual Shirt", image: "/images/women-casual-shirt.png", subCategories: [] },
          {
            id: genId(),
            name: "Tops",
            image: "/images/top.png",
            subCategories: [
              { id: genId(), name: "Silk Tops", image: "/images/top.png", subCategories: [] },
               { id: genId(), name: "Woodies", image: "/images/women-woodies.png", subCategories: [] },
                { id: genId(), name: "Corean T-shirt", image: "/images/corean-top.png", subCategories: [] },
              { id: genId(), name: "T-Shirts", image: "/images/w-tshirt.png", subCategories: [] },
               { id: genId(), name: "Western Top", image: "/images/western-top.png", subCategories: [] },
               { id: genId(), name: "Short Kurta", image: "/images/short-kurtha.png", subCategories: [] },
              { id: genId(), name: "Jeans Tops", image: "/images/w-jeans-top.png", subCategories: [] },
              { id: genId(), name: "Embroidery Tops", image: "/images/embroidery-top.png", subCategories: [] },
            ],
          },

          { id: genId(), name: "Skirts", image: "/images/skirt.png", subCategories: [] },
          { id: genId(), name: "Shrugs", image: "/images/shrug.png", subCategories: [] },
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

    {
      id: genId(),
      name: "Leggings",
      image: "/images/leggings.png",
      subCategories: [
        {
          id: genId(),
          name: "Ankle Leggings",
          image: "/images/ankle-leggings.png",
          subCategories: [],
        },
        {
          id: genId(),
          name: "Wrinkle Leggings",
          image: "/images/wrinkle-leggings.png",
          subCategories: [],
        },
        {
          id: genId(),
          name: "Branded Leggings",
          image: "/images/branded-leggings.png",
          subCategories: [],
        },
      ],
    },

    {
      id: genId(),
      name: "Women’s Jeans",
      image: "/images/women-jeans.png",
      subCategories: [],
    },

    {
      id: genId(),
      name: "Straight Pant", // ✅ NEW
      image: "/images/straight-pant.png",
      subCategories: [],
    },

    {
      id: genId(),
      name: "Palazzo", // ✅ MOVED HERE
      image: "/images/palazzo.png",
      subCategories: [],
    },

  ],
},
      {
  id: genId(),
  name: "Inners Wear",
  image: "/images/inner.png",
  subCategories: []
}
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
        { id: genId(), name: "Boys T-Shirts", image: "/images/boys-tshirt.png", subCategories: [] },
        { id: genId(), name: "Boys Casual Shirts", image: "/images/shirt-boys.png", subCategories: [] },
        { id: genId(), name: "Boys Jeans", image: "/images/jeans-boy.png", subCategories: [] },
        { id: genId(), name: "Boys Night Pants", image: "/images/boys-nightpants.png", subCategories: [] },
        { id: genId(), name: "Boys Shorts", image: "/images/boys-shorts.png", subCategories: [] },
        { id: genId(), name: "Boys Formal Pants", image: "/images/formal-trouser.png", subCategories: [] },
        { id: genId(), name: "Boys Suits", image: "/images/boys-suits.png", subCategories: [] },
       
      ],
    },

    {
      id: genId(),
      name: "Girls",
      image: "/images/girls.png",
      subCategories: [
        { id: genId(), name: "Kids Gown", image: "/images/girls-gown.png", subCategories: [] },
        { id: genId(), name: "Kids Sharara Sets", image: "/images/girls-sharara.png", subCategories: [] },
        { id: genId(), name: "Frocks", image: "/images/frock.png", subCategories: [] },
        { id: genId(), name: "Kids T-Shirts", image: "/images/tshirt.png", subCategories: [] },
        { id: genId(), name: "Kids Jeans Set", image: "/images/jeans-boy.png", subCategories: [] },
        { id: genId(), name: "Night Dress", image: "/images/nighty.png", subCategories: [] },
        { id: genId(), name: "Western Wear", image: "/images/western.png", subCategories: [] },
        { id: genId(), name: "Mom's Care", image: "/images/mom.png", subCategories: [] },
      ],
    },

  ],
}
];
