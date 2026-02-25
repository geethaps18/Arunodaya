import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // -----------------------
    // Query Params
    // -----------------------
    let page = Number(url.searchParams.get("page") || 1);
    let limit = Number(url.searchParams.get("limit") || 20);
    const search = String(url.searchParams.get("search") || "").trim();
    const rawSiteId = url.searchParams.get("siteId");

    // Prevent "undefined" string issue
    const siteId =
      rawSiteId && rawSiteId !== "undefined" ? rawSiteId : undefined;

    // -----------------------
    // Sanitize pagination
    // -----------------------
    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(limit) || limit < 1) limit = 20;

    limit = Math.min(limit, 100);
    const skip = (page - 1) * limit;

    // -----------------------
    // WHERE filter
    // -----------------------
    const where: Prisma.ProductWhereInput = {
      ...(siteId ? { siteId } : {}),
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                category: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };

    // -----------------------
    // Fetch products
    // -----------------------
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        brand: {
          select: { name: true },
        },
        variants: {
          select: { stock: true },
        },
        _count: {
          select: { stockReminders: true },
        },
      },
    });

    const total = await prisma.product.count({ where });

    // -----------------------
    // Map result
    // -----------------------
    const mapped = products.map((p) => {
      const variantStock =
        p.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? 0;

      const finalStock =
        p.variants && p.variants.length > 0
          ? variantStock
          : p.stock ?? 0;

      return {
        id: p.id,
        name: p.name ?? "",
        brandName: p.brand?.name || p.brandName,
        category: p.category ?? "",
        price: p.price ?? 0,
        stock: finalStock,
        images: Array.isArray(p.images) ? p.images : [],
        status: p.status,
        siteId: p.siteId,
        createdAt: p.createdAt,
        reminderCount: p._count?.stockReminders ?? 0,
      };
    });

    return NextResponse.json({
      products: mapped,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("PRODUCT LIST ERROR:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}