import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/lib/connectDB";
import { calculateVariantOffer } from "@/lib/calculateVariantOffer";

export async function POST(req: Request) {
  await connectDB();

  const { productId, variantId, quantity } = await req.json();
const product = await Product.findById(productId).exec();

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

 const variant = product.variants.find(
  (v: any) => v._id.toString() === variantId
);

  if (!variant) {
    return NextResponse.json(
      { error: "Variant not found" },
      { status: 404 }
    );
  }

  const result = calculateVariantOffer(
    variant,
    quantity
  );

  return NextResponse.json(result);
}