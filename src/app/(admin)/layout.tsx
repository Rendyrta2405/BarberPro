import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
   return (
      <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
         <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
           Area Admin
         </p>
         {children}
      </main>
   );
}