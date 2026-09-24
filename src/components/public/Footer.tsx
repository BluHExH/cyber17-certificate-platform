import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--card)]/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-[var(--primary)]" />
              <span className="font-semibold text-lg">
                <span className="text-gradient">CYBER 17</span> OFFICIAL
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] max-w-md leading-relaxed">
              Professional cybersecurity organization providing secure digital certificate
              issuance and independent verification services.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>
                <Link href="/verify" className="hover:text-[var(--primary)] transition">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--primary)] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--primary)] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-[var(--muted)]">
              <li>
                <Link href="/privacy" className="hover:text-[var(--primary)] transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--primary)] transition">
                  Terms & Verification Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--card-border)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--muted)]">
            © {year} Cyber 17 Official. All rights reserved.
          </p>
          <p className="text-xs text-[var(--muted)]">
            Secure certificate verification platform
          </p>
        </div>
      </div>
    </footer>
  );
}
