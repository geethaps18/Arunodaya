// app/api/create-order/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { offers } from "@/data/offers";
import {
  getShippingCharge,
  isCODAvailable,
} from "@/utils/shipping";
import { sendOrderNotification } from "@/utils/notify";
/* ---------------- CONFIG ---------------- */

const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASS = process.env.EMAIL_PASS!;
const JWT_SECRET = process.env.JWT_SECRET!;

/* ---------------- AUTH (COOKIE + BODY FALLBACK) ---------------- */
async function resolveUser(req: Request, bodyUserId?: string) {
  // 1️⃣ Try cookie auth (desktop / android)
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      const decoded: any = jwt.verify(token, JWT_SECRET);

      if (decoded?.id) {
        let user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });

        // Auto-heal (Safari edge case)
        if (!user) {
          user = await prisma.user.create({
            data: {
              id: decoded.id,
              email: decoded.email,
              name: decoded.name ?? "Customer",
            },
          });
        }

        return user;
      }
    }
  } catch {
    // ignore → fallback
  }

  // 2️⃣ Fallback: userId from body (iOS Safari safe)
  if (bodyUserId) {
    const user = await prisma.user.findUnique({
      where: { id: bodyUserId },
    });
    return user;
  }

  return null;
}

/* ---------------- EMAIL ---------------- */
async function sendOrderEmail(to: string, order: any, items: any[]) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  const itemList = items
    .map(
      (i) =>
        `➜ ${i.name} - ${i.size ?? "One Size"} (${i.quantity}) - ₹${i.price}`
    )
    .join("<br>");

  await transporter.sendMail({
    from: `"Arunodaya Collections" <arunodayacollections25@gmail.com>`,
    to,
    subject: `Order Placed - ${order.id}`,
    html: `
      <h2>Hi ${order.user?.name || "Customer"} 👋</h2>
      <p>Your order has been placed successfully.</p>
      <p><b>Order ID:</b> ${order.id}</p>
      <p>${itemList}</p>
      <p><b>Total:</b> ₹${order.totalAmount}</p>
      <p>— Team Arunodaya Collections</p>
    `,
  });
}

/* ---------------- WHATSAPP ---------------- */

