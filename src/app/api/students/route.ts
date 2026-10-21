import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const course = searchParams.get("course") || "";
    const className = searchParams.get("className") || "";
    const section = searchParams.get("section") || "";
    const status = searchParams.get("status") || "ACTIVE"; // "ACTIVE", "ARCHIVED", "ALL"

    const where: any = {};

    if (status !== "ALL") {
      where.status = status;
    }

    if (course) where.course = course;
    if (className) where.className = className;
    if (section) where.section = section;

    if (search.trim()) {
      const q = search.trim();
      where.OR = [
        { fullName: { contains: q } },
        { admissionNumber: { contains: q } },
        { rollNumber: { contains: q } },
        { email: { contains: q } },
      ];
    }

    const students = await prisma.studentProfile.findMany({
      where,
      orderBy: [{ className: "asc" }, { section: "asc" }, { rollNumber: "asc" }],
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            attendanceRecords: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      students,
      total: students.length,
    });
  } catch (error: any) {
    console.error("Fetch students error:", error);
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
      fullName,
      admissionNumber,
      rollNumber,
      course,
      department,
      className,
      section,
      semester,
      academicSession,
      email,
      mobileNumber,
      fatherName,
      motherName,
      guardianContact,
      residentialAddress,
      admissionDate,
      gender,
      dateOfBirth,
      profilePhoto,
      remarks,
      studentLoginId,
      password,
    } = body;

    // Validate required fields
    if (!fullName || !admissionNumber || !rollNumber || !course || !className || !section || !email) {
      return NextResponse.json(
        { error: "Required fields missing. Full Name, Admission No, Roll No, Course, Class, Section, and Email are mandatory." },
        { status: 400 }
      );
    }

    const cleanAdmissionNo = admissionNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (studentLoginId?.trim() || cleanAdmissionNo).toLowerCase();

    // Check for duplicate admission number
    const existingAdmission = await prisma.studentProfile.findUnique({
      where: { admissionNumber: cleanAdmissionNo },
    });
    if (existingAdmission) {
      return NextResponse.json(
        { error: `Duplicate Record: Admission Number "${cleanAdmissionNo}" is already assigned to ${existingAdmission.fullName}.` },
        { status: 409 }
      );
    }

    // Check for duplicate email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: cleanEmail }, { username: cleanUsername }],
      },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: `Account already exists with email "${cleanEmail}" or login ID "${cleanUsername}".` },
        { status: 409 }
      );
    }

    const initialPassword = password?.trim() || "Student@123";
    const hashedPassword = await hashPassword(initialPassword);

    // Create User and Student Profile atomically
    const newStudent = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: cleanEmail,
          username: cleanUsername,
          password: hashedPassword,
          role: "STUDENT",
        },
      });

      const profile = await tx.studentProfile.create({
        data: {
          userId: user.id,
          fullName: fullName.trim(),
          admissionNumber: cleanAdmissionNo,
          rollNumber: rollNumber.trim(),
          course: course.trim(),
          department: department ? department.trim() : "",
          className: className.trim(),
          section: section.trim(),
          semester: semester ? semester.trim() : "",
          academicSession: academicSession ? academicSession.trim() : "2025-2026",
          email: cleanEmail,
          mobileNumber: mobileNumber?.trim() || null,
          fatherName: fatherName?.trim() || null,
          motherName: motherName?.trim() || null,
          guardianContact: guardianContact?.trim() || null,
          residentialAddress: residentialAddress?.trim() || null,
          admissionDate: admissionDate?.trim() || new Date().toISOString().split("T")[0],
          gender: gender || null,
          dateOfBirth: dateOfBirth || null,
          profilePhoto: profilePhoto || null,
          remarks: remarks?.trim() || null,
          status: "ACTIVE",
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
      });

      return profile;
    });

    await logAudit({
      userId: session.userId,
      userEmail: session.email,
      action: "STUDENT_CREATED",
      entityType: "Student",
      entityId: newStudent.id,
      details: {
        admissionNumber: newStudent.admissionNumber,
        fullName: newStudent.fullName,
        course: newStudent.course,
        className: newStudent.className,
        section: newStudent.section,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Student "${newStudent.fullName}" (${newStudent.admissionNumber}) registered successfully.`,
      student: newStudent,
    });
  } catch (error: any) {
    console.error("Student registration error:", error);
    return NextResponse.json(
      { error: "Failed to register student: " + (error.message || "") },
      { status: 500 }
    );
  }
}
