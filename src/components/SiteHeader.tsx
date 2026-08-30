import Link from "next/link";

export default function SiteHeader() {
   return (
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
         <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
            <Link href="/" className="text-lg font-extrabold tracking-tight">
               BarberPro
            </Link>
            <span className="text-xs text-gray-500">Booking Salon</span>
         </div>
      </header>
   )
}