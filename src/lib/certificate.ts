import { customAlphabet } from "nanoid";
import QRCode from "qrcode";
import path from "path";
import fs from "fs/promises";
import { prisma } from "./prisma";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
const generateSegment = customAlphabet(alphabet, 4);

/**
 * Secure unique Certificate ID format: C17-XXXX-XXXX-XXXX
 */
export function generateCertificateId(): string {
  return `C17-${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}

export async function ensureUniqueCertificateId(maxAttempts = 10): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const id = generateCertificateId();
    const existing = await prisma.certificate.findUnique({
      where: { certificateId: id },
      select: { id: true },
    });
    if (!existing) return id;
  }
  throw new Error("Failed to generate unique certificate ID");
}

export function getVerificationUrl(certificateId: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}/verify/${certificateId}`;
}

/**
 * Generate QR code PNG for verification URL only (no personal data)
 */
export async function generateQrCode(
  certificateId: string,
  verificationUrl: string
): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "qrcodes");
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${certificateId}.png`;
  const filepath = path.join(uploadDir, filename);

  await QRCode.toFile(filepath, verificationUrl, {
    type: "png",
    width: 400,
    margin: 2,
    color: {
      dark: "#0a0f1c",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
  });

  return `/uploads/qrcodes/${filename}`;
}

export type PublicCertificate = {
  certificateId: string;
  title: string;
  description: string | null;
  courseProgram: string | null;
  issueDate: string;
  expiryDate: string | null;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  issuedByOrg: string;
  authorizedBy: string | null;
  recipient: {
    fullName: string;
    username: string | null;
    userId: string | null;
    profileImage: string | null;
  };
  typeName: string | null;
  verificationStatement: string;
};

export function toPublicCertificate(cert: any): PublicCertificate {
  // Auto-detect expired if date passed and status still ACTIVE
  let status = cert.status;
  if (
    status === "ACTIVE" &&
    cert.expiryDate &&
    new Date(cert.expiryDate) < new Date()
  ) {
    status = "EXPIRED";
  }

  return {
    certificateId: cert.certificateId,
    title: cert.title,
    description: cert.description,
    courseProgram: cert.courseProgram,
    issueDate: new Date(cert.issueDate).toISOString(),
    expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString() : null,
    status,
    issuedByOrg: cert.issuedByOrg,
    authorizedBy: cert.authorizedBy,
    recipient: {
      fullName: cert.recipient.fullName,
      username: cert.recipient.username,
      userId: cert.recipient.userId,
      profileImage: cert.recipient.profileImage,
    },
    typeName: cert.type?.name ?? null,
    verificationStatement:
      "This certificate has been verified through the official Cyber 17 Official verification system.",
  };
}
