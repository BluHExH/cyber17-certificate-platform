import Link from "next/link";
import { requireAdmin } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";
import RevokeButton from "@/components/admin/RevokeButton";

export const dynamic = "force-dynamic";

export default async function CertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const admin = await requireAdmin("certificates:read");
  const sp = await searchParams;
  const q = sp.q?.trim();
  const status = sp.status;

  const certificates = await prisma.certificate.findMany({
    where: {
      AND: [
        status && ["ACTIVE", "REVOKED", "EXPIRED"].includes(status)
          ? { status: status as "ACTIVE" | "REVOKED" | "EXPIRED" }
          : {},
        q
          ? {
              OR: [
                { certificateId: { contains: q, mode: "insensitive" } },
                { title: { contains: q, mode: "insensitive" } },
                { recipient: { fullName: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {},
      ],
    },
    include: { recipient: true, type: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row cyber-grid">
      <AdminNav name={admin.name} email={admin.email} />
      <main className="flex-1 p-4 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">Certificates</h1>
          <Link
            href="/admin/certificates/new"
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[#05080f] text-sm font-semibold"
          >
            Create
          </Link>
        </div>

        <form className="flex flex-wrap gap-2 mb-6">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search ID, name, title…"
            className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--card-border)] text-sm text-white min-w-[200px]"
          />
          <select
            name="status"
            defaultValue={status || ""}
            className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--card-border)] text-sm text-white"
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="REVOKED">Revoked</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg border border-[var(--card-border)] text-sm text-white hover:bg-white/5"
          >
            Filter
          </button>
        </form>

        <div className="glass rounded-xl overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[var(--muted)] border-b border-[var(--card-border)]">
              <tr>
                <th className="p-3 font-medium">Certificate ID</th>
                <th className="p-3 font-medium">Recipient</th>
                <th className="p-3 font-medium">Title</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-[var(--muted)]">
                    No certificates found.
                  </td>
                </tr>
              )}
              {certificates.map((c) => (
                <tr key={c.id} className="border-b border-[var(--card-border)]/50">
                  <td className="p-3 font-mono text-xs text-white">{c.certificateId}</td>
                  <td className="p-3 text-white">{c.recipient.fullName}</td>
                  <td className="p-3 text-[var(--muted)]">{c.title}</td>
                  <td className="p-3">
                    <span
                      className={
                        c.status === "ACTIVE"
                          ? "text-[var(--success)]"
                          : c.status === "REVOKED"
                          ? "text-[var(--danger)]"
                          : "text-[var(--warning)]"
                      }
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <Link
                      href={`/verify/${c.certificateId}`}
                      className="text-[var(--primary)] text-xs hover:underline"
                      target="_blank"
                    >
                      View
                    </Link>
                    {c.status === "ACTIVE" && (
                      <RevokeButton id={c.id} certificateId={c.certificateId} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
