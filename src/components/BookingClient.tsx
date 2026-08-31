"use client";

import { useState } from "react";
import { Barber, Service } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

interface BookingClientProps {
   services: Service[];
   barbers: Barber[];
}

export default function BookingClient({ services, barbers }: BookingClientProps) {
   const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
   const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
   const [selectedDate, setSelectedDate] = useState("");

   const today = new Date().toLocaleDateString("en-CA");

   const selectedService = services.find((s) => s.id === selectedServiceId);
   const selectedBarber = barbers.find((b) => b.id === selectedBarberId);

   return (
      <div className="space-y-8">
         <header>
            <h1 className="text-2xl font-bold">Booking</h1>
            <p className="mt-1 text-sm text-gray-600">
               Pilih layanan, barber, dan tanggal.
            </p>
         </header>

         <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
              1. Pilih Layanan
            </h2>
            {services.map((service) => {
               const isSelected = service.id === selectedServiceId;

               return (
                  <button
                     key={service.id}
                     type="button"
                     onClick={() => setSelectedServiceId(service.id)}
                     className={`w-full rounded-xl border-2 p-4 text-left transition ${
                        isSelected 
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white"
                     }`}
                  >
                     <div className="flex items-center justify-between">
                        <span className="font-semibold">{service.name}</span>
                        <span className="text-sm font-bold">{formatRupiah(service.price)}</span>
                     </div>
                     <p className="mt-1 text-xs opacity-70">
                        Durasi: {service.duration} menit
                     </p>
                  </button>
               );
            })}
         </section>

         <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                2. Pilih Barber
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
               {barbers.map((barber) => {
                  const isSelected = barber.id === selectedBarberId;

                  return (
                     <button
                        key={barber.id}
                        type="button"
                        onClick={() => setSelectedBarberId(barber.id)}
                        className={`rounded-xl border-2 p-3 text-center transition ${
                           isSelected
                           ? "border-gray-900 bg-gray-900 text-white"
                           : "border-gray-200 bg-white"
                        }`}
                     >
                        <span className="block text-sm font-semibold">{barber.name}</span>
                        <span className="block text-xs opacity-70">{barber.title}</span>
                     </button>
                  );
               })}
            </div>
         </section>

         <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                3. Pilih Tanggal
            </h2>
            <input
               type="date"
               value={selectedDate}
               min={today}
               onChange={(event) => setSelectedDate(event.target.value)}
               className="mt-3 w-full rounded-xl border-2 border-gray-200 bg-white p-3"
            />
         </section>

         {selectedService && selectedBarber && selectedDate && (
            <section className="rounded-xl border border-gray-200 bg-white p-4">
               <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                  Ringkasan
               </h2>
               <p className="mt-2 text-sm">
                  {selectedService.name} dengan {selectedBarber.name} pada {selectedDate}
               </p>
               <p className="mt-1 text-xs text-gray-500"> 
                  Pemilihan jam akan kita bangun di Part 7. 
               </p> 
            </section>
         )}
      </div>
   );
}