import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOwnerId } from "@/utils/getOwnerId";

export async function PUT(req: Request) {
  try {
    /* ---------------- AUTH ---------------- */
    const ownerId = await getOwnerId();

    if (!ownerId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ---------------- BODY ---------------- */
    const body = await req.json();
    const { orderItemId } = body;

    if (!orderItemId) {
      return NextResponse.json(
        { error: "orderItemId is required" },
        { status: 400 }
      );
    }

    /* ---------------- FETCH ITEM ---------------- */
    const item = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        product: {
          include: {
            site: true,
          },
        },
      },
    });

    if (!item || !item.product?.site) {
      return NextResponse.json(
        { error: "Order item not found" },
        { status: 404 }
      );
    }

    /* ---------------- OWNER CHECK ---------------- */
    if (item.product.site.ownerId !== ownerId) {
      return NextResponse.json(
        { error: "Not allowed" },
        { status: 403 }
      );
    }

    /* ---------------- ALREADY PACKED CHECK ---------------- */
    if (item.packedAt) {
      return NextResponse.json(
        { error: "Order already packed" },
        { status: 400 }
      );
    }

    /* ---------------- UPDATE ---------------- */
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        packedAt: new Date(), // ✅ enough (no need packed: true)
      },
    });

    /* ---------------- RESPONSE ---------------- */
    return NextResponse.json({
      success: true,
      message: "Order marked as packed",
    });

  } catch (err: any) {
    console.error("🔥 SELLER PACK ERROR:", err);

    return NextResponse.json(
      {
        error: "Failed to mark order as packed",
        details: err.message,
      },
      { status: 500 }
    );
  }
}