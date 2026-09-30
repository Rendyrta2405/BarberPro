"use client";

import { useEffect, useState } from "react";
import { Barber, Service, WorkingHour } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import {
  generateSlots,
  filterPastSlots,
  timeToMinutes,
  minutesToTime,
} from "@/lib/slots";
import { getBookedSlots } from "@/lib/booking-actions";
import BookingForm from "@/components/BookingForm";

interface BookedRange {
  startMinutes: number;
  endMinutes: number;
}

interface BookingClientProps {
  services: Service[];
  barbers: Barber[];
  workingHours: WorkingHour[];
}

function isSlotTaken(slot: number, duration: number, ranges: BookedRange[]) {
  const slotEnd = slot + duration;
  return ranges.some((r) => slot < r.endMinutes && slotEnd > r.startMinutes);
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
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dateNote, setDateNote] = useState("");

  // Ambil tanggal hari ini
  const todayObj = new Date();
  const today = todayObj.toLocaleDateString("en-CA");

  // Tambah 60 hari dengan memanipulasi objek tanggal secara murni
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 60);
  const maxDate = maxDateObj.toLocaleDateString("en-CA");
   
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

  useEffect(() => {
    if (!selectedBarberId || !selectedDate) {
      return;
    }

    let cancelled = false;

    getBookedSlots(selectedBarberId, selectedDate).then((ranges) => {
      if (!cancelled) setBookedRanges(ranges);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedBarberId, selectedDate, refreshKey]);

  const validSelectedSlot =
    selectedSlot !== null &&
    selectedService !== undefined &&
    !isSlotTaken(selectedSlot, selectedService.duration, bookedRanges)
      ? selectedSlot
      : null;

  function chooseService(id: number) {
    setSelectedServiceId(id);
    setSelectedSlot(null);
  }

  function chooseBarber(id: number) {
    setSelectedBarberId(id);
    setSelectedSlot(null);
  }

  function chooseDate(value: string) {
    if (value < today || value > maxDate) {
       setDateNote("Booking hanya bisa sampai 60 hari ke depan. Coba pilih tanggal lain");
       return;
    };

    setDateNote("");
    setSelectedDate(value);
    setSelectedSlot(null);
  }

  // Benarkah SEMUA slot di tanggal ini sudah terisi?
  const allTaken =
     selectedService !== undefined &&
     slots.length > 0 &&
     slots.every((slot) => isSlotTaken(slot, selectedService.duration, bookedRanges));

  return (
    <div>
      <header className="mb-8">
        <p className="eyebrow">Booking</p>
        <h1 className="title-display mt-2">Amankan Kursimu</h1>
        <p className="mt-3 text-ink/60">
          Empat langkah cepat — selesai dalam 1 menit.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* ------- kolom kiri: langkah 1-4 ------- */}
        <div className="space-y-10">
          <section>
            <h2 className="eyebrow">1 · Pilih Layanan</h2>
            <div className="mt-4 space-y-3">
              {services.map((service) => {
                const isSelected = service.id === selectedServiceId;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => chooseService(service.id)}
                    className={`w-full rounded-2xl border-2 bg-white p-4 text-left transition relative ${
                      isSelected
                        ? "border-gold shadow-[0_0_0_4px_rgb(201_162_75/0.15)]"
                        : "border-line hover:border-ink/30"
                    }`}
                  >
                   {service.badge && (
                       <span className="absolute -top-2 -right-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ink shadow">
                         {service.badge}
                       </span>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-display font-semibold">{service.name}</span>
                      <span className="text-sm font-bold text-gold">
                        {formatRupiah(service.price)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink/50">
                      ± {service.duration} menit
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="eyebrow">2 · Pilih Barber</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {barbers.map((barber) => {
                const isSelected = barber.id === selectedBarberId;
                return (
                  <button
                    key={barber.id}
                    type="button"
                    onClick={() => chooseBarber(barber.id)}
                    className={`rounded-2xl border-2 bg-white p-4 text-center transition ${
                      isSelected
                        ? "border-gold shadow-[0_0_0_4px_rgb(201_162_75/0.15)]"
                        : "border-line hover:border-ink/30"
                    }`}
                  >
                    <span className="block font-display font-semibold">
                      {barber.name}
                    </span>
                    <span className="mt-1 block text-xs font-bold uppercase tracking-widest text-gold">
                      {barber.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="eyebrow">3 · Pilih Tanggal</h2>
            <input
              type="date"
              value={selectedDate}
              min={today}
              max={maxDate}
              onChange={(event) => chooseDate(event.target.value)}
              className="input-premium mt-4"
            />
            {dateNote && <p className="mt-2 text-xs text-red-600">{dateNote}</p>}
          </section>

          {selectedService && selectedBarber && selectedDate && (
            <section>
              <h2 className="eyebrow">4 · Pilih Jam</h2>

              {workingHour ? (
                slots.length > 0 ? (
                   <>
                     <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                       {slots.map((slot) => {
                         const taken = isSlotTaken(
                           slot,
                           selectedService.duration,
                           bookedRanges
                         );
                         const isSelected = slot === selectedSlot;
                         return (
                           <button
                             key={slot}
                             type="button"
                             disabled={taken}
                             onClick={() => setSelectedSlot(slot)}
                             className={`rounded-xl border-2 py-2 text-sm font-bold transition ${
                               taken
                                 ? "cursor-not-allowed border-line bg-ink/5 text-ink/30"
                                 : isSelected
                                   ? "border-gold bg-gold text-ink"
                                   : "border-line bg-white hover:border-ink/30"
                             }`}
                           >
                              <span className={taken ? "line-through" : ""}>
                                {minutesToTime(slot)}
                              </span>
                              {taken && (
                                 <span className="mt-0.5 block text-[9px] font-semibold tracking-widest">TERISI</span>
                              )}
                           </button>
                         );
                       })}
                     </div>
                      {allTaken && (
                         <p className="mt-3 text-sm text-ink/50">
                           Semua jam di tanggal ini sudah di booking. Coba tanggal lain atau kapster lain.
                         </p>
                      )}
                   </>
                ) : (
                  <p className="mt-4 text-sm text-ink/50">
                     {selectedDate === today
                        ? "Jam operasional hari ini sudah berakhir. Silakan pilih tanggal lain."
                        : "Jam operasional untuk tanggal ini belum diatur. Silakan pilih tanggal lain atau hubungi kami."}
                   </p>
                )
              ) : (
                <p className="mt-4 text-sm text-ink/50">
                  {selectedBarber.name} libur di hari ini. Pilih barber lain atau tanggal lain.
                </p>
              )}
            </section>
          )}
        </div>

        {/* ------- kolom kanan: ringkasan + form (sticky di desktop) ------- */}
        <div className="lg:sticky lg:top-24">
          <BookingForm
            complete={Boolean(
              selectedService && selectedBarber && selectedDate && validSelectedSlot !== null
            )}
            serviceId={selectedService?.id ?? 0}
            barberId={selectedBarber?.id ?? 0}
            serviceName={selectedService?.name ?? ""}
            barberName={selectedBarber?.name ?? ""}
            date={selectedDate}
            slotMinutes={validSelectedSlot ?? 0}
            onBooked={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      </div>
    </div>
  );
}