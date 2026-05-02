import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // ✅ BASIC COUNTS (ONLY SIMPLE QUERIES HERE)
    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      deliveredOrders,
      wishlistCount,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count({
        where: { status: { in: ["Order Placed", "Confirmed"] } },
      }),
      prisma.order.count({
        where: { status: "Delivered" },
      }),
      prisma.wishlist.count(),
    ]);

    // ✅ FETCH PRODUCTS WITH VARIANTS
    const products = await prisma.product.findMany({
      include: { variants: true },
    });

    // ✅ CORRECT OUT OF STOCK LOGIC
    const outOfStockProducts = products.filter(
      (p) =>
        p.variants.length > 0 &&
        p.variants.every((v) => (v.stock ?? 0) <= 0)
    );

    const outOfStock = outOfStockProducts.length;

    // ✅ TODAY SALES
    const todaySalesAgg = await prisma.order.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { totalAmount: true },
    });

    // ✅ MONTHLY SALES
    const monthlyRevenueAgg = await prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth } },
      _sum: { totalAmount: true },
    });

    // ✅ TOP CATEGORY
    const topSelling = await prisma.orderItem.findMany({
      include: { product: true },
    });

    const categoryCount: Record<string, number> = {};

    topSelling.forEach((item) => {
      const category = item.product?.category || "Unknown";
      categoryCount[category] =
        (categoryCount[category] || 0) + (item.quantity || 0);
    });

    const topCategory =
      Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "N/A";

    // ✅ FINAL RESPONSE
    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      deliveredOrders,
      outOfStock,
      outOfStockProducts,
      todaySales: todaySalesAgg._sum.totalAmount || 0,
      monthlyRevenue: monthlyRevenueAgg._sum.totalAmount || 0,
      topCategory,
      wishlistCount,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}