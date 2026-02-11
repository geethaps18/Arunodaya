import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const EMPTY_PUCK_DATA = {
  root: { props: {} },
  content: [],
  zones: {},
};

// SAVE CMS DATA
export async function POST(req: Request) {
  const data = await req.json();

  await prisma.pageContent.upsert({
    where: { slug: "home" },
    update: { content: data },
    create: {
      slug: "home",
      content: data,
    },
  });

  return NextResponse.json({ success: true });
}

// GET CMS DATA
export async function GET() {
  const page = await prisma.pageContent.findUnique({
    where: { slug: "home" },
  });

  return NextResponse.json(page?.content ?? EMPTY_PUCK_DATA);
}
