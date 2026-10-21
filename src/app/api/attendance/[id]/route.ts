import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const attSession = await prisma.attendanceSession.findUnique({
      where: { id },
      include: {
        records: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!attSession) {
      return NextResponse.json({ error: "Attendance session not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, session: attSession });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { records = [], facultyName, startTime, endTime, status } = body;

    const existingSession = await prisma.attendanceSession.findUnique({
      where: { id },
      include: { records: true },
    });

    if (!existingSession) {
      return NextResponse.json({ error: "Attendance session not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      // Update session metadata if passed
      if (facultyName || startTime || endTime || status) {
        await tx.attendanceSession.update({
          where: { id },
          data: {
            facultyName: facultyName || existingSession.facultyName,
            startTime: startTime !== undefined ? startTime : existingSession.startTime,
            endTime: endTime !== undefined ? endTime : existingSession.endTime,
            status: status || existingSession.status,
          },
        });
      }

      // Update individual student records
      for (const r of records) {
        if (r.id) {
          await tx.attendanceRecord.update({
            where: { id: r.id },
            data: {
              status: r.status,
              remarks: r.remarks !== undefined ? r.remarks : undefined,
            },
          });
        } else if (r.studentId) {
          await tx.attendanceRecord.upsert({
            where: {
              unique_student_session_record: {
                sessionId: id,
                studentId: r.studentId,
              },
            },
            update: {
              status: r.status,
              remarks: r.remarks,
            },
            create: {
              sessionId: id,
              studentId: r.studentId,
              status: r.status || "PRESENT",
              remarks: r.remarks,
            },
          });
        }
      }
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "ATTENDANCE_EDITED",
      entityType: "AttendanceSession",
      entityId: id,
      details: {
        sessionDate: existingSession.sessionDate,
        subjectCode: existingSession.subjectCode,
        updatedCount: records.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Attendance records updated successfully with audit trail.",
    });
  } catch (error: any) {
    console.error("Update attendance error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = params;
    const existingSession = await prisma.attendanceSession.findUnique({
      where: { id },
    });

    if (!existingSession) {
      return NextResponse.json({ error: "Attendance session not found" }, { status: 404 });
    }

    await prisma.attendanceSession.delete({
      where: { id },
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "ATTENDANCE_SESSION_DELETED",
      entityType: "AttendanceSession",
      entityId: id,
      details: {
        sessionDate: existingSession.sessionDate,
        subjectCode: existingSession.subjectCode,
        period: existingSession.periodNumber,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Attendance session and associated records deleted.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
