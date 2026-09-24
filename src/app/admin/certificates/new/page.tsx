"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CreateCertificatePage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    userId: "",
    title: "",
    certificateType: "Completion",
    courseProgram: "",
    description: "",
    issueDate: new Date().toISOString().slice(0, 10),
    expiryDate: "",
    noExpiration: true,
    authorizedBy: "",
  });

  if (status === "unauthenticated") {
    router.push("/admin/login");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create");
        setLoading(false);
        return;
      }
      router.push("/admin/certificates");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="min-h-screen cyber-grid p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Create Certificate</h1>
          <Link href="/admin/certificates" className="text-sm text-[var(--muted)] hover:text-white">
            Back
          </Link>
        </div>

        <form onSubmit={onSubmit} className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--primary)]">Recipient</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-[var(--muted)]">Full Name *</label>
              <input
                required
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)]">Username</label>
              <input
                value={form.username}
                onChange={(e) => set("username", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)]">User ID</label>
              <input
                value={form.userId}
                onChange={(e) => set("userId", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
              />
            </div>
          </div>

          <h2 className="text-sm font-semibold text-[var(--primary)] pt-2">Certificate</h2>
          <div>
            <label className="text-xs text-[var(--muted)]">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--muted)]">Type</label>
              <select
                value={form.certificateType}
                onChange={(e) => set("certificateType", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
              >
                <option>Completion</option>
                <option>Achievement</option>
                <option>Professional</option>
                <option>Participation</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--muted)]">Course / Program</label>
              <input
                value={form.courseProgram}
                onChange={(e) => set("courseProgram", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--muted)]">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--muted)]">Issue Date</label>
              <input
                type="date"
                value={form.issueDate}
                onChange={(e) => set("issueDate", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.noExpiration}
                  onChange={(e) => set("noExpiration", e.target.checked)}
                />
                No expiration
              </label>
              {!form.noExpiration && (
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => set("expiryDate", e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
                />
              )}
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--muted)]">Authorized By</label>
            <input
              value={form.authorizedBy}
              onChange={(e) => set("authorizedBy", e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-white text-sm"
            />
          </div>

          {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[var(--primary)] text-[#05080f] font-semibold disabled:opacity-60"
          >
            {loading ? "Creating…" : "Issue certificate"}
          </button>
        </form>
      </div>
    </div>
  );
}