function calculateBundleTotal(items: any[]) {
  let total = 0;

  const grouped: Record<string, any[]> = {};

  items.forEach((item) => {
    const category = item.category || "default";

    if (!grouped[category]) grouped[category] = [];

    grouped[category].push(item);
  });

  for (const category in grouped) {
    const group = grouped[category];
    const offer = offers[category];

    const qty = group.reduce((s, i) => s + i.quantity, 0);
    const price = group[0]?.price ?? 0;

    if (offer && price === offer.price) {
      let remaining = qty;

      for (const bundle of offer.bundles) {
        const count = Math.floor(remaining / bundle.qty);

        if (count > 0) {
          total += count * bundle.price;
          remaining = remaining % bundle.qty;
        }
      }

      total += remaining * price;
    } else {
      total += group.reduce((s, i) => s + i.price * i.quantity, 0);
    }
  }

  return total;
}
/* ---------------- MAIN API ---------------- */
export async function POST(req: Request) {
  try {
    const body = await req.json();
const {
  userId,
  items,
  paymentMode,
  address,
  upiId,
  cardDetails,
  razorpayOrderId,

  deliveryType,
  pickupStore,
} = body;

    const user = await resolveUser(req, userId);

    if (!user) {
      return NextResponse.json(
        { error: "Session expired. Please signup again." },
        { status: 401 }
      );
    }

if (
  !items?.length ||
  (deliveryType !== "PICKUP" && !address)
) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }
if (
  paymentMode === "COD" &&
  deliveryType !== "PICKUP" &&
  !isCODAvailable(address?.pincode)
) {
  return NextResponse.json(
    {
      error:
        "Cash on Delivery is unavailable for this location",
    },
    { status: 400 }
  );
}
    /* ---------------- PRODUCTS ---------------- */
  /* ---------------- PRODUCTS ---------------- */

const productIds = items.map((i: any) => i.productId);

const products = await prisma.product.findMany({
  where: { id: { in: productIds } },
});

const orderItems = await Promise.all(
  items.map(async (item: any) => {
    const product = products.find((p) => p.id === item.productId)!;
if (!product) {
  throw new Error(`Product not found: ${item.productId}`);
}
    // 🔥 FIX 1: GET VARIANT FIRST
    const variant = item.variantId
      ? await prisma.productVariant.findUnique({
          where: { id: item.variantId },
        })
      : null;

    // 🔥 FIX 2: PRICE LOGIC
    let price = item.price;

    if (item.price !== 0 && variant?.price) {
      price = variant.price;
    }

    // 🔥 FIX 3: IMAGE LOGIC (CORRECT WAY)
    const image =
      item.image || // frontend selected image (best)
       variant?.images?.[0] ||// variant image
      product.images?.[0] || // fallback
      null;

    // ✅ NOW RETURN OBJECT
    return {
      productId: product.id,
      siteId: product.siteId,
      name: product.name,
      brandName: product.brandName ?? "ARUNODAYA",
      quantity: Number(item.quantity),
      price,

      category: product.subSubSubCategory?.toLowerCase() ?? "default",

      size: item.size ?? null,
      color:
        item.color && item.color !== "nocolor"
          ? item.color
          : null,

      variantId: item.variantId ?? null,

      image, // 🔥 IMPORTANT (now valid)
    };
  })
);
  const totalAmount = calculateBundleTotal(orderItems);
const shippingCharge =
  deliveryType === "PICKUP"
    ? 0
    : getShippingCharge(
        address?.pincode || "",
        totalAmount
      );
const finalTotal = totalAmount + shippingCharge;
    /* ---------------- RAZORPAY ---------------- */
   /* ---------------- RAZORPAY ---------------- */


    /* ---------------- DB TRANSACTION ---------------- */
    const order = await prisma.$transaction(async (tx) => {
     const createdOrder = await tx.order.create({
data: {
  userId: user.id,
  totalAmount: finalTotal,

  paymentMode: paymentMode || "COD",

  deliveryType: deliveryType || "HOME",

  pickupStore:
    deliveryType === "PICKUP"
      ? pickupStore
      : null,

  status: "PENDING",

  paymentStatus: "PENDING",

  address,

  upiId:
    paymentMode === "UPI"
      ? upiId ?? null
      : null,

  cardDetails:
    paymentMode === "Card"
      ? JSON.stringify(cardDetails)
      : null,

  razorpayOrderId:
    razorpayOrderId ?? null
},

  include: { user: true },
});

for (const item of orderItems) {
  try {
    if (item.variantId) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    await tx.orderItem.create({
      data: {
        orderId: createdOrder.id,
        productId: item.productId,
        siteId: item.siteId,
        brandName: item.brandName,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        variantId: item.variantId,
        image: item.image,
        isFree: item.price === 0,
      },
    });
  } catch (err) {
    console.error("❌ ORDER ITEM ERROR:", item);
    console.error(err);
    throw err;
  }
}
      return createdOrder;
    });

    /* ---------------- NOTIFICATIONS ---------------- */
const isValidEmail = (e?: string) =>
  e &&
  e.includes("@") &&
  !e.toLowerCase().includes("noemail");

const finalEmail = isValidEmail(address?.email)
  ? address.email
  : isValidEmail(user.email)
  ? user.email
  : null;

sendOrderNotification({
  email: user.email,
  addressEmail: address?.email,
 phone: address?.phone ?? "",
customerName: user.name,
addressName:
  address?.name ??
  "Store Pickup Customer",
  orderId: order.id,
  deliveryType:
  deliveryType || "HOME",

pickupStore:
  deliveryType === "PICKUP"
    ? pickupStore
    : null,
  items: orderItems.map((i) => ({
    name: i.name,
    qty: i.quantity,
    price: i.price,
    size: i.size,
    image: i.image,
  })),
  total: order.totalAmount,
  paymentMode,
  status: "ordered",
}).catch((err) =>
  console.error("Notify Error:", err)
);


  return NextResponse.json(
  { success: true, order },
  { status: 201 }
);
  } catch (err: any) {
    console.error("🔥 FULL ORDER ERROR:", err);
console.error("🔥 STACK:", err?.stack);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
