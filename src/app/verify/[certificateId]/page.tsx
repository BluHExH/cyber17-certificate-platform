import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { prisma } from "@/lib/prisma";
import { toPublicCertificate } from "@/lib/certificate";
import { CheckCircle2, XCircle, AlertTriangle, Ban, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";

type Props = {
  params: Promise<{ certificateId: string }>;
};

async function logVerification(
  certificateId: string | null,
  result: string,
  ip?: string,
  ua?: string
) {
  try {
    await prisma.verificationLog.create({
      data: {
        certificateId: certificateId
          ? (
              await prisma.certificate.findUnique({
                where: { certificateId },
                select: { id: true },
              })
            )?.id
          : null,
        result,
        ipAddress: ip ? ip.slice(0, 45) : null,
        userAgent: ua ? ua.slice(0, 200) : null,
      },
    });
  } catch {
    // non-blocking
  }
}

export default async function VerifyResultPage({ params }: Props) {
  const { certificateId: rawId } = await params;
  const certificateId = decodeURIComponent(rawId).trim().toUpperCase();

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || undefined;
  const ua = hdrs.get("user-agent") || undefined;

  const cert = await prisma.certificate.findUnique({
    where: { certificateId },
    include: {
      recipient: true,
      type: true,
    },
  });

  if (!cert) {
    await logVerification(null, "NOT_FOUND", ip, ua);
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="mx-auto max-w-lg px-4 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--danger)]/10 border border-[var(--danger)]/30 mb-6">
              <XCircle className="h-8 w-8 text-[var(--danger)]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">CERTIFICATE NOT FOUND</h1>
            <p className="text-[var(--muted)] mb-8">
              The certificate ID could not be found in the Cyber 17 Official verification database.
            </p>
            <Link
              href="/verify"
              className="inline-flex px-5 py-2.5 rounded-lg border border-[var(--card-border)] text-sm hover:bg-white/5 transition"
            >
              Try another ID
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  let status = cert.status;
  if (
    status === "ACTIVE" &&
    cert.expiryDate &&
    new Date(cert.expiryDate) < new Date()
  ) {
    status = "EXPIRED";
  }

  const publicCert = toPublicCertificate({ ...cert, status });
  await logVerification(certificateId, status === "ACTIVE" ? "VALID" : status, ip, ua);

  const isValid = status === "ACTIVE";
  const isRevoked = status === "REVOKED";
  const isExpired = status === "EXPIRED";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div
            className={`rounded-2xl p-6 sm:p-8 mb-6 border ${
              isValid
                ? "bg-[var(--success)]/10 border-[var(--success)]/30"
                : isRevoked
                ? "bg-[var(--danger)]/10 border-[var(--danger)]/30"
                : "bg-[var(--warning)]/10 border-[var(--warning)]/30"
            }`}
          >
            <div className="flex items-center gap-4">
              {isValid && <CheckCircle2 className="h-10 w-10 text-[var(--success)] shrink-0" />}
              {isRevoked && <Ban className="h-10 w-10 text-[var(--danger)] shrink-0" />}
              {isExpired && <AlertTriangle className="h-10 w-10 text-[var(--warning)] shrink-0" />}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)] mb-1">
                  Cyber 17 Official
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {isValid && "CERTIFICATE VERIFIED"}
                  {isRevoked && "CERTIFICATE REVOKED"}
                  {isExpired && "CERTIFICATE EXPIRED"}
                </h1>
                {isRevoked && (
                  <p className="text-sm text-[var(--danger)] mt-1">
                    This certificate is no longer considered valid.
                  </p>
                )}
                {isExpired && (
                  <p className="text-sm text-[var(--warning)] mt-1">
                    The validity period of this certificate has ended.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-[var(--card-border)] overflow-hidden shrink-0 flex items-center justify-center">
                  {publicCert.recipient.profileImage ? (
                    <Image
                      src={publicCert.recipient.profileImage}
                      alt={publicCert.recipient.fullName}
                      width={64}
                      height={64}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <Shield className="h-7 w-7 text-[var(--muted)]" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {publicCert.recipient.fullName}
                  </h2>
                  {publicCert.recipient.username && (
                    <p className="text-sm text-[var(--muted)]">@{publicCert.recipient.username}</p>
                  )}
                  {publicCert.recipient.userId && (
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      User ID: {publicCert.recipient.userId}
                    </p>
                  )}
                </div>
              </div>

              <div className="h-px bg-[var(--card-border)]" />

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-[var(--muted)] mb-0.5">Certificate ID</dt>
                  <dd className="font-mono text-white tracking-wide">{publicCert.certificateId}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)] mb-0.5">Status</dt>
                  <dd
                    className={`font-medium ${
                      isValid
                        ? "text-[var(--success)]"
                        : isRevoked
                        ? "text-[var(--danger)]"
                        : "text-[var(--warning)]"
                    }`}
                  >
                    {status}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[var(--muted)] mb-0.5">Certificate Title</dt>
                  <dd className="text-white font-medium">{publicCert.title}</dd>
                </div>
                {publicCert.typeName && (
                  <div>
                    <dt className="text-[var(--muted)] mb-0.5">Type</dt>
                    <dd className="text-white">{publicCert.typeName}</dd>
                  </div>
                )}
                {publicCert.courseProgram && (
                  <div>
                    <dt className="text-[var(--muted)] mb-0.5">Course / Program</dt>
                    <dd className="text-white">{publicCert.courseProgram}</dd>
                  </div>
                )}
                {publicCert.description && (
                  <div className="sm:col-span-2">
                    <dt className="text-[var(--muted)] mb-0.5">Description / Achievement</dt>
                    <dd className="text-white">{publicCert.description}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-[var(--muted)] mb-0.5">Issue Date</dt>
                  <dd className="text-white">
                    {new Date(publicCert.issueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)] mb-0.5">Expiry Date</dt>
                  <dd className="text-white">
                    {publicCert.expiryDate
                      ? new Date(publicCert.expiryDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No Expiration"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)] mb-0.5">Issued By</dt>
                  <dd className="text-white">{publicCert.issuedByOrg}</dd>
                </div>
                {publicCert.authorizedBy && (
                  <div>
                    <dt className="text-[var(--muted)] mb-0.5">Authorized By</dt>
                    <dd className="text-white">{publicCert.authorizedBy}</dd>
                  </div>
                )}
              </dl>

              <div className="pt-4 border-t border-[var(--card-border)]">
                <p className="text-xs text-[var(--muted)] italic">
                  {publicCert.verificationStatement}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/verify"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Verify another certificate
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
