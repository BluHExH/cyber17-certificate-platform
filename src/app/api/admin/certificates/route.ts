import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { hasPermission, createAuditLog } from "@/lib/auth";
import { ensureUniqueCertificateId, getVerificationUrl } from "@/lib/certificate";
import type { AdminRole } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user.role || "VIEWER") as AdminRole;
  if (!hasPermission(role, "certificates:read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const status = searchParams.get("status");

  const certificates = await prisma.certificate.findMany({
    where: {
      AND: [
        status ? { status: status as "ACTIVE" | "REVOKED" | "EXPIRED" } : {},
        q
          ? {
              OR: [
                { certificateId: { contains: q, mode: "insensitive" } },
                { title: { contains: q, mode: "insensitive" } },
                { recipient: { fullName: { contains: q, mode: "insensitive" } } },
                { recipient: { username: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {},
      ],
    },
    include: { recipient: true, type: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ certificates });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user.role || "VIEWER") as AdminRole;
  if (!hasPermission(role, "certificates:create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const fullName = String(body.fullName || "").trim();
    const title = String(body.title || "").trim();
    if (!fullName || !title) {
      return NextResponse.json({ error: "fullName and title are required" }, { status: 400 });
    }

    const certificateId = await ensureUniqueCertificateId();
    const verificationUrl = getVerificationUrl(certificateId);

    let recipient = null;
    if (body.userId) {
      recipient = await prisma.recipient.findFirst({
        where: { userId: String(body.userId) },
      });
    }
    if (!recipient) {
      recipient = await prisma.recipient.create({
        data: {
          fullName,
          username: body.username ? String(body.username).trim() : null,
          userId: body.userId ? String(body.userId).trim() : null,
        },
      });
    }

    let typeId: string | null = null;
    if (body.certificateType) {
      const t = await prisma.certificateType.upsert({
        where: { name: String(body.certificateType) },
        update: {},
        create: { name: String(body.certificateType) },
      });
      typeId = t.id;
    }

    const cert = await prisma.certificate.create({
      data: {
        certificateId,
        title,
        description: body.description ? String(body.description) : null,
        courseProgram: body.courseProgram ? String(body.courseProgram) : null,
        issueDate: body.issueDate ? new Date(body.issueDate) : new Date(),
        expiryDate:
          body.noExpiration || !body.expiryDate ? null : new Date(body.expiryDate),
        status: "ACTIVE",
        verificationUrl,
        issuedByOrg: body.issuedByOrg || "Cyber 17 Official",
        authorizedBy: body.authorizedBy ? String(body.authorizedBy) : null,
        recipientId: recipient.id,
        typeId,
        issuedByAdminId: session.user.id as string,
      },
      include: { recipient: true, type: true },
    });

    await createAuditLog({
      adminId: session.user.id as string,
      action: "CERTIFICATE_CREATED",
      targetType: "Certificate",
      targetId: cert.id,
      details: { certificateId },
    });

    return NextResponse.json({ certificate: cert }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create certificate" },
      { status: 500 }
    );
  }
}
