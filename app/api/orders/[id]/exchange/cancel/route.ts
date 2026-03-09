import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded.userId;   // ✅ CORRECT
  } catch {
    return null;
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: orderId } = await params;
    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
    }

    // ✅ Make sure order belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Only allow cancel if still pending
    const item = await prisma.orderItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.exchangeStatus !== "PENDING") {
      return NextResponse.json(
        { error: "Cannot cancel exchange" },
        { status: 400 }
      );
    }

    await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        exchangeRequested: false,
        exchangeStatus: null,
        newSize: null,
        newColor: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CANCEL EXCHANGE ERROR:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}