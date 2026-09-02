"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { z } from "zod";

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
      return { ok: false as const, message: "Gagal update status." };
   }

   // Perintah ajaib Next.js: refresh halaman /admin
   revalidatePath("/admin");
   return { ok: true as const };
}