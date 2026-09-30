import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminBookingsTable from "@/components/AdminBookingsTable";
import { type BookingRow } from "@/lib/types";

export default async function AdminPage() {
   const supabase = await createSupabaseServerClient();
   const { data: { user } } = await supabase.auth.getUser();

   if (!user) {
      redirect("/admin/login");
   }

   // Relational Query: Join tabel bookings, services, dan barbers 
   const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*, services(name, price), barbers(name)")
      .order("starts_at", { ascending: true })
      .order("id", { ascending: true });

   if (error) {
      return <p className="text-red-500">
            Gagal memuat booking: {error.message}
         </p>;
   }

   const all = bookings ?? [];

   // ---------- RENDER ----------
   
  return (
    <section>
      <AdminBookingsTable initialBookings={(all ?? []) as BookingRow[]} />
    </section>
  );
}