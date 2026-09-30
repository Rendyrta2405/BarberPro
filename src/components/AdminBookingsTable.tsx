"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { updateBookingStatus } from "@/lib/admin-actions";
import { formatRupiah } from "@/lib/format";
import DateRangePicker, { type Value } from "@/components/DateRangePicker";
import { type BookingRow } from "@/lib/types";
import AdminStats from "@/components/AdminStats";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-400/15 text-yellow-300",
  confirmed: "bg-sky-400/15 text-sky-300",
  done: "bg-emerald-400/15 text-emerald-300",
  cancelled: "bg-red-400/15 text-red-300",
};

const fmtDay = (d: Date) =>
  d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }).toLowerCase();

export default function AdminBookingsTable({
  initialBookings,
}: {
  initialBookings: BookingRow[];
}) {
  const [bookings, setBookings] = useState<BookingRow[]>(initialBookings);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [range, setRange] = useState<"today" | "7d" | "30d" | "all" | "custom">("all");
  const [status, setStatus] = useState<"all" | "pending" | "confirmed" | "done" | "cancelled">("all");
  const [barber, setBarber] = useState("all");
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);
  // G2: tipe eksplisit. Tanpa generic, TS yakin state ini selamanya null.
  const [customRange, setCustomRange] = useState<Value | null>(null);
  const [page, setPage] = useState<number>(1);

  async function reload() {
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase
      .from("bookings")
      .select("*, services(name, price), barbers(name)")
      .order("starts_at", { ascending: false });
    if (data) setBookings(data as BookingRow[]);
  }

  useEffect(() => {
    setMounted(true);

    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel("bookings-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleStatus(bookingId: number, newStatus: string) {
    if (newStatus === "cancelled") {
      const customer_name = bookings.find((b) => b.id === bookingId)?.customer_name;
      const yakin = window.confirm(`Batalkan booking atas nama ${customer_name}?`);
      if (!yakin) return;
    }

    setBusyId(bookingId);
    const result = await updateBookingStatus(bookingId, newStatus);
    setBusyId(null);
    if (!result.ok) {
      window.alert(result.message);
    }
    // Tanpa reload() di sini: seruan langganan akan tiba sendiri dan memperbarui tabel.
  }

  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  const startToday = new Date(`${todayStr}T00:00:00+07:00`).getTime();
  const endToday = new Date(`${todayStr}T23:59:59+07:00`).getTime();
  const end7 = startToday + 7 * 24 * 60 * 60 * 1000;
  const end30 = startToday + 30 * 24 * 60 * 60 * 1000;

  const barberNames = Array.from(new Set(bookings.map((b) => b.barbers?.name ?? "-")));

  const filtered = bookings.filter((b) => {
    const t = new Date(b.starts_at).getTime();
    if (range === "today" && (t < startToday || t > endToday)) return false;
    if (range === "7d" && (t < startToday || t > end7)) return false;
    if (range === "30d" && (t < startToday || t > end30)) return false;
    // G3: KABELENYA. Tanpa cabang ini, rentang kustom hanya menghias dropdown.
    // Butir hari dibanding milidetik: konsisten dengan preset lain di file ini.
    if (range === "custom" && customRange && Array.isArray(customRange)) {
      const [a, bb] = customRange;
      if (a && bb) {
        const s = new Date(`${a.toLocaleDateString("en-CA")}T00:00:00+07:00`).getTime();
        const e = new Date(`${bb.toLocaleDateString("en-CA")}T23:59:59+07:00`).getTime();
        if (t < s || t > e) return false;
      }
    }
    if (status !== "all" && b.status !== status) return false;
    if (barber !== "all" && (b.barbers?.name ?? "-") !== barber) return false;
    const needle = q.trim().toLowerCase();
    if (
      needle &&
      !b.customer_name.toLowerCase().includes(needle) &&
      !b.customer_phone.includes(needle)
    )
      return false;
    return true;
  });

  const handleSetCustomRange = (v: Value) => {
    setCustomRange(v);
  };

  const getDropdownLabel = () => {
    // G6: console.log dibuang. Label hanya menyebut rentang yang benar-benar aktif.
    if (range === "custom" && customRange && Array.isArray(customRange)) {
      const [a, bb] = customRange;
      if (a && bb) return `${fmtDay(a)} – ${fmtDay(bb)}`;
    }
    return "Rentang kustom…";
  };

  const pageCount = Math.max(1, Math.ceil(filtered.length / 10));
  const pageSafe = Math.min(page, pageCount);
  const rows = filtered.slice((pageSafe - 1) * 10, pageSafe * 10);

  useEffect(() => {
     setPage(1);
  }, [range, status, barber, q, customRange]);

  return (
    <>
      <AdminStats bookings={bookings} />
       
      <h2 className="font-display mt-10 mb-4 text-xl font-semibold">Semua Booking</h2>
      
       {/* S5: mount hanya di klien — kalender tidak boleh dirender server. */}
      {mounted && range === "custom" && (
        <DateRangePicker onSendRange={handleSetCustomRange} />
      )}
      <div className="mb-4 grid gap-2 sm:grid-cols-4">
        <select
          value={range}
          onChange={(e) => {
            const next = e.target.value as typeof range;
            setRange(next);
            // G4: aturan reset rancangan S3 Rafael — ganti preset = kustom lenyap.
            if (next !== "custom") setCustomRange(null);
          }}
          className="rounded-xl border border-cream/15 bg-ink px-3 py-2 text-sm"
        >
          <option value="all">Semua tanggal</option>
          <option value="today">Hari ini</option>
          <option value="7d">7 hari ke depan</option>
          <option value="30d">30 hari ke depan</option>
          <option value="custom">{getDropdownLabel()}</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="rounded-xl border border-cream/15 bg-ink px-3 py-2 text-sm"
        >
          <option value="all">Semua status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Dikonfirmasi</option>
          <option value="done">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
        <select
          value={barber}
          onChange={(e) => setBarber(e.target.value)}
          className="rounded-xl border border-cream/15 bg-ink px-3 py-2 text-sm"
        >
          <option value="all">Semua kapster</option>
          {barberNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama / nomor…"
          className="rounded-xl border border-cream/15 bg-ink px-3 py-2 text-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-cream/10 text-xs uppercase tracking-widest text-cream/50">
              <th className="py-2 pr-3">Waktu</th>
              <th className="py-2 pr-3">Pelanggan</th>
              <th className="py-2 pr-3">Layanan</th>
              <th className="py-2 pr-3">Barber</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-cream/50">
                  Belum ada booking masuk.
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-cream/50">
                  Tidak ada booking yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              rows.map((b) => (
                <tr key={b.id} className="border-b border-cream/5">
                  <td className="py-2 pr-3">
                    {new Date(b.starts_at).toLocaleDateString("id-ID", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Jakarta",
                    })}
                  </td>
                  <td className="py-2 pr-3">
                    {b.customer_name}
                    <span className="block text-xs text-cream/50">{b.customer_phone}</span>
                  </td>
                  <td className="py-2 pr-3">
                    {b.services?.name ?? "-"}
                    <span className="block text-xs text-cream/50">
                      {formatRupiah(b.services?.price ?? 0)}
                    </span>
                  </td>
                  <td className="py-2 pr-3">{b.barbers?.name ?? "-"}</td>
                  <td className="py-2 pr-3 text-xs uppercase">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                        statusColors[b.status] || "bg-cream/10"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-2">
                    {b.status === "pending" && (
                      <button
                        type="button"
                        disabled={busyId === b.id}
                        onClick={() => handleStatus(b.id, "confirmed")}
                        className="rounded-xl bg-gold p-3 py-2 text-xs font-bold text-ink transition hover:bg-gold-soft disabled:opacity-50"
                      >
                        Konfirmasi
                      </button>
                    )}
                    {b.status === "confirmed" && (
                      <button
                        type="button"
                        disabled={busyId === b.id}
                        onClick={() => handleStatus(b.id, "done")}
                        className="rounded-xl bg-emerald-500 p-3 py-2 text-xs font-bold text-ink transition hover:bg-emerald-400 disabled:opacity-50"
                      >
                        Selesai
                      </button>
                    )}
                    {(b.status === "pending" || b.status === "confirmed") && (
                      <button
                        type="button"
                        disabled={busyId === b.id}
                        onClick={() => handleStatus(b.id, "cancelled")}
                        className="ml-2 rounded-xl border border-red-400/40 px-3 py-1 text-xs text-red-300 disabled:opacity-50"
                      >
                        Batalkan
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="nav-btn flex gap-3 justify-end py-3">
           <span className="text-cream text-sm">Halaman {pageSafe} dari {pageCount} — [ {filtered.length} booking ]</span>
           <button className="btn rounded-xl border border-gold text-xs text-gold-300 disabled:opacity-50 px-3 py-1"
              disabled={pageSafe <= 1}
              onClick={() => setPage(page - 1)}
           >
              ← Sebelumnya
           </button>
           <button className="btn btn rounded-xl border border-gold text-xs text-gold-300 disabled:opacity-50 px-3 py-1"
              disabled={pageSafe >= pageCount}
              onClick={() => setPage(page + 1)}
           >
              Berikutnya →
           </button>
        </div>
      </div>
    </>
  );
}
