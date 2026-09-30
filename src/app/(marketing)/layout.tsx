import type { ReactNode } from "react";
import Link from "next/link";
import { STORE } from "@/lib/data";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-cream/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-display text-xl font-bold">
            {STORE.logoPlain}<span className="text-gold">{STORE.logoAccent}</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-semibold">
            <a href="#layanan" className="hidden text-ink/60 transition hover:text-ink sm:block">
              Layanan
            </a>
            <a href="#barber" className="hidden text-ink/60 transition hover:text-ink sm:block">
              Barber
            </a>
            <a href="#testimoni" className="hidden text-ink/60 transition hover:text-ink sm:block">
              Testimoni
            </a>
            <Link href="/admin" className="text-sm text-ink/60 transition hover:text-ink border border-2 border-gold px-3 py-1 rounded-xl">
              Demo Owner
            </Link>
            <Link href="/booking" className="btn-gold">
              Booking Sekarang
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="bg-ink text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold">
              {STORE.logoPlain}<span className="text-gold">{STORE.logoAccent}</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream/60">
              Barbershop premium dengan sistem booking modern.
              Kesan pertama dimulai dari rambut yang rapi.
            </p>
          </div>
          <div>
            <p className="eyebrow">Jam Operasional</p>
            <p className="mt-3 text-sm text-cream/70">Senin – Sabtu · 10.00 – 20.00 WIB</p>
            <p className="mt-1 text-sm text-cream/70">Minggu · jadwal terpilih</p>
          </div>
          <div>
            <p className="eyebrow">Kunjungi Kami</p>
            <p className="mt-3 text-sm text-cream/70">Jl. Premium No. 12, Jakarta</p>
            <p className="mt-1 text-sm text-cream/70">WhatsApp · +62 812-1211-212</p>
          </div>
        </div>
        <p className="border-t border-cream/10 py-5 text-center text-xs text-cream/40">
          © {new Date().getFullYear()} {STORE.name} · {STORE.credit}
        </p>
      </footer>
    </div>
  );
}