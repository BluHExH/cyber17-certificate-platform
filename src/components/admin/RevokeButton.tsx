"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RevokeButton({
  id,
  certificateId,
}: {
  id: string;
  certificateId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function revoke() {
    if (!confirm(`Revoke certificate ${certificateId}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/certificates/${id}/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Revoked by administrator" }),
      });
      if (!res.ok) {
        alert("Revoke failed");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      alert("Revoke failed");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={revoke}
      disabled={loading}
      className="text-[var(--danger)] text-xs hover:underline disabled:opacity-50"
    >
      {loading ? "…" : "Revoke"}
    </button>
  );
}
