"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/verify", label: "Verify Certificate" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--card-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30 group-hover:bg-[var(--primary)]/20 transition">
              <Shield className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              <span className="text-gradient">CYBER 17</span>
              <span className="text-[var(--muted)] ml-1 text-sm font-normal">OFFICIAL</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition rounded-md hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="ml-3 px-4 py-2 text-sm font-medium rounded-md bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30 hover:bg-[var(--primary)]/20 transition"
            >
              Admin
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-[var(--muted)] hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--card-border)] bg-[var(--card)]">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm text-[var(--muted)] hover:text-white rounded-md hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="mt-2 px-3 py-2.5 text-sm font-medium text-[var(--primary)] rounded-md bg-[var(--primary)]/10"
            >
              Admin Portal
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
