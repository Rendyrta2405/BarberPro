"use client";

import { updateBookingStatus } from "@/lib/admin-actions";
import { useState } from "react";

// Tipe data hasil join dari Supabase
interface JoinedBooking {
   id: number;
   customer_name: string;
   customer_phone: string;
   customer_email: string;
   customer_notes: string | null;
   starts_at: string;
   status: string;
   services: { name: string } | null;
   barbers: { name: string } | null;
}

interface AdminBookingCardProps {
   booking: JoinedBooking;
}

function formatWIB(iso: string) {
   return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
   }).format(new Date(iso));
}

const statusColors: Record<string, string> = {
   pending: "bg-yellow-100 text-yellow-800",
   confirmed: "bg-blue-100 text-blue-800",
   done: "bg-green-100 text-green-800",
   cancelled: "bg-red-100 text-red-800",
};

export default function AdminBookingCard({ booking }: AdminBookingCardProps) {
   const [updating, setUpdating] = useState(false);
   const [message, setMessage] = useState("");

   async function handleUpdate(status: string) {
      if (status === "cancelled") {
         const yakin = window.confirm(
            `Batalkan booking atas nama ${booking.customer_name}?`
         );
         if (!yakin) return;
      }
      
      setUpdating(true);
      setMessage("");
      
      const result = await updateBookingStatus(booking.id, status);
      
      setUpdating(false);

      if (!result.ok) {
         setMessage(result.message);
      }
   }

   return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
         <div className="flex items-start justify-between">
            <div>
               <h3 className="font-semibold text-gray-900">
                  {booking.customer_name}
               </h3>
               <p className="text-xs text-gray-500">
                  {booking.customer_phone}
               </p>
               <p className="text-xs text-gray-500">
                  {booking.customer_email}
               </p>
            </div>
            <span className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${statusColors[booking.status] || "bg-gray-100"}`}>
             {booking.status}
           </span>
         </div>

         <div className="mt-3 space-y-1 text-sm">
            <p><b>Layanan:</b> {booking.services?.name}</p>
            <p><b>Barber:</b> {booking.barbers?.name}</p>
            <p><b>Waktu:</b> {formatWIB(booking.starts_at)} WIB</p>
            {booking.customer_notes && (
               <p className="italic text-gray-600">
                  "{booking.customer_notes}"
               </p>
            )}
         </div>

         <div className="mt-4 grid grid-cols-3 gap-2">
            {booking.status === "pending" && (
               <button
                  disabled={updating}
                  onClick={() => handleUpdate("confirmed")}
                  className="rounded-lg bg-blue-600 py-2 text-xs font-bold text-white disabled:opacity-50"
               >
                  Konfirmasi
               </button>
            )}
            {booking.status === "confirmed" && (
               <button
                  disabled={updating}
                  onClick={() => handleUpdate("done")}
                  className="rounded-lg bg-green-600 py-2 text-xs font-bold text-white disabled:opacity-50"
               >
                  Selesai
               </button>
            )}
            {booking.status !== "done" && booking.status !== "cancelled" && (
               <button
                  disabled={updating}
                  onClick={() => handleUpdate("cancelled")}
                  className="col-span-2 rounded-lg border border-red-300 bg-white py-2 text-xs font-bold text-red-600 disabled:opacity-50"
               >
                  {updating ? "● ● ●" : "Batalkan"}
               </button>
            )}
         </div>

         {message && (
            <p className="mt-2 rounded-xl bg-red-50 p-2 text-xs text-red-700">
             {message}
           </p>
         )}
      </div>
   );
}