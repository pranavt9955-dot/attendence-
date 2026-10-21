import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

// Start or retrieve a live session
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      sessionDate,
      course,
      department,
      className,
      section,
      semester,
      academicSession = "2025-2026",
      subjectName,
      subjectCode,
      facultyName,
      periodNumber,
      startTime,
      endTime,
    } = body;

    // Check if a session already exists for this slot
    let liveSession = await prisma.attendanceSession.findFirst({
      where: {
        sessionDate,
        className,
        section,
        subjectCode,
        periodNumber: String(periodNumber),
      },
      include: {
        records: {
          include: {
            student: true,
          },
        },
      },
    });

    if (liveSession) {
      // Reopening existing session
      return NextResponse.json({
        success: true,
        message: "Existing session restored for live marking.",
        session: liveSession,
        isReopened: true,
      });
    }

    // Otherwise create new live session
    // Fetch students roster for this class
    const students = await prisma.studentProfile.findMany({
      where: {
        course,
        className,
        section,
        status: "ACTIVE",
      },
      orderBy: { rollNumber: "asc" },
    });

    if (students.length === 0) {
      return NextResponse.json(
        { error: "No active students found in this course/class/section." },
        { status: 400 }
      );
    }

    liveSession = await prisma.attendanceSession.create({
      data: {
        sessionDate,
        course,
        department: department || "",
        className,
        section,
        semester: semester || "",
        academicSession,
        subjectName,
        subjectCode,
        facultyName,
        periodNumber: String(periodNumber),
        startTime: startTime || null,
        endTime: endTime || null,
        isLive: true,
        status: "LIVE",
        createdById: session.userId,
        records: {
          create: students.map((s) => ({
            studentId: s.id,
            status: "PRESENT", // Default all present to start
            remarks: null,
          })),
        },
      },
      include: {
        records: {
          include: {
            student: true,
          },
        },
      },
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "LIVE_ATTENDANCE_STARTED",
      entityType: "AttendanceSession",
      entityId: liveSession.id,
      details: {
        subjectCode,
        className,
        section,
        studentsCount: students.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Live attendance session initialized.",
      session: liveSession,
      isReopened: false,
    });
  } catch (error: any) {
    console.error("Live attendance start error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Real-time update for a single student or batch of students
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { sessionId, studentId, status, remarks } = await req.json();

    if (!sessionId || !studentId || !status) {
      return NextResponse.json(
        { error: "Session ID, Student ID, and status are required." },
        { status: 400 }
      );
    }

    const record = await prisma.attendanceRecord.upsert({
      where: {
        unique_student_session_record: {
          sessionId,
          studentId,
        },
      },
      update: {
        status,
        remarks: remarks !== undefined ? remarks : undefined,
      },
      create: {
        sessionId,
        studentId,
        status,
        remarks: remarks || null,
      },
    });

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Finalize and close the live session
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const updated = await prisma.attendanceSession.update({
      where: { id: sessionId },
      data: {
        isLive: false,
        status: "COMPLETED",
      },
      include: {
        records: true,
      },
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "LIVE_ATTENDANCE_FINALIZED",
      entityType: "AttendanceSession",
      entityId: sessionId,
      details: {
        subjectCode: updated.subjectCode,
        totalRecords: updated.records.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Attendance session finalized and closed successfully.",
      session: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
