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
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        attachments: true,
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    // If student, check if they are authorized to view this assignment
    if (session.role === "STUDENT") {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: session.userId },
      });
      if (
        !student ||
        assignment.status !== "PUBLISHED" ||
        assignment.course !== student.course ||
        assignment.className !== student.className ||
        (assignment.section !== "ALL" && assignment.section !== student.section)
      ) {
        return NextResponse.json({ error: "Access Denied: You are not assigned to this class." }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, assignment });
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

    const existing = await prisma.assignment.findUnique({
      where: { id },
      include: { attachments: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      // If new attachments provided, replace or add
      if (body.attachments && Array.isArray(body.attachments)) {
        await tx.assignmentAttachment.deleteMany({
          where: { assignmentId: id },
        });

        await tx.assignmentAttachment.createMany({
          data: body.attachments.map((att: any) => ({
            assignmentId: id,
            fileName: att.fileName,
            fileUrl: att.fileUrl,
            fileType: att.fileType,
            fileSize: att.fileSize,
          })),
        });
      }

      return tx.assignment.update({
        where: { id },
        data: {
          title: body.title !== undefined ? body.title.trim() : existing.title,
          description: body.description !== undefined ? body.description.trim() : existing.description,
          course: body.course !== undefined ? body.course.trim() : existing.course,
          department: body.department !== undefined ? body.department.trim() : existing.department,
          className: body.className !== undefined ? body.className.trim() : existing.className,
          section: body.section !== undefined ? body.section.trim() : existing.section,
          semester: body.semester !== undefined ? body.semester.trim() : existing.semester,
          subjectName: body.subjectName !== undefined ? body.subjectName.trim() : existing.subjectName,
          subjectCode: body.subjectCode !== undefined ? body.subjectCode.trim() : existing.subjectCode,
          teacherName: body.teacherName !== undefined ? body.teacherName.trim() : existing.teacherName,
          issueDate: body.issueDate || existing.issueDate,
          deadline: body.deadline || existing.deadline,
          maxMarks: body.maxMarks !== undefined ? Number(body.maxMarks) : existing.maxMarks,
          status: body.status || existing.status,
        },
        include: {
          attachments: true,
        },
      });
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "ASSIGNMENT_UPDATED",
      entityType: "Assignment",
      entityId: id,
      details: { title: updated.title, status: updated.status },
    });

    return NextResponse.json({
      success: true,
      message: `Assignment "${updated.title}" updated successfully.`,
      assignment: updated,
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
    const existing = await prisma.assignment.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    await prisma.assignment.delete({
      where: { id },
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "ASSIGNMENT_DELETED",
      entityType: "Assignment",
      entityId: id,
      details: { title: existing.title },
    });

    return NextResponse.json({
      success: true,
      message: `Assignment "${existing.title}" deleted.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
