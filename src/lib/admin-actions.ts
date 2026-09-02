"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { z } from "zod";
import { sendBookingEmail } from "@/lib/email";
import { sendWhatsAppToAdmin } from "@/lib/whatsapp";

const statusSchema = z.enum(["pending", "confirmed", "done", "cancelled"]);

export async function updateBookingStatus(bookingId: number, newStatus: string) {
   const supabase = await createSupabaseServerClient();

   // Cek ganda di server: apakah yang memanggil benar-benar admin? 
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) {
      return { ok: false as const, message: "Kamu harus login." };
   }

   // Validasi status dengan Zod
   const parsed = statusSchema.safeParse(newStatus);
   if (!parsed.success) {
      return { ok: false as const, message: "Status tidak valid" };
   }

   // Update ke database
   const { error } = await supabase
      .from("bookings")
      .update({ status: parsed.data })
      .eq("id", bookingId);

     if (error) {
       return { 
          ok: false as const, 
          message: "Gagal update status." 
       };
     }

  // ---- kirim notifikasi email ke customer (isolated: gagal ≠ gagal update) ----
    try {
       const { data: booking } = await supabase
         .from("bookings")
         .select("customer_name, customer_email, starts_at, services(name), barbers(name)")
         .eq("id", bookingId)
         .single();
   
       if (booking) {
         const d = new Date(booking.starts_at);
         const dateLabel = d.toLocaleDateString("id-ID", {
           weekday: "long",
           day: "numeric",
           month: "long",
           year: "numeric",
           timeZone: "Asia/Jakarta",
         });
         const timeLabel = d.toLocaleTimeString("id-ID", {
           hour: "2-digit",
           minute: "2-digit",
           timeZone: "Asia/Jakarta",
         });
   
         const serviceName = Array.isArray(booking.services)
           ? booking.services[0]?.name ?? "Layanan"
           : (booking.services as any)?.name ?? "Layanan";
   
         const barberName = Array.isArray(booking.barbers)
           ? booking.barbers[0]?.name ?? "Barber"
           : (booking.barbers as any)?.name ?? "Barber";
   
         await sendBookingEmail({
           toEmail: booking.customer_email,
           customerName: booking.customer_name,
           serviceName,
           barberName,
           date: dateLabel,
           timeLabel,
           status: parsed.data as "pending" | "confirmed" | "done" | "cancelled",
         });
          
         await sendWhatsAppToAdmin(
        `🔄 STATUS BERUBAH\n\nBooking ${booking.customer_name} (${serviceName})\nStatus baru: ${parsed.data.toUpperCase()}`
      );
       }
     } catch {
       // Email gagal ≠ update gagal
     }

  revalidatePath("/admin");
  return { ok: true as const };
}