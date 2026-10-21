import { prisma } from "./prisma";

export async function logAudit({
  userId,
  userEmail,
  action,
  entityType,
  entityId,
  details,
}: {
  userId?: string;
  userEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any> | string;
}) {
  try {
    const detailsString = typeof details === "object" ? JSON.stringify(details) : details;
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        userEmail: userEmail || "system",
        action,
        entityType,
        entityId: entityId || null,
        details: detailsString || null,
      },
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
  }
}
