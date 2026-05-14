import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    /* ---------------- BASIC COUNTS ---------------- */

    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      wishlistCount,
      products,
      allOrders,
    ] = await Promise.all([
      prisma.order.count(),

      prisma.product.count(),

      prisma.user.count(),

      prisma.wishlist.count(),

      prisma.product.findMany({
        include: {
          variants: true,
        },
      }),

      prisma.order.findMany({
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
    ]);

    /* ---------------- PENDING / DELIVERED ---------------- */

    const pendingOrders = allOrders.filter(
      (o) =>
        o.status === "PENDING" ||
        o.status === "CONFIRMED"
    ).length;

    const deliveredOrders = allOrders.filter(
      (o) => o.status === "DELIVERED"
    ).length;

    /* ---------------- REAL REVENUE LOGIC ---------------- */

    const paidOrders = allOrders.filter(
      (o) =>
        (
          o.paymentMode === "ONLINE" &&
          o.paymentStatus === "PAID"
        ) ||
        (
          o.paymentMode === "COD" &&
          o.status === "DELIVERED"
        )
    );

    /* ---------------- TODAY SALES ---------------- */

    const todaySales = paidOrders
      .filter((o) => {
        const d = new Date(o.createdAt);

        return (
          d >= today
        );
      })
      .reduce(
        (sum, o) =>
          sum + (o.totalAmount || 0),
        0
      );

    /* ---------------- MONTHLY REVENUE ---------------- */

    const monthlyRevenue = paidOrders
      .filter((o) => {
        const d = new Date(o.createdAt);

        return (
          d >= startOfMonth
        );
      })
      .reduce(
        (sum, o) =>
          sum + (o.totalAmount || 0),
        0
      );

    /* ---------------- OUT OF STOCK ---------------- */

    const outOfStockProducts =
      products.filter(
        (p) =>
          p.variants.length > 0 &&
          p.variants.every(
            (v) =>
              (v.stock ?? 0) <= 0
          )
      );

    const outOfStock =
      outOfStockProducts.length;

    /* ---------------- TOP CATEGORY ---------------- */

    const categoryCount: Record<
      string,
      number
    > = {};

    allOrders.forEach((order) => {
      order.items.forEach((item) => {
        const category =
          item.product?.category ||
          "Unknown";

        categoryCount[category] =
          (categoryCount[category] || 0) +
          (item.quantity || 0);
      });
    });

    const topCategory =
      Object.entries(categoryCount).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] || "N/A";

    /* ---------------- RESPONSE ---------------- */

    return NextResponse.json({
      totalOrders,

      totalProducts,

      totalCustomers,

      pendingOrders,

      deliveredOrders,

      outOfStock,

      outOfStockProducts,

      todaySales,

      monthlyRevenue,

      topCategory,

      wishlistCount,
    });
  } catch (error) {
    console.error(
      "DASHBOARD ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}