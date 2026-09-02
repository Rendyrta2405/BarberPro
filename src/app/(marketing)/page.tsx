import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import BarberCard from "@/components/BarberCard";
import { getActiveServices, getActiveBarbers } from "@/lib/queries";

const testimonials = [
  {
    name: "Raka, pelanggan tetap",
    quote:
      "Dulu buang 45 menit cuma untuk antre. Sekarang saya booking dari kantor, datang, langsung duduk. Rasanya seperti punya barber pribadi.",
  },
  {
    name: "Yudha, karyawan swasta",
    quote:
      "Fade pertama yang benar-benar simetris dalam hidup saya. Andi tahu persis apa yang cocok sebelum saya selesai menjelaskan.",
  },
  {
    name: "Sari, ibu dua anak",
    quote:
      "Anak saya rewel kalau cukur. Dimas sabar luar biasa — sekarang cukur rambut jadi acara yang ditunggu, bukan ditakuti.",
  },
];

export default async function LandingPage() {
  const [servicesResult, barbersResult] = await Promise.all([
    getActiveServices(),
    getActiveBarbers(),
  ]);

  const services = servicesResult.data;
  const barbers = barbersResult.data;

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-ink text-cream">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=60"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-28 text-center sm:py-36">
          <p className="eyebrow animate-fade-up">Barbershop Premium · Sejak 2016</p>
          <h1 className="title-display animate-fade-up anim-delay-1 mx-auto mt-5 max-w-3xl text-4xl sm:text-6xl">
            Kesan Pertama Dimulai dari Rambut yang Rapi.
          </h1>
          <p className="animate-fade-up anim-delay-2 mx-auto mt-6 max-w-xl text-cream/70">
            Tanpa antre. Tanpa tebak-tebakan. Pilih barber favoritmu,
            amankan jam kamu, dan duduk di kursi dengan percaya diri.
          </p>
          <div className="animate-fade-up anim-delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/booking" className="btn-gold">
              Amankan Kursimu
            </Link>
            <a href="#layanan" className="btn-outline-light">
              Lihat Layanan
            </a>
          </div>

          <div className="animate-fade-up anim-delay-3 mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-cream/10 pt-8">
            <div>
              <p className="font-display text-2xl font-bold text-gold sm:text-3xl">12rb+</p>
              <p className="mt-1 text-xs text-cream/60">potongan selesai</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-gold sm:text-3xl">4.9/5</p>
              <p className="mt-1 text-xs text-cream/60">rating pelanggan</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-gold sm:text-3xl">10 thn</p>
              <p className="mt-1 text-xs text-cream/60">pengalaman</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LAYANAN ============ */}
      <section id="layanan" className="section">
        <div className="text-center">
          <p className="eyebrow">Layanan Signature</p>
          <h2 className="title-display mt-3">Pilih Ritualmu</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/60">
            Setiap layanan dikerjakan dengan alat steril dan standar higienis
            tinggi — karena kepalamu layak mendapat yang terbaik.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* ============ CARA KERJA ============ */}
      <section className="bg-ink py-20 text-cream sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="eyebrow">Cara Kerja</p>
            <h2 className="title-display mt-3">Tiga Langkah ke Rambut Rapi</h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-cream/10 p-6">
              <p className="font-display text-4xl font-bold text-gold">01</p>
              <h3 className="mt-4 font-bold">Pilih Layanan & Barber</h3>
              <p className="mt-2 text-sm text-cream/60">
                Kenali gaya tiap barber lewat profilnya, lalu pilih yang
                paling cocok dengan seleramu.
              </p>
            </div>
            <div className="rounded-2xl border border-cream/10 p-6">
              <p className="font-display text-4xl font-bold text-gold">02</p>
              <h3 className="mt-4 font-bold">Amankan Jam Kamu</h3>
              <p className="mt-2 text-sm text-cream/60">
                Slot real-time: yang kamu lihat, itu yang kamu dapat.
                Konfirmasi langsung masuk ke HP dan emailmu.
              </p>
            </div>
            <div className="rounded-2xl border border-cream/10 p-6">
              <p className="font-display text-4xl font-bold text-gold">03</p>
              <h3 className="mt-4 font-bold">Datang & Tampil Percaya Diri</h3>
              <p className="mt-2 text-sm text-cream/60">
                Tanpa antre, tanpa menunggu. Kursi dan barber sudah
                menunggumu tepat waktu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BARBER ============ */}
      <section id="barber" className="section">
        <div className="text-center">
          <p className="eyebrow">Tim Barber</p>
          <h2 className="title-display mt-3">Tangan-Tangan Terpercaya</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/60">
            Bukan sekadar tukang cukur — mereka konsultan penampilanmu.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {barbers.map((barber) => (
            <BarberCard key={barber.id} barber={barber} />
          ))}
        </div>
      </section>

      {/* ============ TESTIMONI ============ */}
      <section id="testimoni" className="bg-ink py-20 text-cream sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="eyebrow">Testimoni</p>
            <h2 className="title-display mt-3">Kata Mereka yang Sudah Duduk di Kursi</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-cream/10 p-6">
                <p className="text-gold">★★★★★</p>
                <blockquote className="mt-4 text-sm leading-relaxed text-cream/80">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 text-xs font-bold uppercase tracking-widest text-cream/50">
                  {t.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA AKHIR ============ */}
      <section className="section text-center">
        <p className="eyebrow">Jangan Tunda</p>
        <h2 className="title-display mt-3">Kursi Terbaik Cepat Terisi.</h2>
        <p className="mx-auto mt-4 max-w-xl text-ink/60">
          Jangan biarkan penampilanmu menunggu. Booking sekarang —
          rapi dalam satu jam, percaya diri sepanjang minggu.
        </p>
        <Link href="/booking" className="btn-gold mt-8">
          Booking Sekarang
        </Link>
      </section>
    </main>
  );
}