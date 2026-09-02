import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminBookingCard from "@/components/AdminBookingCard";

export default async function AdminPage() {
   const supabase = await createSupabaseServerClient();
   const { data: { user } } = await supabase.auth.getUser();

   if (!user) {
      redirect("/admin/login");
   }

   // Relational Query: Join tabel bookings, services, dan barbers 
   const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*, services(name), barbers(name)")
      .order("starts_at", { ascending: false });

   if (error) {
      return 
         <p className="text-red-500">
            Gagal memuat booking: {error.message}
         </p>;
   }

   if (!bookings || bookings.length === 0) {
      return (
         <section>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="mt-4 text-gray-500">
               Belum ada booking masuk.
            </p>
         </section>
      );
   }
   
   return (
      <section>
         <h1 className="mb-4 text-2xl font-bold">Dashboard Booking</h1>
         <div className="space-y-4">
            {bookings.map((booking) => (
               <AdminBookingCard key={booking.id} 
                  booking={booking} 
               />
            ))}
         </div>
      </section>
   );
}