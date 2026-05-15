import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // check order exists
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

    // delete all child order items first
    await prisma.orderItem.deleteMany({
      where: {
        orderId: id,
      },
    });

    // delete order
    await prisma.order.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}