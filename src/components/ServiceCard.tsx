import { Service } from "@/lib/types";

export default function ServiceCard({ service }: { service: Service }) {
   // Format angka jadi format mata uang Rupiah
   const formattedPrice = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
   }).format(service.price);

   return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
         <div className="flex items-start justify-between gap-3"> 
            <div className="flex-1">
               <h3 className="font-semibold text-gray-900">{service.name}</h3>
               <p className="mt-1 text-sm text-gray-500">{service.description}</p>
               <p className="mt-2 text-xs text-gray-400">
                  Durasi: {service.duration} menit
               </p>
            </div>

            <div className="text-right">
               <p className="text-base font-bold text-gray-900">{formattedPrice}</p>
            </div>
         </div>
      </div>
   );
}