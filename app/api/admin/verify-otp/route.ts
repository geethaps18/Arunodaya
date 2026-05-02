import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const record = await prisma.oTP.findFirst({
      where: { contact: email },
      orderBy: { createdAt: "desc" },
    });

    if (!record || record.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    await prisma.oTP.deleteMany({ where: { contact: email } });

    const user = await prisma.user.findFirst({
      where: { email },
    });

    const token = jwt.sign(
      {
        userId: user!.id,
        role: user!.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user!.id,
        role: user!.role,
      },
    });

  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}