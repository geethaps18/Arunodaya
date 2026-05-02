import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOwnerId } from "@/utils/getOwnerId";
import slugify from "slugify";
import bcrypt from "bcryptjs";
/* =========================
   ADMIN CREATE SELLER + SITE
========================= */
export async function POST(req: Request) {
  try {
    // 🔐 ADMIN AUTH CHECK
    const userId = await getOwnerId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 📦 READ BODY FIRST
 const { name, phone, email, brandName, password } = await req.json();
const cleanPhone = phone.trim(); // ✅ 
// ✅ NOW password exists
if (!name || !phone || !email || !brandName || !password) {
  return NextResponse.json(
    { error: "All fields are required" },
    { status: 400 }
  );
}

// ✅ safe to use
if (password.length < 6) {
  return NextResponse.json(
    { error: "Password must be at least 6 characters" },
    { status: 400 }
  );
}
if (!/^\d{10}$/.test(cleanPhone)) {
  return NextResponse.json(
    { error: "Enter valid 10-digit phone number" },
    { status: 400 }
  );
}
const hashedPassword = await bcrypt.hash(password, 10);
const cleanEmail = email.trim().toLowerCase();
    // 🚫 BLOCK reused emails (THIS WAS MISSING)
    const existingUser = await prisma.user.findFirst({
     where: { email: cleanEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "This email is already used for login. Please use a new store email.",
        },
        { status: 400 }
      );
    }

    // 🔑 SLUG (safe + unique)
    const slug = `${slugify(brandName, {
      lower: true,
      strict: true,
    })}-${Date.now()}`;

    // 🔁 TRANSACTION
    const result = await prisma.$transaction(async (tx) => {
      const seller = await tx.user.create({
  data: {
    name,
   phone: cleanPhone,
   email: cleanEmail,
    password: hashedPassword, // ✅ IMPORTANT
    role: "SELLER",
  },
});

      const site = await tx.site.create({
        data: {
          ownerId: seller.id,
          name: brandName,
          slug,
          template: "default",
          color: "#000000",
          section: [],
        },
      });

      return { seller, site };
    });

   return NextResponse.json({
  success: true,
  seller: {
    id: result.seller.id,
    name: result.seller.name,
    email: result.seller.email,
  },
  site: result.site,
});
  } catch (error: any) {
    console.error("CREATE SELLER ERROR:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Seller or site already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create online store" },
      { status: 500 }
    );
  }
}


/* =========================
   ADMIN FETCH SELLERS
========================= */
export async function GET() {
  try {
    const userId = await getOwnerId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sellers = await prisma.user.findMany({
      where: { role: "SELLER" },
      orderBy: { createdAt: "desc" },
      include: {
        sites: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ sellers });
  } catch (error) {
    console.error("FETCH SELLERS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch sellers" },
      { status: 500 }
    );
  }
}
