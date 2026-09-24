import Link from "next/link";
import { requireAdmin } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";
import { Award, CheckCircle2, Ban, AlertTriangle, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin("dashboard:read");

  const [total, active, revoked, expired, verifications, success, invalid] =
    await Promise.all([
      prisma.certificate.count(),
      prisma.certificate.count({ where: { status: "ACTIVE" } }),
      prisma.certificate.count({ where: { status: "REVOKED" } }),
      prisma.certificate.count({ where: { status: "EXPIRED" } }),
      prisma.verificationLog.count(),
      prisma.verificationLog.count({ where: { result: "VALID" } }),
      prisma.verificationLog.count({
        where: { result: { in: ["NOT_FOUND", "INVALID"] } },
      }),
    ]);

  const stats = [
    { label: "Total Certificates", value: total, icon: Award, color: "text-[var(--primary)]" },
    { label: "Active", value: active, icon: CheckCircle2, color: "text-[var(--success)]" },
    { label: "Revoked", value: revoked, icon: Ban, color: "text-[var(--danger)]" },
    { label: "Expired", value: expired, icon: AlertTriangle, color: "text-[var(--warning)]" },
    { label: "Verifications", value: verifications, icon: Eye, color: "text-[var(--accent)]" },
    { label: "Valid checks", value: success, icon: CheckCircle2, color: "text-[var(--success)]" },
    { label: "Invalid checks", value: invalid, icon: Ban, color: "text-[var(--danger)]" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row cyber-grid">
      <AdminNav name={admin.name} email={admin.email} />
      <main className="flex-1 p-4 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-[var(--muted)]">Cyber 17 Official certificate system</p>
          </div>
          <Link
            href="/admin/certificates/new"
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[#05080f] text-sm font-semibold"
          >
            Create certificate
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-[var(--muted)] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Quick links</h2>
          <ul className="text-sm text-[var(--muted)] space-y-2">
            <li>
              <Link href="/admin/certificates" className="text-[var(--primary)] hover:underline">
                Manage certificates
              </Link>
            </li>
            <li>
              <Link href="/verify" className="text-[var(--primary)] hover:underline">
                Public verification page
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
