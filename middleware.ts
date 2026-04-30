// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const config = {
  matcher: [
    "/wishlist/:path*",
    "/bag/:path*",
    "/account/:path*",
    "/admin/:path*",
    "/additems/:path*",
    "/builder/:path*",
  ],
  runtime: "nodejs",
};

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // ✅ allow public routes
  if (
    url.pathname.startsWith("/admin/login") ||
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/signup")
  ) {
    return NextResponse.next();
  }

  /* ---------- USER ROUTES ---------- */
  const userRoutes = ["/wishlist", "/bag", "/account"];

  // 🔥 NO TOKEN CASE
  if (!token) {
    // 👉 admin & builder go to admin login
    if (
      url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/builder") ||
      url.pathname.startsWith("/additems")
    ) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // 👉 normal users
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);

    /* ---------- ADMIN ---------- */
    if (
      url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/additems")
    ) {
      if (decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    /* ---------- SELLER ---------- */
    if (url.pathname.startsWith("/builder")) {
      if (decoded.role !== "SELLER") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    /* ---------- USER PROTECTED ---------- */
    if (
      userRoutes.some((r) => url.pathname.startsWith(r)) &&
      !decoded
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

  } catch {
    // 🔥 token invalid → redirect based on path
    if (
      url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/builder") ||
      url.pathname.startsWith("/additems")
    ) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }
}