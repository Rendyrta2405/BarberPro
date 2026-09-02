import type { ReactNode } from "react";
import Link from "next/link";

export default function MarketingLayout({ children }: { children: ReactNode }) {
   return (
      <div className="min-h-screen">
         <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
               <Link href="/" className="text-xl font-extrabold tracking-tight">
                BarberPro
               </Link>

               <nav className="flex items-center gap-5 text-sm font-medium text-gray-600">
                  <a href="#layanan" className="hidden sm:block">
                    Layanan
                  </a>
                  <a href="#barber" className="hidden sm:block">
                    Barber
                  </a>
                  <Link
                    href="/booking"
                    className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white"
                  >
                    Booking Sekarang
                  </Link>
               </nav>
            </div>
         </header>

         {children}

         <footer className="border-t border-gray-200 bg-white text-center">
           <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-500">
             <p className="font-bold text-gray-800">BarberPro</p>
             <p className="mt-1">
               © {new Date().getFullYear()} BarberPro — Dibuat dengan Next.js, Supabase, dan ☕
             </p>
           </div>
         </footer>
      </div>
   );
}