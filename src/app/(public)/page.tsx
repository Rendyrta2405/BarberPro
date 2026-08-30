import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { dummyServices } from "@/lib/data";

export default function HomePage() {
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
              {dummyServices.map((service) => (
                 <ServiceCard key={service.id} service={service} />
              ))}
           </div>
        </div>
     </section>
  );
}
