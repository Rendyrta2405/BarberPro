"use client";

import { useState } from "react";
import { isValidIndonesianPhone, normalizePhone } from "@/lib/phone";
import { minutesToTime } from "@/lib/slots";
import { createBooking } from "@/lib/booking-actions";

interface BookingFormProps {
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
      setErrors((prev: FormErrors) => ({ ...prev, [field]: undefined }));
   }

   function validate(): boolean {
      const newErrors: FormErrors = {};

      if (customerName.trim().length < 3) {
         newErrors.name = "Nama minimal 3 karakter.";
      }

      if (!isValidIndonesianPhone(customerPhone)) {
         newErrors.phone = "Nomor tidak valid. Contoh: 081234567890";
      }

      if (!/^\S+@\S+\.\S+$/.test(customerEmail.trim())) {
         newErrors.email = "Email tidak valid. Contoh: nama@gmail.com";
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

      if (result.ok) {
         onBooked();
      }
   }

   return (
      <section className="rounded-xl border border-gray-200 bg-white p-4">
         <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
           5. Data Diri
         </h2>

         <p className="mt-2 text-sm text-gray-600">
            {serviceName} • {barberName} • {date} • {minutesToTime(slotMinutes)}
         </p>

         <div className="mt-4 space-y-4">
            <div>
               <label htmlFor="name" className="text-sm font-medium">
                  Nama
               </label>
               <input
                  id="name"
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                     setCustomerName(e.target.value);
                     clearError("name");
                  }}
                  placeholder="Nama kamu"
                  className={`mt-1 w-full rounded-xl border-2 bg-white p-3 text-sm ${
                     errors.name ? "border-red-500" : "border-gray-200" 
                  }`}
               />
               {errors.name && (
                   <p className="mt-1 text-xs text-red-500">
                      {errors.name}
                   </p>
               )}
            </div>

            <div>
               <label htmlFor="phone" className="text-sm font-medium">
                  Nomor WhatsApp
               </label>
               <input 
                  id="phone" 
                  type="tel" 
                  value={customerPhone}
                  onChange={(e) => {
                     setCustomerPhone(e.target.value);
                     clearError("phone");
                  }}
                  placeholder="08xxxxxxxxxx"
                  className={`mt-1 w-full rounded-xl border-2 bg-white p-3 text-sm ${
                    errors.phone 
                     ? "border-red-500" 
                     : "border-gray-200"
                  }`}
               />
               {errors.phone && (
                   <p className="mt-1 text-xs text-red-500">
                      {errors.phone}
                   </p>
               )}
            </div>

            <div>
               <label htmlFor="email" className="text-sm font-medium">Email</label>
               <input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => {
                     setCustomerEmail(e.target.value);
                     clearError("email");
                  }}
                  placeholder="nama@gmail.com"
                  className={`mt-1 w-full rounded-xl border-2 bg-white p-3 text-sm ${
                  errors.email 
                     ? "border-red-500" 
                     : "border-gray-200"
                }`}
               />
               {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                      {errors.email}
                  </p>
               )}
            </div>

            <div>
               <label htmlFor="notes" className="text-sm font-medium">
                  Catatan (opsional)
               </label>
               <textarea 
                  id="notes"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Contoh: jangan terlalu pendek"
                  rows={3}
                  className="mt-1 w-full rounded-xl border-2 border-gray-200 bg-white p-3 text-sm"
               />
            </div>

            <button
               type="button"
               onClick={handleSubmit}
               disabled={status === "loading"}
               className="w-full rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
               {status === "loading" ? "Menyimpan..." : "Konfirmasi Booking"}
            </button>

            {status === "success" && (
               <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
                  {serverMessage}
               </p>
            )}

            {status === "error" && (
               <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  {serverMessage}
               </p>
            )}
         </div>
      </section>
   );
}

// User sudah capek isi form -> lalu user ganti pilihan layanan / barber -> harus isi form ulang -> user capek