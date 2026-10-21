import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const course = searchParams.get("course");
    const className = searchParams.get("className");
    const section = searchParams.get("section");
    const subjectCode = searchParams.get("subjectCode");

    const sessionWhere: any = {};
    if (startDate || endDate) {
      sessionWhere.sessionDate = {};
      if (startDate) sessionWhere.sessionDate.gte = startDate;
      if (endDate) sessionWhere.sessionDate.lte = endDate;
    }
    if (course) sessionWhere.course = course;
    if (className) sessionWhere.className = className;
    if (section) sessionWhere.section = section;
    if (subjectCode) sessionWhere.subjectCode = subjectCode;

    const sessions = await prisma.attendanceSession.findMany({
      where: sessionWhere,
      include: {
        records: {
          include: {
            student: true,
          },
        },
      },
      orderBy: [{ sessionDate: "desc" }, { periodNumber: "asc" }],
    });

    // Generate CSV Header
    const headers = [
      "Date",
      "Period",
      "Course",
      "Class",
      "Section",
      "Subject Code",
      "Subject Name",
      "Faculty",
      "Roll No",
      "Admission No",
      "Student Name",
      "Attendance Status",
      "Remarks",
    ];

    const rows: string[] = [headers.join(",")];

    for (const s of sessions) {
      for (const r of s.records) {
        const row = [
          `"${s.sessionDate}"`,
          `"Period ${s.periodNumber}"`,
          `"${s.course.replace(/"/g, '""')}"`,
          `"${s.className.replace(/"/g, '""')}"`,
          `"${s.section.replace(/"/g, '""')}"`,
          `"${s.subjectCode.replace(/"/g, '""')}"`,
          `"${s.subjectName.replace(/"/g, '""')}"`,
          `"${s.facultyName.replace(/"/g, '""')}"`,
          `"${r.student.rollNumber.replace(/"/g, '""')}"`,
          `"${r.student.admissionNumber.replace(/"/g, '""')}"`,
          `"${r.student.fullName.replace(/"/g, '""')}"`,
          `"${r.status}"`,
          `"${(r.remarks || "").replace(/"/g, '""')}"`,
        ];
        rows.push(row.join(","));
      }
    }

    const csvContent = rows.join("\n");
    const filename = `attendance_report_${Date.now()}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
