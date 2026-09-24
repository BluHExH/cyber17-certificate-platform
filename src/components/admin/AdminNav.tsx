"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Award,
  PlusCircle,
  LogOut,
  Shield,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/certificates/new", label: "Create", icon: PlusCircle },
];

export default function AdminNav({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-[var(--card-border)] bg-[var(--card)]/40">
      <div className="p-4 border-b border-[var(--card-border)]">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[var(--primary)]" />
          <span className="font-semibold text-sm text-white">Admin Panel</span>
        </div>
        <p className="text-xs text-[var(--muted)] mt-2 truncate">{name}</p>
        <p className="text-xs text-[var(--muted)] truncate">{email}</p>
      </div>
      <nav className="p-2 flex md:flex-col gap-1 overflow-x-auto">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                active
                  ? "bg-[var(--primary)]/15 text-[var(--primary)]"
                  : "text-[var(--muted)] hover:text-white hover:bg-white/5"
              }`}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--danger)] hover:bg-white/5 md:mt-4"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </nav>
    </aside>
  );
}
