import { NextResponse } from "next/server";
import Media from "@/models/Media";
import { connectMongo } from "@/lib/mongoose";

export async function GET() {
  try {
    await connectMongo();

    const media = await (Media as any)
      .find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(media);
  } catch (error) {
    console.error("MEDIA ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}