import Link from "next/link";

export default function BottomNav() {
   return (
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-white">
         <div className="mx-auto flex h-16 max-w-md">
            <Link
               href="/"
               className="flex flex-1 items-center justify-center text-sm font-semibold text-gray-700" 
            >
               Home
            </Link>
            <Link
               href="/booking"
               className="flex flex-1 items-center justify-center text-sm font-semibold text-gray-700"
            >
               Booking
            </Link>
         </div>
      </nav>
   );
}