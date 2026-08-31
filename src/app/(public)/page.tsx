import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import BarberCard from "@/components/BarberCard";
import { getActiveServices, getActiveBarbers } from "@/lib/queries";

export default async function HomePage() {
  //  Fetch Multi Tabel dengan Promise.all
  const [servicesResult, barbersResult] = await Promise.all([
     getActiveServices(),
     getActiveBarbers(),
   ]);

   const { data: services, error: servicesError } = servicesResult;
   const { data: barbers, error: barbersError } = barbersResult;

   if (servicesError || barbersError) {   
     return 
        <p className="text-red-500">
           Gagal memuat data. Coba lagi nanti. 
        </p>
   }
   
  return (
     <section>
        <h1 className="text-3xl font-extrabold leading-tight">
           Potong rambut tanpa antre.
        </h1>

        <p className="mt-3 text-gray-600">
           Pilih layanan, pilih barber, pilih jam. Booking dalam satu menit.
        </p>

        <Link
           href="/booking"
           className="mt-6 inline-block w-full rounded-xl bg-gray-900 px-5 py-3 text-center font-semibold text-white">
           Booking Sekarang
        </Link>

        {/* Daftar Layanan */}
        <div className="mt-10">
           <h2 className="text-lg font-bold text-gray-800">Layanan Kami</h2>

           <div className="mt-4 space-y-4">
              {services.map((service) => (
                 <ServiceCard key={service.id} service={service} />
              ))}
           </div>
        </div>

        {/* Daftar Barber */}
        <div className="mt-10">
           <h2 className="text-lg font-bold text-gray-800">Barber Kami</h2>
           {barbers.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">
               Barber belum tersedia. Silakan cek kembali nanti.
             </p>
           ) : (
              <div className="mt-4 space-y-4">
                 {barbers.map((barber) => (
                    <BarberCard key={barber.id} barber={barber} />
                 ))}
              </div>
           )}
        </div>
     </section>
  );
}
