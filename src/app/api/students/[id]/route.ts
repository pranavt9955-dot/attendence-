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

    // If student, ensure they can only view their own profile
    if (session.role === "STUDENT" && session.studentId !== id) {
      return NextResponse.json({ error: "Forbidden: Cannot view another student's profile" }, { status: 403 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            createdAt: true,
          },
        },
        attendanceRecords: {
          orderBy: { markedAt: "desc" },
          take: 50,
          include: {
            session: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Calculate attendance summary
    const totalRecords = student.attendanceRecords.length;
    const presentCount = student.attendanceRecords.filter((r) => r.status === "PRESENT").length;
    const lateCount = student.attendanceRecords.filter((r) => r.status === "LATE").length;
    const leaveCount = student.attendanceRecords.filter((r) => r.status === "LEAVE").length;
    const absentCount = student.attendanceRecords.filter((r) => r.status === "ABSENT").length;

    // Counted attended = Present + Late
    const attendedCount = presentCount + lateCount;
    const percentage = totalRecords > 0 ? Math.round((attendedCount / totalRecords) * 100) : 100;

    return NextResponse.json({
      success: true,
      student,
      stats: {
        totalRecords,
        presentCount,
        lateCount,
        leaveCount,
        absentCount,
        attendedCount,
        percentage,
      },
    });
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

    const existing = await prisma.studentProfile.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check admission number uniqueness if changed
    if (body.admissionNumber && body.admissionNumber.trim().toUpperCase() !== existing.admissionNumber) {
      const duplicate = await prisma.studentProfile.findUnique({
        where: { admissionNumber: body.admissionNumber.trim().toUpperCase() },
      });
      if (duplicate && duplicate.id !== id) {
        return NextResponse.json(
          { error: `Admission number "${body.admissionNumber}" is already in use by another student.` },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.studentProfile.update({
      where: { id },
      data: {
        fullName: body.fullName?.trim() || existing.fullName,
        admissionNumber: body.admissionNumber ? body.admissionNumber.trim().toUpperCase() : existing.admissionNumber,
        rollNumber: body.rollNumber?.trim() || existing.rollNumber,
        course: body.course?.trim() || existing.course,
        department: body.department !== undefined ? body.department.trim() : existing.department,
        className: body.className?.trim() || existing.className,
        section: body.section?.trim() || existing.section,
        semester: body.semester !== undefined ? body.semester.trim() : existing.semester,
        academicSession: body.academicSession?.trim() || existing.academicSession,
        email: body.email?.trim().toLowerCase() || existing.email,
        mobileNumber: body.mobileNumber !== undefined ? body.mobileNumber?.trim() : existing.mobileNumber,
        fatherName: body.fatherName !== undefined ? body.fatherName?.trim() : existing.fatherName,
        motherName: body.motherName !== undefined ? body.motherName?.trim() : existing.motherName,
        guardianContact: body.guardianContact !== undefined ? body.guardianContact?.trim() : existing.guardianContact,
        residentialAddress: body.residentialAddress !== undefined ? body.residentialAddress?.trim() : existing.residentialAddress,
        gender: body.gender || existing.gender,
        dateOfBirth: body.dateOfBirth || existing.dateOfBirth,
        profilePhoto: body.profilePhoto !== undefined ? body.profilePhoto : existing.profilePhoto,
        remarks: body.remarks !== undefined ? body.remarks : existing.remarks,
        status: body.status || existing.status,
      },
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "STUDENT_UPDATED",
      entityType: "Student",
      entityId: id,
      details: { admissionNumber: updated.admissionNumber, fullName: updated.fullName },
    });

    return NextResponse.json({
      success: true,
      message: `Student record for "${updated.fullName}" updated successfully.`,
      student: updated,
    });
  } catch (error: any) {
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
    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get("permanent") === "true";

    const student = await prisma.studentProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (permanent) {
      // Cascading delete through User
      await prisma.user.delete({
        where: { id: student.userId },
      });

      await logAudit({
        userId: session.userId,
        userEmail: session.email,
        action: "STUDENT_PERMANENTLY_DELETED",
        entityType: "Student",
        entityId: id,
        details: { admissionNumber: student.admissionNumber, fullName: student.fullName },
      });

      return NextResponse.json({
        success: true,
        message: `Student "${student.fullName}" and all associated records permanently deleted.`,
      });
    } else {
      // Soft deletion / archival
      const updated = await prisma.studentProfile.update({
        where: { id },
        data: { status: "DELETED" },
      });

      await logAudit({
        userId: session.userId,
        userEmail: session.email,
        action: "STUDENT_SOFT_DELETED",
        entityType: "Student",
        entityId: id,
        details: { admissionNumber: student.admissionNumber, fullName: student.fullName },
      });

      return NextResponse.json({
        success: true,
        message: `Student "${student.fullName}" marked as deleted (can be restored from archives).`,
        student: updated,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
