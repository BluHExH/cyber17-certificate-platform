"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Search, Shield } from "lucide-react";

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = certificateId.trim().toUpperCase();
    if (!id) {
      setError("Please enter a Certificate ID");
      return;
    }
    // Basic format check
    if (!/^C17-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(id) && id.length < 8) {
      setError("Invalid Certificate ID format");
      return;
    }
    setError("");
    setLoading(true);
    router.push(`/verify/${encodeURIComponent(id)}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
              <Shield className="h-7 w-7 text-[var(--primary)]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Certificate Verification</h1>
            <p className="text-[var(--muted)]">
              Enter the Certificate ID found on the certificate or scan the QR code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8">
            <label htmlFor="cert-id" className="block text-sm font-medium text-[var(--muted)] mb-2">
              Certificate ID
            </label>
            <input
              id="cert-id"
              type="text"
              value={certificateId}
              onChange={(e) => {
                setCertificateId(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="C17-XXXX-XXXX-XXXX"
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white placeholder:text-[var(--muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] font-mono tracking-wider"
              autoComplete="off"
              spellCheck={false}
            />
            {error && (
              <p className="mt-2 text-sm text-[var(--danger)]" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary)] text-[#05080f] font-semibold hover:bg-[var(--primary-dim)] transition disabled:opacity-60"
            >
              <Search className="h-5 w-5" />
              {loading ? "Verifying…" : "Verify Certificate"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--muted)]">
            QR codes on Cyber 17 Official certificates open this verification flow automatically.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
