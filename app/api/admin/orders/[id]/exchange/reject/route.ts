import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db"; 
export async function PUT(req: NextRequest) {
  const { itemId } = await req.json();

  await prisma.orderItem.update({
    where: { id: itemId },
    data: {
      exchangeStatus: "REJECTED",
      exchangeRequested: false,
    },
  });

  return NextResponse.json({ success: true });
}