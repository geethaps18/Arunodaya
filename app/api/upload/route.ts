import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure /public/uploads exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Safe filename
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, fileName);

    // Write file
    await fs.writeFile(filePath, buffer);

    // ✅ IMPORTANT: return public path
    return NextResponse.json({
      path: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
