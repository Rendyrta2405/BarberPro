// =====================================================
// STORE = kartu identitas toko.
// Saat memasang sistem untuk toko baru (trial maupun bayar),
// CUKUP file ini yang diubah teksnya untuk urusan merek.
// Database dan .env mengurus urusan data & kunci rahasia.
// =====================================================

export const STORE = {
   // Nama toko: muncul di tab browser, header, dan subjek email.
   name: "BarberPro",

   // Janji singkat yang menempel pada nama.
   tagline: "Barbershop Premium, Booking Tanpa Antre",

   // Nama pengirim email konfirmasi.
   // Alamat emailnya tetap barberpro@mail.rrdevs.my.id (sudah terverifikasi Resend);
   // yang mengikuti nama toko hanya "nama pengirim"-nya.
   fromName: "BarberPro",

   // Baris kredit kecil di footer: jujur sekaligus iklan berjalan.
   credit: "Didukung BarberPro System oleh RR Devs",
   
   // Logo header dua warna: bagian polos + bagian emas.
   // Trial "Tamaro Barber Studio" misalnya: logoPlain "Tamaro", logoAccent "Barber Studio".
   logoPlain: "Barber",
   logoAccent: "Pro",
} as const;