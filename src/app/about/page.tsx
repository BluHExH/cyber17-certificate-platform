import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Shield } from "lucide-react";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-[var(--primary)]" />
            <h1 className="text-3xl font-bold text-white">About Cyber 17 Official</h1>
          </div>
          <div className="space-y-4 text-[var(--muted)]">
            <p>
              Cyber 17 Official is a professional cybersecurity organization dedicated to
              advancing secure practices through training, assessment, and recognized credentials.
            </p>
            <p>
              Our Certificate Issuance & Verification Platform provides transparent, independent
              verification of credentials we issue. Every certificate receives a unique system-
              generated ID and a QR code that links exclusively to our official verification endpoint.
            </p>
            <p>
              We do not embed personal information inside QR codes. Verification reveals only the
              public certificate fields intentionally designated for public display.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
