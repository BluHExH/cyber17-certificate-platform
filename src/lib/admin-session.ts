import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { hasPermission } from "@/lib/auth";
import type { AdminRole } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireAdmin(permission?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/admin/login");
  }
  const role = (session.user.role || "VIEWER") as AdminRole;
  if (permission && !hasPermission(role, permission)) {
    redirect("/admin?error=forbidden");
  }
  return {
    id: session.user.id as string,
    email: session.user.email,
    name: session.user.name || "Admin",
    role,
  };
}

export async function getOptionalAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return {
    id: session.user.id as string,
    email: session.user.email,
    name: session.user.name || "Admin",
    role: (session.user.role || "VIEWER") as AdminRole,
  };
}
