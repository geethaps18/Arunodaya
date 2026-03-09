import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "itemId required" },
        { status: 400 }
      );
    }

    await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        exchangeStatus: "COMPLETED",
        exchangeRequested: false,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("EXCHANGE COMPLETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to complete exchange" },
      { status: 500 }
    );
  }
}