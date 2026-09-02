import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
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
    default: "BarberPro — Barbershop Premium, Booking Tanpa Antre",
    template: "%s · BarberPro",
  },
  description:
    "Kesan pertama dimulai dari rambut yang rapi. Booking barber favoritmu dalam satu menit.",
   openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://barberpro.rrdevs.my.id",
    siteName: "BarberPro",
    title: "BarberPro — Barbershop Premium, Booking Tanpa Antre",
    description:
      "Kesan pertama dimulai dari rambut yang rapi. Booking barber favoritmu dalam satu menit.",
    images: [
      {
        url: "https://barberpro.rrdevs.my.id/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BarberPro — Barbershop Premium, Booking Tanpa Antrep",
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