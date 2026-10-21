import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getSession } from "@/lib/auth";

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".txt",
  ".csv",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "assignments"; // "avatars" or "assignments"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum limit of 25MB (Current: ${(file.size / (1024 * 1024)).toFixed(2)} MB)` },
        { status: 400 }
      );
    }

    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported file extension "${ext}". Allowed: PDF, JPG, PNG, DOC, DOCX, PPT, PPTX` },
        { status: 400 }
      );
    }

    const safeCategory = category === "avatars" ? "avatars" : "assignments";
    const uploadDir = path.join(process.cwd(), "public", "uploads", safeCategory);
    await mkdir(uploadDir, { recursive: true });

    const randomSuffix = crypto.randomBytes(8).toString("hex");
    const cleanBaseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const savedFileName = `${Date.now()}-${cleanBaseName}-${randomSuffix}${ext}`;
    const filePath = path.join(uploadDir, savedFileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeCategory}/${savedFileName}`;

    return NextResponse.json({
      success: true,
      fileUrl: publicUrl,
      fileName: originalName,
      fileType: file.type || ext.replace(".", ""),
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file: " + (error.message || "") },
      { status: 500 }
    );
  }
}
