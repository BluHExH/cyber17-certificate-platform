import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { hasPermission, createAuditLog } from "@/lib/auth";
import type { AdminRole } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user.role || "VIEWER") as AdminRole;
  if (!hasPermission(role, "certificates:revoke")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const cert = await prisma.certificate.update({
    where: { id },
    data: {
      status: "REVOKED",
      revokedAt: new Date(),
      revokeReason: body.reason ? String(body.reason) : "Revoked by administrator",
      revokedByAdminId: session.user.id as string,
    },
  });

  await createAuditLog({
    adminId: session.user.id as string,
    action: "CERTIFICATE_REVOKED",
    targetType: "Certificate",
    targetId: cert.id,
    details: { certificateId: cert.certificateId },
  });

  return NextResponse.json({ certificate: cert });
}
