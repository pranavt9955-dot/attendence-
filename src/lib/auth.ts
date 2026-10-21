import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

export const AUTH_COOKIE_NAME = "attendance_session_token";
const JWT_SECRET = process.env.JWT_SECRET || "student-attendance-super-secret-jwt-key-2026-production-ready";

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
  role: "ADMIN" | "STUDENT";
  studentId?: string;
  fullName?: string;
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function comparePassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the current session from NextRequest or next/headers cookies.
 */
export async function getSession(req?: NextRequest): Promise<TokenPayload | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    } catch {
      return null;
    }
  }

  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;

  // Verify that the user still exists in the database
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { student: true },
  });

  if (!user) return null;

  return {
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role as "ADMIN" | "STUDENT",
    studentId: user.student?.id,
    fullName: user.student?.fullName || user.username,
  };
}
