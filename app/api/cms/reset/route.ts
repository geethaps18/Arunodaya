import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type CmsContent = {
  root?: any;
  content: Array<{ type: string; props: any }>;
  zones?: any;
};

export async function POST() {
  const page = await prisma.pageContent.findUnique({
    where: { slug: "home" },
  });

  if (!page || !page.content) {
    return NextResponse.json({ ok: true });
  }

  const cms = page.content as unknown as CmsContent;

  const cleaned: CmsContent = {
    ...cms,
    content: cms.content.filter(
      (block) =>
        block.type === "HeroBanner" ||
        block.type === "HeroSlide"
    ),
  };

  await prisma.pageContent.update({
    where: { slug: "home" },
    data: { content: cleaned },
  });

  return NextResponse.json({ cleaned: true });
}
