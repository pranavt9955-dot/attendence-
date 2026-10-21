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
    let targetStudentId = session.studentId;

    // Admin can view specific student's stats
    if (session.role === "ADMIN" && searchParams.get("studentId")) {
      targetStudentId = searchParams.get("studentId") || undefined;
    }

    if (!targetStudentId) {
      return NextResponse.json(
        { error: "No student profile associated with this account." },
        { status: 400 }
      );
    }

    // Today's date YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Get filters for history
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const subject = searchParams.get("subject");
    const status = searchParams.get("status");

    // Fetch Today's Attendance
    const todayRecords = await prisma.attendanceRecord.findMany({
      where: {
        studentId: targetStudentId,
        session: {
          sessionDate: today,
        },
      },
      include: {
        session: true,
      },
      orderBy: {
        session: {
          periodNumber: "asc",
        },
      },
    });

    // Fetch All Attendance Records for stats & history
    const historyWhere: any = {
      studentId: targetStudentId,
    };

    const sessionWhere: any = {};
    if (startDate || endDate) {
      sessionWhere.sessionDate = {};
      if (startDate) sessionWhere.sessionDate.gte = startDate;
      if (endDate) sessionWhere.sessionDate.lte = endDate;
    }
    if (subject) {
      sessionWhere.OR = [
        { subjectName: { contains: subject } },
        { subjectCode: { contains: subject } },
      ];
    }
    if (Object.keys(sessionWhere).length > 0) {
      historyWhere.session = sessionWhere;
    }
    if (status && status !== "ALL") {
      historyWhere.status = status;
    }

    const allRecords = await prisma.attendanceRecord.findMany({
      where: historyWhere,
      include: {
        session: true,
      },
      orderBy: [
        { session: { sessionDate: "desc" } },
        { session: { periodNumber: "asc" } },
      ],
    });

    // Global summary metrics for this student (unfiltered by date for accurate overall percentage)
    const totalRecordsAllTime = await prisma.attendanceRecord.findMany({
      where: { studentId: targetStudentId },
      include: { session: true },
    });

    const totalClasses = totalRecordsAllTime.length;
    const presentCount = totalRecordsAllTime.filter((r) => r.status === "PRESENT").length;
    const lateCount = totalRecordsAllTime.filter((r) => r.status === "LATE").length;
    const absentCount = totalRecordsAllTime.filter((r) => r.status === "ABSENT").length;
    const leaveCount = totalRecordsAllTime.filter((r) => r.status === "LEAVE").length;

    // Attended = Present + Late
    const attendedClasses = presentCount + lateCount;
    // Percentage = (Attended / Total) * 100
    const attendancePercentage =
      totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;

    // Student profile info
    const student = await prisma.studentProfile.findUnique({
      where: { id: targetStudentId },
      select: {
        id: true,
        fullName: true,
        admissionNumber: true,
        rollNumber: true,
        course: true,
        className: true,
        section: true,
        semester: true,
        academicSession: true,
        profilePhoto: true,
      },
    });

    return NextResponse.json({
      success: true,
      student,
      todayDate: today,
      todayRecords: todayRecords.map((r) => ({
        id: r.id,
        date: r.session.sessionDate,
        subjectName: r.session.subjectName,
        subjectCode: r.session.subjectCode,
        className: r.session.className,
        section: r.session.section,
        periodNumber: r.session.periodNumber,
        facultyName: r.session.facultyName,
        startTime: r.session.startTime,
        endTime: r.session.endTime,
        status: r.status,
        remarks: r.remarks,
      })),
      history: allRecords.map((r) => ({
        id: r.id,
        date: r.session.sessionDate,
        subjectName: r.session.subjectName,
        subjectCode: r.session.subjectCode,
        className: r.session.className,
        section: r.session.section,
        periodNumber: r.session.periodNumber,
        facultyName: r.session.facultyName,
        startTime: r.session.startTime,
        endTime: r.session.endTime,
        status: r.status,
        remarks: r.remarks,
      })),
      metrics: {
        totalClasses,
        attendedClasses,
        missedClasses: absentCount,
        lateArrivals: lateCount,
        approvedLeaves: leaveCount,
        attendancePercentage,
        statusBadge:
          attendancePercentage >= 75
            ? "Good Standing (Above 75%)"
            : attendancePercentage >= 65
            ? "Warning (Below 75%)"
            : "Critical (Below 65%)",
      },
    });
  } catch (error: any) {
    console.error("Student stats error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
