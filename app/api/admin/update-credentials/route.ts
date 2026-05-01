import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, oldPassword, newEmail, newPassword } = await req.json();

    if (!email || !oldPassword) {
      return NextResponse.json(
        { error: "Email and old password required ❌" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found ❌" }, { status: 404 });
    }

    // 🔐 Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Old password is incorrect ❌" },
        { status: 400 }
      );
    }

    // 🔒 Only ADMIN allowed
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized ❌" },
        { status: 403 }
      );
    }

// 🔐 Hash new password (if provided)
let hashedPassword = user.password;

if (newPassword) {
  hashedPassword = await bcrypt.hash(newPassword, 10);
}

// ✉️ Update email (if provided)
const updatedEmail = newEmail
  ? newEmail.trim().toLowerCase()
  : user.email;

// ✅ prevent duplicate email
if (newEmail) {
  const existingUser = await prisma.user.findUnique({
    where: { email: updatedEmail },
  });

  if (existingUser && existingUser.id !== user.id) {
    return NextResponse.json(
      { error: "Email already in use ❌" },
      { status: 400 }
    );
  }
}

// ✅ update
const updatedUser = await prisma.user.update({
  where: { id: user.id },
  data: {
    email: updatedEmail,
    password: hashedPassword,
  },
});
    return NextResponse.json({
      success: true,
      message: "Admin credentials updated successfully ✅",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
      },
    });

  } catch (err) {
    console.error("Update Admin Error:", err);
    return NextResponse.json(
      { error: "Something went wrong ❌" },
      { status: 500 }
    );
  }
}