"use server";

import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { minutesToTime } from "@/lib/slots";
import { sendBookingConfirmation } from "@/lib/email";
import { sendWhatsAppToAdmin, buildBookingMessage } from "@/lib/whatsapp";

const bookingSchema = z.object({
   serviceId: z.number(),
   barberId: z.number(),
   date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
   slotMinutes: z.number().int().min(0).max(23 * 60 + 59),
   customerName: z.string().trim().min(3),
   customerPhone: z.string().regex(/^\+628\d{8,11}$/),
   customerEmail: z.string().trim().regex(/^\S+@\S+\.\S+$/),
   customerNotes: z.string().trim().max(300),
});

export type BookingInput = z.infer<typeof bookingSchema>;

function minutesToIso(date: string, minutes: number): string {
   const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
   const mm = String(minutes % 60).padStart(2, "0");
   return `${date}T${hh}:${mm}:00+07:00`;
}

export async function createBooking(input: BookingInput) {
   const parsed = bookingSchema.safeParse(input);

   if (!parsed.success) {
      return {
         ok: false as const,
         message: "Data tidak valid. Periksa kembali form kamu.",
      };
   }

   const data = parsed.data;

   const [serviceResult, barberResult] = await Promise.all([
      supabase.from("services").select("name, duration").eq("id", data.serviceId).single(),
      supabase.from("barbers").select("name").eq("id", data.barberId).single(),
   ]);

   const service = serviceResult.data;
   const barber = barberResult.data;

   if (!service || !barber) {
      return { ok: false as  const, message: "Layanan atau barber tidak ditemukan." };
   }

   const { error } = await supabase.from("bookings").insert({
      service_id: data.serviceId,
      barber_id: data.barberId,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      customer_email: data.customerEmail,
      customer_notes: data.customerNotes === "" ? null : data.customerNotes,
      starts_at: minutesToIso(data.date, data.slotMinutes),
      ends_at: minutesToIso(data.date, data.slotMinutes + service.duration),
      status: "pending",
   });

   if (error) {
      if (error.code === "23P01") { 
         // 23P01 → exclusion constraint dilanggar → slot bentrok
         return {
            ok: false as const,
            message: "Slot ini baru saja diambil orang lain. Silahkan pilih jam lain"
         };
      }

      if (error.code === "42501") { 
         // RLS menolak → tidak ada policy yang mengizinkan
         return {
            ok: false as const,
            message: "Ditolak oleh kebijakan keamanan database (RLS)"
         };
      }

      return { ok: false as const, message: "Gagal menyimpan booking. Coba lagi" };
   }

   const [emailResult, waResult] = await Promise.allSettled([
      sendBookingConfirmation({
         toEmail: data.customerEmail,
         customerName: data.customerName,
         serviceName: service.name,
         barberName: barber.name,
         date: data.date,
         timeLabel: minutesToTime(data.slotMinutes),
      }),
      sendWhatsAppToAdmin(
         buildBookingMessage({
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerNotes: data.customerNotes,
            serviceName: service.name,
            barberName: barber.name,
            date: data.date,
            timeLabel: minutesToTime(data.slotMinutes),
         })
      ),
   ]);

   const emailOk = emailResult.status === "fulfilled";
   const waOk = waResult.status === "fulfilled";

   const lines = [
      "Booking berhasil!",
      emailOk ? "Email konfirmasi terkirim." : null,
      waOk ? "Admin sudah diberitahu via whatsapp." : null,
      (!emailOk || !waOk) ? "(Sebagian notifikasi gagal — booking tetap aman.)" : null
   ];
   
   // Membuang nilai null/kosong dan menggabungkannya dengan enter
   const message = lines.filter(Boolean).join("\n");
   
   return { ok: true as const, message };
}

export async function getBookedSlots(barberId: number, date: string) {
   const idOk = z.number().safeParse(barberId).success;
   const dateOk = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).safeParse(date).success;

   if (!idOk || !dateOk) return [];

   const startIso = `${date}T00:00:00+07:00`;
   const endIso = `${date}T23:59:59+07:00`;

   const { data, error } = await supabase.rpc("get_booked_slots", {
      p_barber_id: barberId,
      p_from: startIso,
      p_to: endIso,
   });

   if (error || !data) return [];

   return data.map((b: { starts_at: string; ends_at: string }) => ({
      startMinutes: isoToMinutes(b.starts_at),
      endMinutes: isoToMinutes(b.ends_at),
   }));
}

function isoToMinutes(iso: string): number {
   const d = new Date(iso);
   const hours = (d.getUTCHours() + 7) % 24;
   return hours * 60 + d.getUTCMinutes();
}