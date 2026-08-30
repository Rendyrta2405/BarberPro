import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BarberPro",
  description: "Sistem booking salon dan barbershop.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
   return (
      <html lang="id">
         <body className="bg-gray-50 text-gray-900 antialiased">
            {children}
         </body>
      </html>
   );
}