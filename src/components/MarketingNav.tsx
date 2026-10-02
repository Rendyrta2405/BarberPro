"use client";

import Link from "next/link";
import { useState } from "react";
import { STORE } from "@/lib/data";

const links = [
  { href: "/#layanan", label: "Layanan" },
  { href: "/#barber", label: "Barber" },
  { href: "/#testimoni", label: "Testimoni" },
];

export default function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex min-w-0 max-w-6xl items-center gap-2 px-4 py-3 sm:gap-6 sm:px-6">
        <Link href="/" onClick={() => setOpen(false)} className="shrink-0 font-display text-xl font-bold text-ink">
          {STORE.logoPlain}<span className="text-gold">{STORE.logoAccent}</span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap text-sm text-ink/70 transition hover:text-ink">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="hidden whitespace-nowrap rounded-full border border-gold px-4 py-2 text-xs font-bold text-gold transition hover:bg-gold/10 sm:inline-flex"
          >
            Demo Owner
          </Link>
          <Link
            href="/booking"
            className="whitespace-nowrap rounded-full bg-gold px-4 py-2 text-sm font-bold text-ink transition hover:bg-gold-soft sm:px-7 sm:text-base"
          >
            Booking Sekarang
          </Link>
          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border border-ink/15 bg-white/60 md:hidden"
          >
            <span className={`h-0.5 w-5 bg-ink transition ${open ? "translate-y-1 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-ink transition ${open ? "-translate-y-1 -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {open && (
        <div className="absolute left-0 top-full w-full border-b border-t border-ink/10 bg-cream shadow-lg md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-ink/5 py-3 text-sm font-semibold text-ink/80 last:border-b-0"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setOpen(false)} className="py-3 text-sm font-semibold text-gold">
              Demo Owner
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}