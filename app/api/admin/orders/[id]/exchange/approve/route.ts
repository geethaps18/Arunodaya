import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
    }

    await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        exchangeStatus: "APPROVED",
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("APPROVE EXCHANGE ERROR:", error);

    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}