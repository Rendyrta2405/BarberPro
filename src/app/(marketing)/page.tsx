import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import BarberCard from "@/components/BarberCard";
import { getActiveServices, getActiveBarbers } from "@/lib/queries";

export const metadata = {
   title: "BarberPro — Barbershop Modern, Booking Tanpa Antre",
   description: "Pilih layanan, pilih barber, pilih jam. Booking dalam satu menit.",
};

export default async function HomePage() {
  //  Fetch Multi Tabel dengan Promise.all
  const [servicesResult, barbersResult] = await Promise.all([
     getActiveServices(),
     getActiveBarbers(),
   ]);

   const services = servicesResult.data;
   const barbers = barbersResult.data;
   
  return (
     <main>
        <section className="bg-gray-900 text-white">
           <div className="mx-auto max-w-5xl px-4 py-20 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Barbershop Modern
              </p>
              <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
                Tampil Rapi, Tanpa Antre.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-gray-300">
                  BarberPro membawa pengalaman barbershop ke era digital: pilih layanan, pilih barber favoritmu, dan amankan jam kamu dalam satu menit.
              </p>
              <Link
               href="/booking"
               className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-bold text-gray-900"
             >
                Booking Sekarang
              </Link>
           </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16">
           <h2 className="text-center text-2xl font-extrabold text-gray-900">
             Visi & Misi
           </h2>
           <div className="mt-8 grid gap-4 sm:grid-cols-2">
             <div className="rounded-2xl border border-gray-200 bg-white p-6">
               <h3 className="font-bold text-gray-900">Visi</h3>
               <p className="mt-2 text-sm leading-relaxed text-gray-600">
                 Menjadi barbershop paling terpercaya di kota — tempat setiap
                 pelanggan keluar dengan rapi dan percaya diri.
               </p>
             </div>
             <div className="rounded-2xl border border-gray-200 bg-white p-6">
               <h3 className="font-bold text-gray-900">Misi</h3>
               <p className="mt-2 text-sm leading-relaxed text-gray-600">
                 Tanpa antre dengan booking online, barber terlatih dan
                 bersertifikat, harga transparan tanpa kejutan.
               </p>
             </div>
           </div>
         </section>

        <section id="layanan" className="bg-gray-100 py-16">
           <div className="mx-auto max-w-5xl px-4">
              <h2 className="text-center text-2xl font-extrabold text-gray-900">
                Layanan Kami
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                 {services.map((service) => (
                    <ServiceCard key={service.id} 
                       service={service} 
                    />
                 ))}
              </div>
           </div>
        </section>

        <section id="barber" className="mx-auto max-w-5xl px-4 py-16">
           <h2 className="text-center text-2xl font-extrabold text-gray-900">
             Tim Barber
           </h2>
           <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {barbers.map((barber) => (
                 <BarberCard
                    key={barber.id}
                    barber={barber}
                 />
              ))}
           </div>
        </section>

        <section className="bg-gray-900 py-16 text-center text-white">
           <h2 className="text-2xl font-extrabold">Siap tampil rapi?</h2>
           <p className="mt-2 text-gray-300">
             Kursi terbaik cepat terisi. Amankan punyamu sekarang.
           </p>
           <Link
             href="/booking"
             className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-bold text-gray-900"
           >
             Booking Sekarang
           </Link>
        </section>
     </main>
  );
}
