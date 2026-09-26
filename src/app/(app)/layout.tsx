import type { ReactNode } from "react";
import Link from "next/link";
import { STORE } from "@/lib/data";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-cream/10 bg-ink text-cream">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-display text-lg font-bold">
            {STORE.logoPlain}<span className="text-gold">{STORE.logoAccent}</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <Link href="/" className="text-cream/70 transition hover:text-cream">
              Beranda
            </Link>
            <Link href="/booking" className="text-gold">
              Booking
            </Link>
          </nav>
          <span className="text-xs font-bold uppercase tracking-widest text-cream/50 md:hidden">
            Booking
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4 pb-28 pt-6 md:max-w-6xl md:pb-16 md:pt-10">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-white md:hidden">
        <div className="mx-auto flex h-16 max-w-md">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center text-sm font-semibold text-ink/60"
          >
            Home
          </Link>
          <Link
            href="/booking"
            className="flex flex-1 items-center justify-center text-sm font-semibold text-gold"
          >
            Booking
          </Link>
        </div>
      </nav>
    </div>
  );
}