import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  let products: any[] = [];

  const formatProducts = (data: any[]) => {
    return data
      .map((p) => {
        // 🔥 Only variants that have stock AND valid color
        const validVariants = p.variants?.filter(
          (v: any) =>
            (v.stock ?? 0) > 0 &&
            v.color &&
            v.color.trim() !== ""
        );

        if (!validVariants || validVariants.length === 0) return null;

        // 🔥 Group ONLY by existing colors in THIS product
        const groupedMap: any = {};

        for (const v of validVariants) {
          const colorKey = v.color.trim().toLowerCase();

          if (!groupedMap[colorKey]) {
            groupedMap[colorKey] = {
              color: v.color.trim(), // original name
              images: v.images,
              sizes: [],
            };
          }

          // avoid duplicate sizes
          const exists = groupedMap[colorKey].sizes.find(
            (s: any) => s.size === v.size
          );

          if (!exists) {
            groupedMap[colorKey].sizes.push({
              id: v.id,
              size: v.size,
              stock: v.stock,
            });
          }
        }

        const grouped = Object.values(groupedMap);

        if (grouped.length === 0) return null;

        return {
          ...p,
          variants: grouped,
        };
      })
      .filter(Boolean);
  };

  // 🔥 LEGGINGS
  if (type === "legging" || type === "leggings") {
    const data = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: "ankle", mode: "insensitive" } },
          { name: { contains: "wrinkle", mode: "insensitive" } },
        ],
        price: 150,
      },
      include: { variants: true },
      
    });

    products = formatProducts(data);
  }

  // 🔥 KURTA
// 🔥 ARUNODAYA GOLD (instead of kurta)
if (type === "kurta") {
  const data = await prisma.product.findMany({
    where: {
      category: "women",
      subCategory: "ethnic-wear",

      // ✅ THIS IS IMPORTANT
      subSubCategory: {
        contains: "arunodaya",
        mode: "insensitive",
      },
    },
    include: { variants: true },
    
  });

  products = formatProducts(data);
}

  return NextResponse.json(products);
}