import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { loginId, password, portalRole } = await req.json();

    if (!loginId || !password) {
      return NextResponse.json(
        { error: "Login ID and password are required" },
        { status: 400 }
      );
    }

    const trimmedLogin = loginId.trim();

    // Look for user by email, username, or student admission number
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: trimmedLogin.toLowerCase() },
          { username: trimmedLogin.toLowerCase() },
          {
            student: {
              admissionNumber: trimmedLogin.toUpperCase(),
            },
          },
        ],
      },
      include: {
        student: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. Please check your username/email/admission number." },
        { status: 401 }
      );
    }

    // Role verification
    if (portalRole && user.role !== portalRole) {
      if (portalRole === "ADMIN" && user.role === "STUDENT") {
        return NextResponse.json(
          { error: "Access Denied: Student accounts cannot access the Admin Portal." },
          { status: 403 }
        );
      }
      if (portalRole === "STUDENT" && user.role === "ADMIN") {
        // Allow admin to proceed or warn
      }
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials. Incorrect password." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role as "ADMIN" | "STUDENT",
      studentId: user.student?.id,
      fullName: user.student?.fullName || user.username,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        fullName: user.student?.fullName || (user.role === "ADMIN" ? "Administrator" : user.username),
        studentId: user.student?.id,
        studentProfile: user.student,
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    await logAudit({
      userId: user.id,
      userEmail: user.email,
      action: "USER_LOGIN",
      entityType: "Auth",
      details: { role: user.role, loginMethod: "credentials" },
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed. " + (error.message || "") },
      { status: 500 }
    );
  }
}
