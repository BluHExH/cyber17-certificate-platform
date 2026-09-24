import { compare, hash } from "bcryptjs";
import { prisma } from "./prisma";
import { AdminRole } from "@prisma/client";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return compare(password, passwordHash);
}

export type SessionAdmin = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
};

const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  SUPER_ADMIN: ["*"],
  ADMIN: [
    "certificates:read",
    "certificates:create",
    "certificates:update",
    "certificates:revoke",
    "certificates:restore",
    "recipients:read",
    "recipients:create",
    "recipients:update",
    "verification:read",
    "dashboard:read",
    "templates:read",
    "audit:read",
  ],
  CERTIFICATE_MANAGER: [
    "certificates:read",
    "certificates:create",
    "certificates:update",
    "certificates:revoke",
    "recipients:read",
    "recipients:create",
    "dashboard:read",
  ],
  VIEWER: [
    "certificates:read",
    "recipients:read",
    "verification:read",
    "dashboard:read",
  ],
};

export function hasPermission(role: AdminRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes("*") || perms.includes(permission);
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<SessionAdmin | null> {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !admin.isActive) return null;

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return null;

  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}

export async function createAuditLog(params: {
  adminId?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  await prisma.auditLog.create({
    data: {
      adminId: params.adminId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      details: params.details ? JSON.stringify(params.details) : null,
      ipAddress: params.ipAddress,
    },
  });
}
