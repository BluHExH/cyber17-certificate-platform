export type CertificateStatus = "ACTIVE" | "REVOKED" | "EXPIRED";

export type VerificationResult =
  | { status: "VALID"; certificate: import("@/lib/certificate").PublicCertificate }
  | { status: "NOT_FOUND"; message: string }
  | { status: "REVOKED"; certificate: import("@/lib/certificate").PublicCertificate; message: string }
  | { status: "EXPIRED"; certificate: import("@/lib/certificate").PublicCertificate; message: string };

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "CERTIFICATE_MANAGER" | "VIEWER";
