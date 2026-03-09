import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    const { itemId, newSize, newColor } = await req.json();

    if (!itemId || !newSize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update order item with exchange request
    await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        exchangeRequested: true,
        exchangeStatus: "PENDING",
        newSize,
        newColor,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Exchange error:", error);

    return NextResponse.json(
      { error: "Failed to request exchange" },
      { status: 500 }
    );
  }
}