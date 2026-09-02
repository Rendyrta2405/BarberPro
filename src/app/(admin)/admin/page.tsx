import { CalendarCheck, Wallet, Hourglass, Crown } from "lucide-react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminBookingCard from "@/components/AdminBookingCard";
import StatCard from "@/components/StatCard";
import { formatRupiah } from "@/lib/format";

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
      .order("starts_at", { ascending: false });

   if (error) {
      return 
         <p className="text-red-500">
            Gagal memuat booking: {error.message}
         </p>;
   }

   const all = bookings ?? [];

   // ---------- STATISTIK ----------

   // "Hari ini" menurut zona waktu SALON (WIB), bukan zona waktu server.
   const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
   });
   const dayStart = new Date(`${today}T00:00:00+07:00`).getTime();
   const dayEnd = new Date(`${today}T23:59:59+07:00`).getTime();

   const todayBookings = all.filter((b) => {
      const t = new Date(b.starts_at).getTime();
      return t >= dayStart && t <= dayEnd;
   });

   const activeToday = todayBookings.filter((b) => b.status !== "cancelled");

   const revenueToday = activeToday.reduce(
      (total, b) => total + (b.services?.price ?? 0),
      0
   );

   const pendingCount = all.filter((b) => b.status === "pending").length;

   // Barber tersibuk (semua waktu, booking tidak batal)
   const counts = new Map<string, number>();
   for (const b of all) {
      if (b.status === "cancelled") continue;
      const name = b.barbers?.name ?? "Tanpa Nama";
      counts.set(name, (counts.get(name) ?? 0) + 1);
   }

   let busiest = "-";
   let busiestCount = 0;
   for (const [name, count] of counts) {
      if (count > busiestCount) {
         busiest = name;
         busiestCount = count;
      }
   }

   // ---------- RENDER ----------
   
     return (
    <section>
      <p className="eyebrow">Ringkasan</p>
      <h1 className="font-display mt-2 text-3xl font-semibold">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Booking Hari Ini"
          value={String(todayBookings.length)}
          icon={<CalendarCheck size={18} />}
        />
        <StatCard
          label="Estimasi Pendapatan"
          value={formatRupiah(revenueToday)}
          icon={<Wallet size={18} />}
        />
        <StatCard
          label="Menunggu Konfirmasi"
          value={String(pendingCount)}
          icon={<Hourglass size={18} />}
        />
        <StatCard
          label="Barber Tersibuk"
          value={busiest}
          sub={`${busiestCount} booking`}
          icon={<Crown size={18} />}
        />
      </div>

      <h2 className="font-display mt-10 mb-4 text-xl font-semibold">Semua Booking</h2>

      {all.length === 0 ? (
        <p className="text-cream/50">Belum ada booking masuk.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {all.map((booking) => (
            <AdminBookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </section>
  );
}