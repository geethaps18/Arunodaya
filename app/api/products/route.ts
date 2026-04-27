// app/api/products/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import { Buffer } from "buffer";

// ----------------------
// Cloudinary config
// ----------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
function safeParse(value: FormDataEntryValue | null, fallback: any) {
  try {
    if (!value || typeof value !== "string") return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
// ----------------------
// Upload helper (Cloudinary)
// ----------------------
async function uploadToCloudinary(file: File): Promise<string | null> {
  try {
    // ✅ Basic validation
    if (!file || !file.type.startsWith("image/") || file.size === 0) {
      console.warn("Skipping invalid file:", file?.name);
      return null;
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    return await new Promise((resolve) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "bscfashion/products",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            resolve(null); // ❗ DO NOT reject
            return;
          }
          resolve(result?.secure_url ?? null);
        }
      ).end(buffer);
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
}


async function uploadVideoToCloudinary(file: File): Promise<string | null> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    return await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "bscfashion/product-videos",
            resource_type: "video", // 🔥 IMPORTANT
          },
          (error, result) => {
            if (error) {
              console.error(error);
              resolve(null);
            }
            resolve(result?.secure_url ?? null);
          }
        )
        .end(buffer);
    });
  } catch {
    return null;
  }
}



export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const siteId = searchParams.get("siteId");
    const page = Number(searchParams.get("page") || 1);
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const normalize = (v?: string | null) =>
      v ? v.trim().toLowerCase().replace(/\s+/g, "-") : null;

    const category = normalize(searchParams.get("category"));
    const subCategory = normalize(searchParams.get("subCategory"));
    const subSubCategory = normalize(searchParams.get("subSubCategory"));
  const subSubSubCategory = normalize(searchParams.get("subSubSubCategory"));

    const where: Record<string, any> = {};

    if (siteId) {
      where.siteId = siteId;
    } else {
      where.status = "ACTIVE";
    }

    if (category) where.category = category;
    if (subCategory) where.subCategory = subCategory;
    if (subSubCategory) where.subSubCategory = subSubCategory;
if (subSubSubCategory) where.subSubSubCategory = subSubSubCategory;

    

    const [total, productsRaw] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          brand: { select: { id: true, name: true } },
          variants: {
            select: {
              id: true,
              size: true,
              color: true,
              stock: true,
              images: true,
            },
          },
        },
      }),
    ]);

    const products = productsRaw.map((p) => ({
      ...p,
      brandName: p.brand?.name || p.brandName || "BSCFASHION",
    }));

    const hasMore = skip + products.length < total;

    return NextResponse.json({
      products,
      total,
      hasMore,
      page,
    });
  } catch (err) {
    console.error("GET /products error:", err);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}



