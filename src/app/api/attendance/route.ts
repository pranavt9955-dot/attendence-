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
    const date = searchParams.get("date");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const course = searchParams.get("course");
    const className = searchParams.get("className");
    const section = searchParams.get("section");
    const subjectCode = searchParams.get("subjectCode");
    const status = searchParams.get("status");

    const where: any = {};

    if (date) {
      where.sessionDate = date;
    } else if (startDate || endDate) {
      where.sessionDate = {};
      if (startDate) where.sessionDate.gte = startDate;
      if (endDate) where.sessionDate.lte = endDate;
    }

    if (course) where.course = course;
    if (className) where.className = className;
    if (section) where.section = section;
    if (subjectCode) where.subjectCode = subjectCode;
    if (status) where.status = status;

    const sessions = await prisma.attendanceSession.findMany({
      where,
      orderBy: [{ sessionDate: "desc" }, { periodNumber: "asc" }],
      include: {
        records: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                admissionNumber: true,
                rollNumber: true,
                profilePhoto: true,
              },
            },
          },
        },
      },
      take: 100,
    });

    const enrichedSessions = sessions.map((s) => {
      const total = s.records.length;
      const present = s.records.filter((r) => r.status === "PRESENT").length;
      const absent = s.records.filter((r) => r.status === "ABSENT").length;
      const late = s.records.filter((r) => r.status === "LATE").length;
      const leave = s.records.filter((r) => r.status === "LEAVE").length;
      const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

      return {
        ...s,
        summary: {
          total,
          present,
          absent,
          late,
          leave,
          attendanceRate,
        },
      };
    });

    return NextResponse.json({
      success: true,
      sessions: enrichedSessions,
      total: enrichedSessions.length,
    });
  } catch (error: any) {
    console.error("Attendance fetch error:", error);
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
      isLive = false,
      status = "COMPLETED",
      records = [],
      overwriteExisting = false,
    } = body;

    if (
      !sessionDate ||
      !course ||
      !className ||
      !section ||
      !subjectName ||
      !subjectCode ||
      !facultyName ||
      !periodNumber
    ) {
      return NextResponse.json(
        { error: "Missing required attendance session fields." },
        { status: 400 }
      );
    }

    // Duplicate session slot check
    const existingSlot = await prisma.attendanceSession.findFirst({
      where: {
        sessionDate,
        className,
        section,
        subjectCode,
        periodNumber: String(periodNumber),
      },
    });

    if (existingSlot && !overwriteExisting) {
      return NextResponse.json(
        {
          error: `Duplicate Attendance Session: An attendance record already exists for ${subjectName} (${subjectCode}), Period ${periodNumber} on ${sessionDate} for ${className} ${section}.`,
          conflictId: existingSlot.id,
        },
        { status: 409 }
      );
    }

    // Save attendance in a transaction
    const savedSession = await prisma.$transaction(async (tx) => {
      // If overwriting, remove existing session & records
      if (existingSlot && overwriteExisting) {
        await tx.attendanceRecord.deleteMany({ where: { sessionId: existingSlot.id } });
        await tx.attendanceSession.delete({ where: { id: existingSlot.id } });
      }

      const createdSession = await tx.attendanceSession.create({
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
          isLive,
          status,
          createdById: session.userId,
        },
      });

      if (Array.isArray(records) && records.length > 0) {
        await tx.attendanceRecord.createMany({
          data: records.map((r: any) => ({
            sessionId: createdSession.id,
            studentId: r.studentId,
            status: r.status || "PRESENT",
            remarks: r.remarks?.trim() || null,
          })),
        });
      }

      return createdSession;
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "ATTENDANCE_CREATED",
      entityType: "AttendanceSession",
      entityId: savedSession.id,
      details: {
        sessionDate,
        subjectCode,
        className,
        section,
        periodNumber,
        recordCount: records.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Attendance for ${subjectName} (Period ${periodNumber}) saved successfully with ${records.length} students.`,
      session: savedSession,
    });
  } catch (error: any) {
    console.error("Save attendance error:", error);
    return NextResponse.json(
      { error: "Failed to save attendance: " + (error.message || "") },
      { status: 500 }
    );
  }
}
