import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    return NextResponse.json({
      user: {
        id: decoded.userId,
        role: decoded.role,
        name: decoded.name || null,
        email: decoded.email || null,
        phone: decoded.phone || null,
      },
    });

  } catch {
    return NextResponse.json({ user: null });
  }
}