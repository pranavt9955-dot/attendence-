import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const {
      studentIds,
      action = "SOFT_DELETE", // "SOFT_DELETE", "RESTORE", "PERMANENT_DELETE"
      confirmationText,
      deleteAll = false,
    } = await req.json();

    // Check confirmation text if deleting all
    if (deleteAll) {
      if (confirmationText !== "DELETE ALL") {
        return NextResponse.json(
          { error: 'Confirmation failed. You must type "DELETE ALL" exactly to wipe all records.' },
          { status: 400 }
        );
      }
    } else {
      if (!Array.isArray(studentIds) || studentIds.length === 0) {
        return NextResponse.json(
          { error: "No students selected for operation." },
          { status: 400 }
        );
      }
    }

    let affectedCount = 0;

    if (action === "RESTORE") {
      const result = await prisma.studentProfile.updateMany({
        where: deleteAll ? { status: "DELETED" } : { id: { in: studentIds } },
        data: { status: "ACTIVE" },
      });
      affectedCount = result.count;

      await logAudit({
        userId: session.userId,
        userEmail: session.email,
        action: "STUDENT_RESTORED",
        entityType: "Student",
        details: { count: affectedCount, deleteAll },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully restored ${affectedCount} student records.`,
        count: affectedCount,
      });
    }

    if (action === "PERMANENT_DELETE") {
      // Find matching students to delete associated users
      const targetStudents = await prisma.studentProfile.findMany({
        where: deleteAll ? {} : { id: { in: studentIds } },
        select: { userId: true },
      });

      const userIds = targetStudents.map((s) => s.userId);

      const result = await prisma.user.deleteMany({
        where: { id: { in: userIds }, role: "STUDENT" },
      });
      affectedCount = result.count;

      await logAudit({
        userId: session.userId,
        userEmail: session.email,
        action: "STUDENT_PERMANENT_BULK_DELETE",
        entityType: "Student",
        details: { count: affectedCount, deleteAll },
      });

      return NextResponse.json({
        success: true,
        message: `Permanently deleted ${affectedCount} student records and associated accounts.`,
        count: affectedCount,
      });
    }

    // Default: SOFT_DELETE
    const result = await prisma.studentProfile.updateMany({
      where: deleteAll ? { status: { not: "DELETED" } } : { id: { in: studentIds } },
      data: { status: "DELETED" },
    });
    affectedCount = result.count;

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "STUDENT_BULK_SOFT_DELETE",
      entityType: "Student",
      details: { count: affectedCount, deleteAll },
    });

    return NextResponse.json({
      success: true,
      message: `Safely archived/soft-deleted ${affectedCount} student records. (They can be restored at any time).`,
      count: affectedCount,
    });
  } catch (error: any) {
    console.error("Bulk delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
