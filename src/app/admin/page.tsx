import Link from "next/link";
import { Shield, Lock } from "lucide-react";

export const metadata = { title: "Admin Portal" };

export default function AdminEntryPage() {
  return (
    <div className="min-h-screen flex items-center justify-center cyber-grid px-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-6">
          <Lock className="h-7 w-7 text-[var(--primary)]" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          Secure access for Cyber 17 Official administrators.
        </p>
        <p className="text-xs text-[var(--muted)] mb-6">
          Full admin dashboard (login, RBAC, certificate management, logs) is scaffolded
          in the codebase. After seeding, use the demo credentials documented in README.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--card-border)] text-sm hover:bg-white/5"
        >
          <Shield className="h-4 w-4" />
          Return to public site
        </Link>
      </div>
    </div>
  );
}
