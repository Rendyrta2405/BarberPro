import type { ReactNode } from "react";
import LogoutButton from "@/components/LogoutButton";

export default function AdminLayout({ children }: { children: ReactNode }) {
   return (
      <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
         <div className="mb-4 flex items-center justify-between">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Area Admin
            </p>
            <LogoutButton />
         </div>
         {children}
      </main>
   );
}