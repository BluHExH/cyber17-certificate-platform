import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export const metadata = { title: "Terms & Verification Policy" };

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-white mb-6">Terms & Certificate Verification Policy</h1>
          <div className="space-y-4 text-[var(--muted)]">
            <p>
              Certificates issued by Cyber 17 Official may be verified through the official platform only.
            </p>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">Verification Authority</h2>
            <p>
              Only results obtained from the official Cyber 17 Official verification system constitute
              authoritative status. Screenshots or third-party claims are not binding.
            </p>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">Statuses</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">ACTIVE / VERIFIED</strong> — Certificate is currently valid.</li>
              <li><strong className="text-white">REVOKED</strong> — Certificate is no longer considered valid.</li>
              <li><strong className="text-white">EXPIRED</strong> — Validity period has ended (if an expiry was set).</li>
              <li><strong className="text-white">NOT FOUND</strong> — ID does not exist in our database.</li>
            </ul>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">QR Codes</h2>
            <p>
              Official QR codes contain only the verification URL. They do not embed private personal data.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
