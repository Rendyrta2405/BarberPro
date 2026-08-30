import Link from "next/link";

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
     </section>
  );
}
