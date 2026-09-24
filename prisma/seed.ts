import { PrismaClient, AdminRole, CertificateStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import { generateCertificateId, getVerificationUrl, generateQrCode } from "../src/lib/certificate";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Cyber 17 Official demo data...");

  // Super Admin
  const passwordHash = await hash("Cyber17Admin!2026", 12);
  const superAdmin = await prisma.admin.upsert({
    where: { email: "admin@cyber17.official" },
    update: {},
    create: {
      email: "admin@cyber17.official",
      passwordHash,
      name: "Super Administrator",
      role: AdminRole.SUPER_ADMIN,
    },
  });
  console.log("Admin:", superAdmin.email, "(password: Cyber17Admin!2026)");

  // Certificate types
  const types = await Promise.all(
    ["Completion", "Achievement", "Professional", "Participation"].map((name) =>
      prisma.certificateType.upsert({
        where: { name },
        update: {},
        create: { name, description: `${name} certificate` },
      })
    )
  );

  // Recipients
  const recipients = await Promise.all([
    prisma.recipient.create({
      data: {
        fullName: "Alex Rivera",
        username: "arivera",
        userId: "U-1001",
      },
    }),
    prisma.recipient.create({
      data: {
        fullName: "Jordan Lee",
        username: "jlee",
        userId: "U-1002",
      },
    }),
    prisma.recipient.create({
      data: {
        fullName: "Sam Patel",
        username: "spatel",
        userId: "U-1003",
      },
    }),
  ]);

  // Active certificate
  const activeId = await generateUniqueId();
  const activeUrl = getVerificationUrl(activeId);
  let qrPath: string | null = null;
  try {
    qrPath = await generateQrCode(activeId, activeUrl);
  } catch (e) {
    console.warn("QR generation skipped (deps may be missing):", e);
  }

  const activeCert = await prisma.certificate.create({
    data: {
      certificateId: activeId,
      title: "Advanced Network Security",
      description: "Successfully completed the Advanced Network Security program with distinction.",
      courseProgram: "Cybersecurity Professional Track",
      issueDate: new Date("2025-06-15"),
      expiryDate: null,
      status: CertificateStatus.ACTIVE,
      verificationUrl: activeUrl,
      qrCodePath: qrPath,
      issuedByOrg: "Cyber 17 Official",
      authorizedBy: "Director of Training",
      recipientId: recipients[0].id,
      typeId: types[0].id,
      issuedByAdminId: superAdmin.id,
    },
  });
  console.log("Active cert:", activeCert.certificateId);

  // Revoked certificate
  const revokedId = await generateUniqueId();
  const revokedUrl = getVerificationUrl(revokedId);
  const revokedCert = await prisma.certificate.create({
    data: {
      certificateId: revokedId,
      title: "Incident Response Fundamentals",
      description: "Completed Incident Response Fundamentals workshop.",
      courseProgram: "IR Series",
      issueDate: new Date("2024-11-01"),
      status: CertificateStatus.REVOKED,
      revokedAt: new Date("2025-03-10"),
      revokeReason: "Administrative revocation for demonstration",
      verificationUrl: revokedUrl,
      issuedByOrg: "Cyber 17 Official",
      recipientId: recipients[1].id,
      typeId: types[1].id,
      issuedByAdminId: superAdmin.id,
      revokedByAdminId: superAdmin.id,
    },
  });
  console.log("Revoked cert:", revokedCert.certificateId);

  // Expired certificate
  const expiredId = await generateUniqueId();
  const expiredUrl = getVerificationUrl(expiredId);
  const expiredCert = await prisma.certificate.create({
    data: {
      certificateId: expiredId,
      title: "Cloud Security Essentials",
      description: "Completed Cloud Security Essentials certification path.",
      courseProgram: "Cloud Defense",
      issueDate: new Date("2023-01-20"),
      expiryDate: new Date("2024-01-20"),
      status: CertificateStatus.ACTIVE, // will show as EXPIRED by logic
      verificationUrl: expiredUrl,
      issuedByOrg: "Cyber 17 Official",
      recipientId: recipients[2].id,
      typeId: types[2].id,
      issuedByAdminId: superAdmin.id,
    },
  });
  console.log("Expired cert:", expiredCert.certificateId);

  console.log("\nSeed complete. Demo Certificate IDs:");
  console.log("  ACTIVE :", activeCert.certificateId);
  console.log("  REVOKED:", revokedCert.certificateId);
  console.log("  EXPIRED:", expiredCert.certificateId);
}

async function generateUniqueId() {
  const { customAlphabet } = await import("nanoid");
  const gen = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 4);
  return `C17-${gen()}-${gen()}-${gen()}`;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
