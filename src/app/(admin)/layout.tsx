import type { ReactNode } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { STORE } from "@/lib/data";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
   
  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="sticky top-0 z-20 border-b border-cream/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/admin" className="font-display text-lg font-bold">
            {STORE.logoPlain}<span className="text-gold">{STORE.logoAccent}</span>
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
            {user && <LogoutButton />}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}