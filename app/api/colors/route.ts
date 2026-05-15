import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const colors = await prisma.color.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(colors);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Color name required" },
        { status: 400 }
      );
    }

    const existing = await prisma.color.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const color = await prisma.color.create({
      data: {
        name,
        hex: body.hex || "#000000",
      },
    });

    return NextResponse.json(color);
  } catch {
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}