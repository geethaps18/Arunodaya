import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (
      order.paymentMode !== "ONLINE" ||
      order.paymentStatus === "PAID"
    ) {
      return NextResponse.json(
        { error: "Cannot delete paid order" },
        { status: 400 }
      );
    }

    // delete child items first
    await prisma.orderItem.deleteMany({
      where: {
        orderId: id,
      },
    });

    // then delete order
    await prisma.order.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}