import type { ReactNode } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="sticky top-0 z-20 border-b border-cream/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/admin" className="font-display text-lg font-bold">
            Barber<span className="text-gold">Pro</span>
            <span className="ml-2 rounded-full border border-gold/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm font-semibold text-cream/60 transition hover:text-cream sm:block"
            >
              Lihat Website
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}