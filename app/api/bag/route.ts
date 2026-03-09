import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";
import { offers } from "@/data/offers";
const JWT_SECRET = process.env.JWT_SECRET!;

interface BagItemPayload {
  bagId?: string;
  productId?: string;
  quantity?: number;
  size?: string;
  color?: string;
  variantId?: string;
  
}


interface JwtPayload {
  userId: string;
}

function getUserId(req: NextRequest): string | null {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded.userId;
  } catch {
    return null;
  }
}

function mapBagItem(item: any) {
  return {
    id: item.id,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    variantId: item.variantId,
   stock: item.variant?.stock ?? 0,

    price: item.price, // ✅ ADD THIS LINE

    images:
      item.variant?.images?.length
        ? item.variant.images
        : item.product.images,

product: {
  id: item.product.id,
  name: item.product.name,

  // 👇 Always use variant price as source of truth
  price: item.variant?.price ?? item.product.price,
  mrp: item.variant?.mrp ?? item.product.mrp,
    subCategory: item.product.subCategory,
    subSubSubCategory: item.product.subSubSubCategory,
  images: item.variant?.images?.length
    ? item.variant.images
    : item.product.images,

  variants: item.variant
    ? [
        {
          id: item.variant.id,
          price: item.variant.price,
          mrp: item.variant.mrp,
          images: item.variant.images,
        },
      ]
    : [],

  availableSizes: item.product.sizes || [],
},


    uniqueKey: `${item.product.id}-${item.size || "default"}-${item.color || "nocolor"}`,
  };
}





// =====================
// GET BAG ITEMS
// =====================
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ items: [] }, { status: 401 });

  const items = await prisma.bag.findMany({
    where: { userId },
    include: { product: true,
               variant: true,
     },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items: items.map(mapBagItem) });
}

// =====================
// ADD TO BAG
// =====================
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    productId,
    size,
    color,
    variantId,
  }: BagItemPayload = await req.json();

  if (!productId || !variantId) {
    return NextResponse.json(
      { error: "Missing product or variant" },
      { status: 400 }
    );
  }

  const finalSize = size || "default";
  const finalColor = color || "nocolor";

  // ✅ Fetch variant (SOURCE OF TRUTH)
// ✅ Fetch variant (SOURCE OF TRUTH)
const variant = await prisma.productVariant.findUnique({
  where: { id: variantId },
});

if (!variant) {
  return NextResponse.json({ error: "Variant not found" }, { status: 404 });
}

// ✅ Check existing bag item
const existing = await prisma.bag.findFirst({
  where: {
    userId,
    productId,
    variantId,
    size: finalSize,
    color: finalColor,
  },
});
const nextQty = existing ? existing.quantity + 1 : 1;

if (nextQty > variant.stock) {
  return NextResponse.json(
    { error: `Only ${variant.stock} items available` },
    { status: 400 }
  );
}




const finalPrice = variant.price;
  if (existing) {
    await prisma.bag.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + 1,
      },
    });
  } else {
    await prisma.bag.create({
      data: {
        userId,
        productId,
        variantId,
        size: finalSize,
        color: finalColor,
        price: finalPrice, // ✅ STORED SAFELY
        quantity: 1,
      },
    });
  }

  const items = await prisma.bag.findMany({
    where: { userId },
    include: {
      product: true,
      variant: true,
    },
  });

  return NextResponse.json({ items: items.map(mapBagItem) });
}



