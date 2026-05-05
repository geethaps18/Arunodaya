import { prisma } from "@/lib/db";
import { sendOrderNotification } from "@/utils/notify";

// DB → Notification mapping
const DB_TO_NOTIFICATION: Record<string, any> = {
  PENDING: "ordered",
  CONFIRMED: "packed",
  SHIPPED: "shipped",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
};

// DB → Timestamp field mapping
const TIMESTAMP_FIELDS: Record<string, string | null> = {
  PENDING: null,
  CONFIRMED: "confirmedAt",
  SHIPPED: "shippedAt",
  OUT_FOR_DELIVERY: "outForDeliveryAt",
  DELIVERED: "deliveredAt",
};

export async function updateOrderStatus(orderId: string, newDbStatus: string) {
  try {
    // 1) Fetch order (before update for existence)
    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: true },
    });

    if (!existing) throw new Error("Order not found");

    // 2) Decide timestamp field
    const timestampField = TIMESTAMP_FIELDS[newDbStatus];

    const dataToUpdate: any = {
      status: newDbStatus,
      updatedAt: new Date(),
    };

    if (timestampField) {
      dataToUpdate[timestampField] = new Date();
    }

    // 3) Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: dataToUpdate,
      include: { user: true, items: true },
    });

    // 4) Parse address safely (string | object)
    let parsedAddress: any = null;
    try {
      parsedAddress =
        typeof updatedOrder.address === "string"
          ? JSON.parse(updatedOrder.address)
          : updatedOrder.address;
    } catch {
      parsedAddress = null;
    }

    // 5) Map items (include color + isFree for better emails)
    const mappedItems = updatedOrder.items.map((item: any) => ({
      name: item.name,
      qty: item.quantity,
      price: item.price,
      size: item.size ?? undefined,
      color: item.color ?? undefined,
      image: item.image ?? undefined,
      isFree: item.isFree ?? false,
    }));

    // 6) Normalize phone
    let phone = parsedAddress?.phone || updatedOrder.user?.phone || "0000000000";
    phone = String(phone).replace(/\D/g, "");
    if (!phone.startsWith("+")) phone = "+91" + phone;

    // 7) Resolve email (ADDRESS EMAIL FIRST — as you want)
    const addressEmail =
      typeof parsedAddress?.email === "string" &&
      parsedAddress.email.includes("@")
        ? parsedAddress.email.trim()
        : null;

    const userEmail =
      typeof updatedOrder.user?.email === "string" &&
      updatedOrder.user.email.includes("@")
        ? updatedOrder.user.email.trim()
        : null;

    const finalAddressEmail = addressEmail || null; // strict: address only
    // (optional fallback) const finalAddressEmail = addressEmail || userEmail;

    // 8) Send notification (email + WhatsApp handled inside)
    if (!DB_TO_NOTIFICATION[newDbStatus]) {
      console.warn("⚠️ Unknown status mapping:", newDbStatus);
    }

    await sendOrderNotification({
      email: userEmail ?? undefined,              // keep for name fallback
      addressEmail: finalAddressEmail ?? undefined, // 🔥 IMPORTANT
      phone,
      customerName: updatedOrder.user?.name ?? "Customer",
      addressName: parsedAddress?.name,
      orderId: updatedOrder.id,
      items: mappedItems,
      total: updatedOrder.totalAmount,
      paymentMode: updatedOrder.paymentMode,
      status: DB_TO_NOTIFICATION[newDbStatus] ?? "ordered",
    });

    return {
      success: true,
      order: updatedOrder,
    };
  } catch (err) {
    console.error("❌ Order Update Error:", err);
    throw err;
  }
}