import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { customAlphabet } from "nanoid";

const gen = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 4);

function makeId() {
  return `C17-${gen()}-${gen()}-${gen()}`;
}

/**
 * One-time setup: creates tables data (admin + demo certs) only if no admin exists.
 * POST /api/setup
 */
export async function POST() {
  try {
    const existing = await prisma.admin.count();
    if (existing > 0) {
      return NextResponse.json(
        { ok: false, message: "Already initialized. Setup is locked." },
        { status: 403 }
      );
    }

    const passwordHash = await hashPassword("Cyber17Admin!2026");
    const superAdmin = await prisma.admin.create({
      data: {
        email: "admin@cyber17.official",
        passwordHash,
        name: "Super Administrator",
        role: "SUPER_ADMIN",
      },
    });

    const typeNames = ["Completion", "Achievement", "Professional", "Participation"];
    const types = [];
    for (const name of typeNames) {
      types.push(
        await prisma.certificateType.create({
          data: { name, description: `${name} certificate` },
        })
      );
    }

    const recipients = await Promise.all([
      prisma.recipient.create({
        data: { fullName: "Alex Rivera", username: "arivera", userId: "U-1001" },
      }),
      prisma.recipient.create({
        data: { fullName: "Jordan Lee", username: "jlee", userId: "U-1002" },
      }),
      prisma.recipient.create({
        data: { fullName: "Sam Patel", username: "spatel", userId: "U-1003" },
      }),
    ]);

    const base = process.env.NEXT_PUBLIC_APP_URL || "https://cyber17-certificate-platform.vercel.app";

    const activeId = makeId();
    const revokedId = makeId();
    const expiredId = makeId();

    const active = await prisma.certificate.create({
      data: {
        certificateId: activeId,
        title: "Advanced Network Security",
        description: "Successfully completed the Advanced Network Security program with distinction.",
        courseProgram: "Cybersecurity Professional Track",
        issueDate: new Date("2025-06-15"),
        status: "ACTIVE",
        verificationUrl: `${base}/verify/${activeId}`,
        issuedByOrg: "Cyber 17 Official",
        authorizedBy: "Director of Training",
        recipientId: recipients[0].id,
        typeId: types[0].id,
        issuedByAdminId: superAdmin.id,
      },
    });

    const revoked = await prisma.certificate.create({
      data: {
        certificateId: revokedId,
        title: "Incident Response Fundamentals",
        description: "Completed Incident Response Fundamentals workshop.",
        courseProgram: "IR Series",
        issueDate: new Date("2024-11-01"),
        status: "REVOKED",
        revokedAt: new Date("2025-03-10"),
        revokeReason: "Administrative revocation for demonstration",
        verificationUrl: `${base}/verify/${revokedId}`,
        issuedByOrg: "Cyber 17 Official",
        recipientId: recipients[1].id,
        typeId: types[1].id,
        issuedByAdminId: superAdmin.id,
        revokedByAdminId: superAdmin.id,
      },
    });

    const expired = await prisma.certificate.create({
      data: {
        certificateId: expiredId,
        title: "Cloud Security Essentials",
        description: "Completed Cloud Security Essentials certification path.",
        courseProgram: "Cloud Defense",
        issueDate: new Date("2023-01-20"),
        expiryDate: new Date("2024-01-20"),
        status: "ACTIVE",
        verificationUrl: `${base}/verify/${expiredId}`,
        issuedByOrg: "Cyber 17 Official",
        recipientId: recipients[2].id,
        typeId: types[2].id,
        issuedByAdminId: superAdmin.id,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Setup complete",
      admin: { email: "admin@cyber17.official", password: "Cyber17Admin!2026" },
      certificates: {
        active: active.certificateId,
        revoked: revoked.certificateId,
        expired: expired.certificateId,
      },
    });
  } catch (e) {
    console.error("Setup error:", e);
    return NextResponse.json(
      {
        ok: false,
        message: e instanceof Error ? e.message : "Setup failed",
        hint: "Ensure DATABASE_URL is a valid Neon Postgres URL and schema is pushed (prisma db push).",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await prisma.admin.count();
    return NextResponse.json({
      initialized: count > 0,
      adminCount: count,
    });
  } catch (e) {
    return NextResponse.json(
      {
        initialized: false,
        error: e instanceof Error ? e.message : "DB error",
        hint: "Check DATABASE_URL and run prisma db push against Neon",
      },
      { status: 500 }
    );
  }
}