export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    /* ---------------------------------
       BRAND INPUTS
    ----------------------------------*/
    const brandIdRaw = formData.get("brandId");
    const brandNameRaw = formData.get("brandName");

    const brandId =
      typeof brandIdRaw === "string" && /^[a-f\d]{24}$/i.test(brandIdRaw)
        ? brandIdRaw
        : null;

    const brandNameInput =
      typeof brandNameRaw === "string" && brandNameRaw.trim()
        ? brandNameRaw.trim()
        : null;

    /* ---------------------------------
       SITE CONTEXT
    ----------------------------------*/
    const siteIdRaw = formData.get("siteId");
    let site: any = null;
    let siteId: string | null = null;
    let isPlatform = false;

    if (typeof siteIdRaw === "string" && /^[a-f\d]{24}$/i.test(siteIdRaw)) {
      site = await prisma.site.findUnique({
        where: { id: siteIdRaw },
      });

      if (!site) {
        return NextResponse.json(
          { message: "Invalid site" },
          { status: 400 }
        );
      }

      siteId = site.id;
      isPlatform = false;
    } else {
      isPlatform = true;
    }

    /* ---------------------------------
       FINAL BRAND RESOLUTION
    ----------------------------------*/
    let finalBrandId: string | null = null;
    let finalBrandName: string | null = null;

    // 1️⃣ Selected existing brand
    if (brandId) {
      const existingBrand = await prisma.brand.findUnique({
        where: { id: brandId },
      });

      if (existingBrand) {
        finalBrandId = existingBrand.id;
        finalBrandName = existingBrand.name;
      }
    }

    // 2️⃣ Typed brand → create / reuse
    if (!finalBrandId && brandNameInput && site) {
      const slug = brandNameInput
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const existingBrand = await prisma.brand.findFirst({
        where: {
          slug,
          sellerId: site.ownerId,
        },
      });

      if (existingBrand) {
        finalBrandId = existingBrand.id;
        finalBrandName = existingBrand.name;
      } else {
        const newBrand = await prisma.brand.create({
          data: {
            name: brandNameInput,
            slug,
            sellerId: site.ownerId,
            siteId: site.id,
          },
        });

        finalBrandId = newBrand.id;
        finalBrandName = newBrand.name;
      }
    }

    // 3️⃣ Fallback
    if (!finalBrandName) {
      finalBrandName = site?.name || "BSCFASHION";
    }

    /* ---------------------------------
       BASIC PRODUCT FIELDS
    ----------------------------------*/
    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "");

    const normalize = (v?: string | null) =>
      v ? v.trim().toLowerCase().replace(/\s+/g, "-") : null;

   const categoryPath = safeParse(formData.get("categoryPath"), []);

    const category = normalize(categoryPath[0]);
const subCategory = normalize(categoryPath[1]);
const subSubCategory = normalize(categoryPath[2]);
const subSubSubCategory = normalize(categoryPath[3]);


const price = Number(formData.get("price") || 0);
const mrp = Number(formData.get("mrp") || price);

const discount =
  Number(formData.get("discount")) ||
  (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

const discountAmount =
  Number(formData.get("discountAmount")) ||
  (mrp > price ? mrp - price : 0);


    /* ---------------------------------
       MEDIA & DETAILS
    ----------------------------------*/
   const images: string[] = safeParse(formData.get("images"), []);

    const fit = safeParse(formData.get("fit"), []);

   const fabricCare = safeParse(formData.get("fabricCare"), []);

    const features = safeParse(formData.get("features"), []);

    /* ---------------------------------
       VARIANTS
    ----------------------------------*/
 const variants = safeParse(formData.get("variants"), []);

    const variantData = [];

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      const files = formData.getAll(`variantImages_${i}`) as File[];
      const uploadedImages: string[] = [];
for (const file of files) {
  if (!file || file.size === 0) continue; // 🔥 IMPORTANT
  const url = await uploadToCloudinary(file);
  if (url) uploadedImages.push(url);
}


      variantData.push({
        size: v.size ?? null,
        color: v.color ?? null,
       price:
  v.price !== undefined && v.price !== ""
    ? Number(v.price)
    : price, // ✅ base product price

        stock: Number(v.stock) || 0,
        images: uploadedImages,
      });
    }

    /* ---------------------------------
       VIDEO
    ----------------------------------*/
    const videoFile = formData.get("video") as File | null;
    let videoUrl: string | null = null;

    if (videoFile && videoFile.size > 0) {
      videoUrl = await uploadVideoToCloudinary(videoFile);
    }

    /* ---------------------------------
       CREATE PRODUCT
    ----------------------------------*/
    const product = await prisma.product.create({
      data: {
        siteId,
        isPlatform,
        brandId: finalBrandId,
        brandName: finalBrandName,
        name,
        description,
        category,
        subCategory,
        subSubCategory,
        subSubSubCategory, 
        price,
        mrp,
        discount,
        discountAmount,
        images,
        video: videoUrl,
        fit,
        fabricCare,
        features,
        status: "ACTIVE",
        variants: {
          create: variantData,
        },
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json({
      message: "✅ Product added successfully",
      product,
    });
  } catch (error: any) {
    console.error("POST /products error:", error);
    return NextResponse.json(
      { message: "❌ Failed to add product", error: error.message },
      { status: 500 }
    );
  }
}


