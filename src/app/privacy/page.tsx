import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          <div className="space-y-4 text-[var(--muted)]">
            <p>
              Cyber 17 Official processes limited data necessary for certificate issuance and verification.
            </p>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">Public Verification</h2>
            <p>
              The public verification page displays only intentionally public certificate information
              (name, username, user ID if provided, title, dates, status, issuer). Passwords,
              authentication secrets, private notes, and unnecessary personal contact details are never shown.
            </p>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">Verification Logs</h2>
            <p>
              We may log verification attempts (result, timestamp). IP addresses, if collected for security,
              are restricted to authorized administrators and handled according to applicable law.
            </p>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">Contact</h2>
            <p>
              For privacy requests contact privacy@cyber17.official.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
