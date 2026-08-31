"use client";

import { useState } from "react";
import { Barber, Service, WorkingHour } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import BookingForm from "@/components/BookingForm";
import {
  generateSlots,
  filterPastSlots,
  timeToMinutes,
  minutesToTime,
} from "@/lib/slots";

interface BookingClientProps {
   services: Service[];
   barbers: Barber[];
   workingHours: WorkingHour[];
}

export default function BookingClient({ 
   services, 
   barbers,
   workingHours,
}: BookingClientProps) {
   const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
   const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null);
   const [selectedDate, setSelectedDate] = useState("");
   const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
   
   const today = new Date().toLocaleDateString("en-CA");

   const selectedService = services.find((s) => s.id === selectedServiceId);
   const selectedBarber = barbers.find((b) => b.id === selectedBarberId);

   const weekday = selectedDate
      ? new Date(`${selectedDate}T00:00:00`).getDay()
      : null;

   const workingHour = workingHours.find(
      (wh) => wh.barber_id === selectedBarberId && wh.weekday === weekday
   );

   let slots: number[] = [];
   if (workingHour && selectedService) {
      slots = generateSlots(
         timeToMinutes(workingHour.start_time),
         timeToMinutes(workingHour.end_time),
         selectedService.duration
      );
      slots = filterPastSlots(slots, selectedDate);
   }
   
   function chooseService(id: number) {
      setSelectedServiceId(id);
      setSelectedSlot(null);
   }

   function chooseBarber(id: number) {
      setSelectedBarberId(id);
      setSelectedSlot(null);
   }

   function chooseDate(value: string) {
      setSelectedDate(value);
      setSelectedSlot(null);
   }

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
                     onClick={() => chooseService(service.id)}
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
                        onClick={() => chooseBarber(barber.id)}
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
               onChange={(event) => chooseDate(event.target.value)}
               className="mt-3 w-full rounded-xl border-2 border-gray-200 bg-white p-3"
            />
         </section>

         {selectedService && selectedBarber && selectedDate && (
            <section>
               <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                  4. Pilih Jam
               </h2>

               {workingHour ? (
                  slots.length > 0 ? (
                     <div className="mt-3 grid grid-cols-4 gap-2">
                        {slots.map((slot) => {
                           const isSelected = slot === selectedSlot;
                           return (
                              <button
                                 key={slot}
                                 type="button"
                                 onClick={() => setSelectedSlot(slot)}
                                 className={`rounded-lg border-2 py-2 text-sm font-semibold transition ${
                                 isSelected
                                   ? "border-gray-900 bg-gray-900 text-white"
                                   : "border-gray-200 bg-white"
                               }`}
                              >
                                 {minutesToTime(slot)}
                              </button>
                           );
                        })}
                     </div>
                  ) : (
                     <p className="mt-3 text-sm text-gray-500">
                      Tidak ada jam tersedia di tanggal ini.
                    </p>
                  )
               ) : (
                  <p className="mt-3 text-sm text-gray-500">
                    {selectedBarber.name} libur di hari ini.
                  </p>
               )}
            </section>
         )}

         {selectedService && selectedBarber && selectedDate && selectedSlot !== null && (
            <BookingForm
               serviceId={selectedService.id}
               barberId={selectedBarber.id}
               serviceName={selectedService.name}
               barberName={selectedBarber.name}
               date={selectedDate}
               slotMinutes={selectedSlot}
            />
         )}
      </div>
   );
}
