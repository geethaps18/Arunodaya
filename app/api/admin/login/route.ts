import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendEmailOtp } from "@/lib/sendEmailOtp";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    if (user.blocked) {
      return NextResponse.json({ error: "Account blocked" }, { status: 403 });
    }

    if (user.role !== "ADMIN" && user.role !== "SELLER") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 🔥 GENERATE OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60_000);

    await prisma.oTP.deleteMany({ where: { contact: cleanEmail } });

    await prisma.oTP.create({
      data: {
        contact: cleanEmail,
        otp,
        expiresAt,
      },
    });

    // ✅ SEND EMAIL OTP
    await sendEmailOtp(cleanEmail, otp);

    return NextResponse.json({
      success: true,
      message: "OTP sent to email 📩",
    });

  } catch (err) {
    console.error("Admin Login OTP Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}