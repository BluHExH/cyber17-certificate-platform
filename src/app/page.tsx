import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Shield, CheckCircle2, QrCode, Lock, Search } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/5 via-transparent to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-medium mb-6">
                <Shield className="h-3.5 w-3.5" />
                Official Certificate Authority
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                Secure Certificate
                <span className="block text-gradient mt-1">Issuance & Verification</span>
              </h1>
              <p className="text-lg text-[var(--muted)] mb-10 leading-relaxed">
                Cyber 17 Official issues digitally verifiable certificates. Every certificate
                carries a unique ID and QR code linking to our official verification system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/verify"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary)] text-[#05080f] font-semibold hover:bg-[var(--primary-dim)] transition glow-primary"
                >
                  <Search className="h-5 w-5" />
                  Verify a Certificate
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[var(--card-border)] text-white hover:bg-white/5 transition"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 border-t border-[var(--card-border)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: QrCode,
                  title: "QR Verification",
                  desc: "Scan the QR code on any certificate to instantly open the official verification page.",
                },
                {
                  icon: CheckCircle2,
                  title: "Status Transparency",
                  desc: "Clearly see whether a certificate is valid, revoked, expired, or not found.",
                },
                {
                  icon: Lock,
                  title: "Secure by Design",
                  desc: "QR codes contain only the verification URL. No private data is embedded.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="glass rounded-xl p-6 hover:border-[var(--primary)]/30 transition"
                >
                  <div className="h-11 w-11 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-4">
                    <f.icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Verify CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-2xl p-8 sm:p-10 text-center glow-primary">
              <h2 className="text-2xl font-bold text-white mb-3">
                Verify a Certificate Now
              </h2>
              <p className="text-[var(--muted)] mb-6">
                Enter a Certificate ID or scan the QR code on the certificate.
              </p>
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary)] text-[#05080f] font-semibold hover:bg-[var(--primary-dim)] transition"
              >
                Go to Verification
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
