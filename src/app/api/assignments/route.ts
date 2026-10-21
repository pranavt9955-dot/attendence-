import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const course = searchParams.get("course");
    const className = searchParams.get("className");
    const section = searchParams.get("section");

    const where: any = {};

    if (session.role === "STUDENT") {
      // Fetch student profile to strictly isolate to authorized assignments
      const student = await prisma.studentProfile.findUnique({
        where: { userId: session.userId },
      });

      if (!student) {
        return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
      }

      // Student can only see PUBLISHED assignments matching their course, class, and section (or "ALL")
      where.status = "PUBLISHED";
      where.course = student.course;
      where.className = student.className;
      where.OR = [
        { section: student.section },
        { section: "ALL" },
        { section: "" },
      ];
    } else {
      // Admin filters
      if (status && status !== "ALL") where.status = status;
      if (course) where.course = course;
      if (className) where.className = className;
      if (section && section !== "ALL") where.section = section;
    }

    if (search?.trim()) {
      const q = search.trim();
      const currentOr = where.OR || [];
      where.AND = [
        {
          OR: [
            { title: { contains: q } },
            { subjectName: { contains: q } },
            { subjectCode: { contains: q } },
            { teacherName: { contains: q } },
          ],
        },
      ];
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        attachments: true,
      },
      orderBy: { deadline: "asc" },
    });

    return NextResponse.json({
      success: true,
      assignments,
      total: assignments.length,
    });
  } catch (error: any) {
    console.error("Assignments fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      course,
      department,
      className,
      section = "ALL",
      semester = "",
      subjectName,
      subjectCode,
      teacherName,
      issueDate,
      deadline,
      maxMarks = 100,
      status = "PUBLISHED", // DRAFT, PUBLISHED, ARCHIVED
      attachments = [],
    } = body;

    if (!title || !description || !course || !className || !subjectName || !deadline) {
      return NextResponse.json(
        { error: "Title, description, course, class, subject name, and submission deadline are required." },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        course: course.trim(),
        department: department?.trim() || "",
        className: className.trim(),
        section: section ? section.trim() : "ALL",
        semester: semester?.trim() || "",
        subjectName: subjectName.trim(),
        subjectCode: subjectCode?.trim() || "",
        teacherName: teacherName?.trim() || "Faculty",
        issueDate: issueDate || new Date().toISOString().split("T")[0],
        deadline,
        maxMarks: Number(maxMarks) || 100,
        status,
        createdById: session.userId,
        attachments: {
          create: attachments.map((att: any) => ({
            fileName: att.fileName,
            fileUrl: att.fileUrl,
            fileType: att.fileType,
            fileSize: att.fileSize,
          })),
        },
      },
      include: {
        attachments: true,
      },
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "ASSIGNMENT_CREATED",
      entityType: "Assignment",
      entityId: assignment.id,
      details: {
        title: assignment.title,
        course: assignment.course,
        className: assignment.className,
        status: assignment.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Assignment "${assignment.title}" saved successfully.`,
      assignment,
    });
  } catch (error: any) {
    console.error("Create assignment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
