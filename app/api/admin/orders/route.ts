import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: true,

        items: {
          select: {
            id: true,
            name: true,
            brandName: true,

            quantity: true,
            price: true,

            size: true,
            color: true,

            image: true,

            isFree: true,

            packed: true,
            packedAt: true,

            confirmedAt: true,

            exchangeRequested: true,
            exchangeStatus: true,

            newSize: true,
            newColor: true,

            product: {
              select: {
                images: true,

                isPlatform: true,
                sellerId: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,

      orders: orders.map((o) => ({
        ...o,

        // ✅ PICKUP SUPPORT
        deliveryType:
          o.deliveryType ?? "HOME",

        pickupStore:
          o.pickupStore ?? null,

        // ✅ ITEMS
        items: o.items.map((it) => ({
          ...it,

          isPlatform:
            it.product?.isPlatform ?? false,

          sellerId:
            it.product?.sellerId ?? null,

          isFree:
            it.isFree ?? false,

          image:
            it.image ||
            it.product?.images?.[0] ||
            null,
        })),

        // ✅ DATES
        createdAt:
          o.createdAt?.toISOString() ?? null,

        confirmedAt:
          o.confirmedAt?.toISOString() ?? null,

        shippedAt:
          o.shippedAt?.toISOString() ?? null,

        outForDeliveryAt:
          o.outForDeliveryAt?.toISOString() ?? null,

        deliveredAt:
          o.deliveredAt?.toISOString() ?? null,

        // ✅ ADDRESS PARSE
        address:
          o.address
            ? typeof o.address === "string"
              ? JSON.parse(o.address)
              : o.address
            : null,
      })),
    });
  } catch (error) {
    console.error(
      "ADMIN ORDERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: `${error}`,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { orderId, status } =
      await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        {
          success: false,
          error:
            "orderId and status are required",
        },
        {
          status: 400,
        }
      );
    }

    const timestampFields: any = {};

    if (status === "CONFIRMED") {
      timestampFields.confirmedAt =
        new Date();
    }

    if (status === "SHIPPED") {
      timestampFields.shippedAt =
        new Date();
    }

    if (status === "OUT_FOR_DELIVERY") {
      timestampFields.outForDeliveryAt =
        new Date();
    }

    if (status === "DELIVERED") {
      timestampFields.deliveredAt =
        new Date();
    }

    const updated =
      await prisma.order.update({
        where: {
          id: String(orderId),
        },

        data: {
          status,
          ...timestampFields,
        },

        include: {
          user: true,

          items: {
            select: {
              id: true,
              name: true,

              quantity: true,
              price: true,

              size: true,
              color: true,

              image: true,

              packed: true,
              packedAt: true,

              brandName: true,

              isFree: true,

              product: {
                select: {
                  images: true,
                },
              },
            },
          },
        },
      });

    return NextResponse.json({
      success: true,

      order: {
        ...updated,

        // ✅ PICKUP SUPPORT
        deliveryType:
          updated.deliveryType ?? "HOME",

        pickupStore:
          updated.pickupStore ?? null,

        // ✅ DATES
        createdAt:
          updated.createdAt?.toISOString() ??
          null,

        confirmedAt:
          updated.confirmedAt?.toISOString() ??
          null,

        shippedAt:
          updated.shippedAt?.toISOString() ??
          null,

        outForDeliveryAt:
          updated.outForDeliveryAt?.toISOString() ??
          null,

        deliveredAt:
          updated.deliveredAt?.toISOString() ??
          null,

        // ✅ ADDRESS PARSE
        address:
          updated.address
            ? typeof updated.address ===
              "string"
              ? JSON.parse(updated.address)
              : updated.address
            : null,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN ORDER UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: `${error}`,
      },
      {
        status: 500,
      }
    );
  }
}