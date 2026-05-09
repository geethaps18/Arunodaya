import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET!
      )
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const body = JSON.parse(rawBody);

    const event = body.event;

    // ✅ PAYMENT SUCCESS
    if (event === "payment.captured") {
      const payment = body.payload.payment.entity;

      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      const order = await prisma.order.findFirst({
        where: {
          razorpayOrderId,
        },
      });

      if (!order) {
        console.error(
          "Webhook order not found:",
          razorpayOrderId
        );

        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      await prisma.order.update({
        where: {
          id: order.id,
        },

        data: {
          paymentStatus: "PAID",
          paymentMode: "ONLINE",
          status: "PENDING",
        },
      });

      console.log(
        "✅ Webhook payment verified:",
        order.id
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error("🔥 WEBHOOK ERROR:", err);

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}