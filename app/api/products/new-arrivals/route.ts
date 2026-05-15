import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 10,

      include: {
        brand: {
          select: {
            id: true,
            name: true,
          },
        },

        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            stock: true,
            images: true,
          },
        },
      },
    });

    return NextResponse.json({
      products,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch new arrivals" },
      { status: 500 }
    );
  }
}