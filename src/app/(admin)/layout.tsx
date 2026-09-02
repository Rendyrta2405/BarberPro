import Link from "next/link";
import type { ReactNode } from "react";
import LogoutButton from "@/components/LogoutButton";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminLayout({ children }: { children: ReactNode }) {
   const supabase = await createSupabaseServerClient();
   const { data: { user } } = await supabase.auth.getUser();
   
   return (
      <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6">
         <div className="mb-4 flex items-center justify-between">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Area Admin
            </p>
            {user && (
               <div className="flex gap-3">
                  <Link
                     href="/"
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="rounded-xl bg-gray-900 px-4 py-1 font-semibold text-white"
                  >
                     Lihat Website
                  </Link>
                  <LogoutButton />
               </div>
            )}
         </div>
         {children}
      </main>
   );
}