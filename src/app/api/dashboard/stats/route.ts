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

    const today = new Date().toISOString().split("T")[0];

    if (session.role === "ADMIN") {
      // 1. Total Active Students
      const totalStudents = await prisma.studentProfile.count({
        where: { status: "ACTIVE" },
      });

      // 2. Total distinct Courses / Classes
      const courses = await prisma.studentProfile.findMany({
        where: { status: "ACTIVE" },
        select: { course: true, className: true },
        distinct: ["course", "className"],
      });
      const totalClassesCount = courses.length;

      // 3. Attendance Sessions Today
      const todaySessionsCount = await prisma.attendanceSession.count({
        where: { sessionDate: today },
      });

      // 4. Average Attendance Percentage across all sessions
      const allRecords = await prisma.attendanceRecord.findMany({
        select: { status: true },
      });
      const totalRecords = allRecords.length;
      const attendedRecords = allRecords.filter(
        (r) => r.status === "PRESENT" || r.status === "LATE"
      ).length;
      const avgAttendancePercentage =
        totalRecords > 0 ? Math.round((attendedRecords / totalRecords) * 100) : 0;

      // 5. Total Published Assignments
      const publishedAssignments = await prisma.assignment.count({
        where: { status: "PUBLISHED" },
      });

      // 6. Recently Added Students (latest 5)
      const recentStudents = await prisma.studentProfile.findMany({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          fullName: true,
          admissionNumber: true,
          rollNumber: true,
          course: true,
          className: true,
          section: true,
          admissionDate: true,
          createdAt: true,
          profilePhoto: true,
        },
      });

      // 7. Recent Attendance Activity (latest 5 sessions)
      const recentSessions = await prisma.attendanceSession.findMany({
        orderBy: [{ sessionDate: "desc" }, { createdAt: "desc" }],
        take: 5,
        include: {
          records: {
            select: { status: true },
          },
        },
      });

      const formattedRecentSessions = recentSessions.map((s) => {
        const total = s.records.length;
        const present = s.records.filter((r) => r.status === "PRESENT" || r.status === "LATE").length;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;
        return {
          id: s.id,
          sessionDate: s.sessionDate,
          subjectName: s.subjectName,
          subjectCode: s.subjectCode,
          className: s.className,
          section: s.section,
          facultyName: s.facultyName,
          periodNumber: s.periodNumber,
          totalStudents: total,
          attendanceRate: rate,
          status: s.status,
        };
      });

      return NextResponse.json({
        success: true,
        role: "ADMIN",
        stats: {
          totalStudents,
          totalClassesCount,
          todaySessionsCount,
          avgAttendancePercentage,
          publishedAssignments,
          recentStudents,
          recentAttendanceActivity: formattedRecentSessions,
        },
      });
    }

    // STUDENT ROLE
    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Student's today attendance status
    const todayRecords = await prisma.attendanceRecord.findMany({
      where: {
        studentId: student.id,
        session: { sessionDate: today },
      },
      include: {
        session: true,
      },
    });

    // Student's overall attendance percentage
    const allStudentRecords = await prisma.attendanceRecord.findMany({
      where: { studentId: student.id },
      select: { status: true },
    });
    const totalStudentClasses = allStudentRecords.length;
    const attendedClasses = allStudentRecords.filter(
      (r) => r.status === "PRESENT" || r.status === "LATE"
    ).length;
    const overallPercentage =
      totalStudentClasses > 0 ? Math.round((attendedClasses / totalStudentClasses) * 100) : 100;

    // Student's published assignments count
    const studentAssignments = await prisma.assignment.findMany({
      where: {
        status: "PUBLISHED",
        course: student.course,
        className: student.className,
        OR: [
          { section: student.section },
          { section: "ALL" },
          { section: "" },
        ],
      },
      include: {
        attachments: true,
      },
      orderBy: { deadline: "asc" },
    });

    const upcomingDeadlines = studentAssignments
      .filter((a) => a.deadline >= today)
      .slice(0, 4)
      .map((a) => ({
        id: a.id,
        title: a.title,
        subjectName: a.subjectName,
        subjectCode: a.subjectCode,
        deadline: a.deadline,
        maxMarks: a.maxMarks,
        hasAttachments: a.attachments.length > 0,
      }));

    return NextResponse.json({
      success: true,
      role: "STUDENT",
      stats: {
        student: {
          fullName: student.fullName,
          admissionNumber: student.admissionNumber,
          rollNumber: student.rollNumber,
          course: student.course,
          className: student.className,
          section: student.section,
          semester: student.semester,
          academicSession: student.academicSession,
          profilePhoto: student.profilePhoto,
        },
        todayRecordsCount: todayRecords.length,
        todayRecords: todayRecords.map((r) => ({
          subjectName: r.session.subjectName,
          subjectCode: r.session.subjectCode,
          periodNumber: r.session.periodNumber,
          status: r.status,
          remarks: r.remarks,
        })),
        totalClasses: totalStudentClasses,
        attendedClasses,
        overallPercentage,
        totalPublishedAssignments: studentAssignments.length,
        upcomingDeadlines,
      },
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
