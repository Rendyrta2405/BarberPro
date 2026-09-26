import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { STORE } from "@/lib/data";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: `${STORE.name} — ${STORE.tagline}`,
    template: `%s · ${STORE.name}`,
  },
  description:
    "Kesan pertama dimulai dari rambut yang rapi. Booking barber favoritmu dalam satu menit.",
   openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://barberpro.rrdevs.my.id",
    siteName: `${STORE.name}`,
    title: `${STORE.name} — ${STORE.tagline}`,
    description:
      "Kesan pertama dimulai dari rambut yang rapi. Booking barber favoritmu dalam satu menit.",
    images: [
      {
        url: "https://barberpro.rrdevs.my.id/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${STORE.name} — ${STORE.tagline}`,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" 
       className={`${jakarta.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}