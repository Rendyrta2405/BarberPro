import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import BottomNav from "@/components/BottomNav";

export default function PublicLayout({ children }: { children: ReactNode }) {
   return (
      <div className="min-h-screen">
         <SiteHeader />
         <main className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
            {children}
         </main>
         <BottomNav />
      </div>
   );
}