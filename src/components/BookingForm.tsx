"use client";

import { useState, useEffect, useCallback } from "react";
import { isValidIndonesianPhone, normalizePhone } from "@/lib/phone";
import { minutesToTime } from "@/lib/slots";
import { createBooking } from "@/lib/booking-actions";
import Link from "next/link";

interface BookingFormProps {
  complete: boolean;
  serviceId: number;
  barberId: number;
  serviceName: string;
  barberName: string;
  date: string;
  slotMinutes: number;
  onBooked: () => void;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function BookingForm({
  complete,
  serviceId,
  barberId,
  serviceName,
  barberName,
  date,
  slotMinutes,
  onBooked,
}: BookingFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");

  function clearError(field: keyof FormErrors) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (customerName.trim().length < 3) {
      newErrors.name = "Nama minimal 3 karakter.";
    }
    if (!/^\S+@\S+\.\S+$/.test(customerEmail.trim())) {
      newErrors.email = "Email tidak valid. Contoh: nama@gmail.com";
    }
    if (!isValidIndonesianPhone(customerPhone)) {
      newErrors.phone = "Nomor tidak valid. Contoh: 081234567890";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setStatus("loading");

    const result = await createBooking({
      serviceId,
      barberId,
      date,
      slotMinutes,
      customerName: customerName.trim(),
      customerPhone: normalizePhone(customerPhone),
      customerEmail: customerEmail.trim(),
      customerNotes: customerNotes.trim(),
    });

    setStatus(result.ok ? "success" : "error");
    setServerMessage(result.message);

    if (result.ok) onBooked();
  }

  function resetForm() {
     setCustomerName("");
     setCustomerPhone("");
     setCustomerEmail("");
     setCustomerNotes("");
     setErrors({});
     setStatus("idle");
     setServerMessage("");
  }

  const clearServerNote = useCallback(() => {
    if (status === "error") {
      setStatus("idle");
      setServerMessage("");
    }
  }, [status]);

  // Patroli: kalau pilihan dari induk berubah, catatan gagal sudah basi → cabut.
  useEffect(() => {
     const timer = setTimeout(() => {
        clearServerNote();
     }, 0)

     return () => clearTimeout(timer);
  }, [date, slotMinutes, serviceId, barberId, clearServerNote]);

  /* Saat belum lengkap: tampilkan kartu ringkasan "hidup".
     Component tetap MOUNTED (state aman), hanya isinya berbeda. */
  if (!complete && status !== "success") {
    return (
      <section className="card p-5">
        <h2 className="font-display text-lg font-semibold">
           Ringkasan
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li className={serviceName ? "text-ink" : "text-ink/40"}>
            {serviceName || "Pilih layanan"}
          </li>
          <li className={barberName ? "text-ink" : "text-ink/40"}>
            {barberName || "Pilih barber"}
          </li>
          <li className={date ? "text-ink" : "text-ink/40"}>
            {date || "Pilih tanggal"}
          </li>
        </ul>
        <p className="mt-5 rounded-xl bg-ink/5 p-3 text-xs text-ink/50">
          Lengkapi pilihanmu — ringkasan & form akan terbuka di sini.
        </p>
      </section>
    );
  }

  if (status === "success") {
     return (
        <section className="card p-5">
           <h2 className="font-display text-lg font-semibold">
              Booking Berhasil
           </h2>
           <div className="mt-3 rounded-xl bg-emerald-50 p-5 text-sm text-emerald-700 whitespace-pre-line lh-3 text-base/7 tracking-wide"
              dangerouslySetInnerHTML={{ __html: serverMessage }} />

           <button
              type="button"
              onClick={resetForm}
              className="btn-gold mt-4 w-full"
           >
              Buat booking lain
           </button>
           <Link
              href="/"
              className="btn-gold mt-4 w-full text-center"
           >
              Selesai
           </Link>
        </section>
     );
  }

  return (
    <section className="card p-5">
      <h2 className="font-display text-lg font-semibold">Ringkasan</h2>

      <div className="mt-4 rounded-xl bg-ink p-4 text-cream">
        <p className="text-sm font-bold text-gold">{serviceName}</p>
        <p className="mt-1 text-xs text-cream/70">
          {barberName} · {date} · {minutesToTime(slotMinutes)} WIB
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="name" className="label-premium">Nama</label>
          <input
            id="name"
            type="text"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              clearError("name");
            }}
            placeholder="Nama depan"
            className="input-premium"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="label-premium">Email</label>
          <input
            id="email"
            type="email"
            value={customerEmail}
            onChange={(e) => {
              setCustomerEmail(e.target.value);
              clearError("email");
            }}
            placeholder="nama@gmail.com"
            className="input-premium"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="label-premium">Nomor WhatsApp</label>
          <input
            id="phone"
            type="tel"
            value={customerPhone}
            onChange={(e) => {
              setCustomerPhone(e.target.value);
              clearError("phone");
              clearServerNote();
            }}
            placeholder="08xxxxxxxxxx"
            className="input-premium"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="notes" className="label-premium">Catatan (opsional)</label>
          <textarea
            id="notes"
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            placeholder="Contoh: jangan terlalu pendek"
            rows={3}
            className="input-premium"
          />
        </div>

        {status === "error" && (
          <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700 whitespace-pre-line [word-spacing:1px] tracking-[.5px] leading-[15px]">
            {serverMessage}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "loading"}
          className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "Menyimpan..." : "Konfirmasi Booking"}
        </button>
      </div>
    </section>
  );
}