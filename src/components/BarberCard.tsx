import { Barber } from "@/lib/types";

function getInitials(name: string) {
   return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
}

export default function BarberCard({ barber }: { barber: Barber }) {
   return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
         <div className="h-56 bg-gray-200">
            {barber.photo_url ? (
               <img
                  src={barber.photo_url}
                  alt={barber.name}
                  loading="lazy"
                  className="h-56 w-full object-cover"
               />
            ) : (
               <div className="flex h-56 items-center justify-center text-4xl font-bold text-gray-400">
                  {getInitials(barber.name)}
               </div>
            )}
         </div>

         <div className="p-4">
            <h3 className="font-semibold text-gray-900">{barber.name}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {barber.title}
            </p>
            {barber.bio && (
               <p className="mt-2 text-sm leading-relaxed text-gray-600">
                 {barber.bio}
               </p>
            )}
         </div>
      </div>
   );
}