"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/lib/admin-actions";

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

function formatWIB(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-400/15 text-yellow-300",
  confirmed: "bg-sky-400/15 text-sky-300",
  done: "bg-emerald-400/15 text-emerald-300",
  cancelled: "bg-red-400/15 text-red-300",
};

export default function AdminBookingCard({ booking }: { booking: JoinedBooking }) {
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
    <div className="rounded-2xl border border-cream/10 bg-ink-soft p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display font-semibold">{booking.customer_name}</h3>
          <p className="mt-1 text-xs text-cream/50">{booking.customer_phone}</p>
          <p className="text-xs text-cream/50">{booking.customer_email}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
            statusColors[booking.status] || "bg-cream/10"
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="mt-4 space-y-1 text-sm text-cream/80">
        <p><span className="text-cream/50">Layanan:</span> {booking.services?.name}</p>
        <p><span className="text-cream/50">Barber:</span> {booking.barbers?.name}</p>
        <p><span className="text-cream/50">Waktu:</span> {formatWIB(booking.starts_at)} WIB</p>
        {booking.customer_notes && (
          <p className="italic text-cream/60">“{booking.customer_notes}”</p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {booking.status === "pending" && (
          <button
            disabled={updating}
            onClick={() => handleUpdate("confirmed")}
            className="rounded-xl bg-gold py-2 text-xs font-bold text-ink transition hover:bg-gold-soft disabled:opacity-50"
          >
            Konfirmasi
          </button>
        )}
        {booking.status === "confirmed" && (
          <button
            disabled={updating}
            onClick={() => handleUpdate("done")}
            className="rounded-xl bg-emerald-500 py-2 text-xs font-bold text-ink transition hover:bg-emerald-400 disabled:opacity-50"
          >
            Selesai
          </button>
        )}
        {booking.status !== "done" && booking.status !== "cancelled" && (
          <button
            disabled={updating}
            onClick={() => handleUpdate("cancelled")}
            className="col-span-2 rounded-xl border border-red-400/40 py-2 text-xs font-bold text-red-300 transition hover:border-red-400 disabled:opacity-50"
          >
            {updating ? "..." : "Batalkan"}
          </button>
        )}
      </div>

      {message && (
        <p className="mt-3 rounded-xl bg-red-400/10 p-2 text-xs text-red-300">
          {message}
        </p>
      )}
    </div>
  );
}