// =====================
// UPDATE BAG ITEM
// =====================
export async function PUT(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bagId, quantity, size }: BagItemPayload = await req.json();

  if (!bagId) {
    return NextResponse.json({ error: "Missing bagId" }, { status: 400 });
  }

  // ✅ 1. FETCH BAG ITEM FIRST
  const item = await prisma.bag.findUnique({
    where: { id: bagId },
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  // =====================
  // ✅ QUANTITY UPDATE (WITH STOCK CHECK)
  // =====================
  if (quantity !== undefined) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId! },
    });

    if (!variant) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      );
    }

    if (quantity > variant.stock) {
      return NextResponse.json(
        { error: `Only ${variant.stock} items available` },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      await prisma.bag.delete({ where: { id: bagId } });
    } else {
      await prisma.bag.update({
        where: { id: bagId },
        data: { quantity },
      });
    }
  }

  // =====================
  // ✅ SIZE UPDATE
  // =====================
  if (size) {
    const existing = await prisma.bag.findFirst({
      where: {
        userId,
        productId: item.productId,
        variantId: item.variantId,
        size,
        color: item.color ?? "nocolor",
      },
    });

    if (existing) {
      await prisma.bag.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });

      await prisma.bag.delete({ where: { id: bagId } });
    } else {
      await prisma.bag.update({
        where: { id: bagId },
        data: { size },
      });
    }
  }

  const items = await prisma.bag.findMany({
    where: { userId },
    include: { product: true, variant: true },
  });

  return NextResponse.json({ items: items.map(mapBagItem) });
}


// =====================
// DELETE BAG ITEM
// =====================
export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ items: [] }, { status: 401 });

  const { bagId }: BagItemPayload = await req.json();
  if (!bagId) {
    return NextResponse.json({ error: "Missing bagId" }, { status: 400 });
  }

  const existing = await prisma.bag.findUnique({ where: { id: bagId } });
  if (existing) {
    await prisma.bag.delete({ where: { id: bagId } });
  }

  const items = await prisma.bag.findMany({
    where: { userId },
    include: { product: true },
  });
  return NextResponse.json({ items: items.map(mapBagItem) });
}

// =====================
// CHECKOUT / PLACE ORDER
// =====================
export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentMode, address, upiId, cardDetails } = await req.json();

    // Fetch bag items
    const bagItems = await prisma.bag.findMany({
      where: { userId },
      include: { product: true },
    });

    if (!bagItems.length) {
      return NextResponse.json({ error: "Bag is empty" }, { status: 400 });
    }

    // Calculate total
// 🔥 BULK OFFER SUBTOTAL CALCULATION
let subtotal = 0;

const grouped: Record<string, typeof bagItems> = {};

bagItems.forEach((item) => {
  const category = item.product?.subSubSubCategory || "default";

  if (!grouped[category]) {
    grouped[category] = [];
  }

  grouped[category].push(item);
});

for (const category in grouped) {
  const items = grouped[category];
  const offer = offers[category];

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  if (offer && offer.type === "BULK") {
    const sortedRules = [...offer.rules].sort(
      (a, b) => b.minQty - a.minQty
    );

    let remainingQty = totalQty;

    for (const rule of sortedRules) {
      if (remainingQty >= rule.minQty) {
        const times = Math.floor(remainingQty / rule.minQty);
        subtotal += times * rule.totalPrice;
        remainingQty = remainingQty % rule.minQty;
      }
    }

    if (remainingQty > 0) {
      const singlePrice = items[0].price;
      subtotal += remainingQty * singlePrice;
    }

    continue;
  }

  // Normal pricing
  subtotal += items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
}
const shippingAmount = subtotal > 100 ? 0 : 100;
const totalAmount = subtotal + shippingAmount;

    // Map order items
 const orderItems = bagItems.map((item) => ({
  productId: item.productId,
  quantity: item.quantity,
  price: item.price, // ✅ FIXED
  name: item.product?.name || "Unknown",
  size: item.size || null,
  color: item.color || null,
  variantId: item.variantId || null,
}));



    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
         shippingAmount, 
        paymentMode: paymentMode || "COD",
        address: JSON.stringify(address),
        upiId: paymentMode === "UPI" ? upiId ?? null : null,
        cardDetails:
          paymentMode === "Card" && cardDetails
            ? JSON.stringify(cardDetails)
            : null,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Clear bag
    await prisma.bag.deleteMany({ where: { userId } });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err: any) {
    console.error("🔥 Checkout error:", err.message || err);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
