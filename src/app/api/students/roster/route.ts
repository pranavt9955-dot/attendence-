import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const course = searchParams.get("course") || "";
    const className = searchParams.get("className") || "";
    const section = searchParams.get("section") || "";

    if (!course || !className || !section) {
      return NextResponse.json(
        { error: "Course, class, and section parameters are required." },
        { status: 400 }
      );
    }

    const students = await prisma.studentProfile.findMany({
      where: {
        course,
        className,
        section,
        status: "ACTIVE",
      },
      orderBy: { rollNumber: "asc" },
      select: {
        id: true,
        fullName: true,
        admissionNumber: true,
        rollNumber: true,
        profilePhoto: true,
        course: true,
        className: true,
        section: true,
      },
    });

    return NextResponse.json({
      success: true,
      students,
      count: students.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
