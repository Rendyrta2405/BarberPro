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
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
            {getInitials(barber.name)}
         </div>
         <div>
            <h3 className="font-semibold text-gray-900">{barber.name}</h3> 

            <p className="text-sm text-gray-500">{barber.title}</p> 
         </div>
      </div>
   );
}