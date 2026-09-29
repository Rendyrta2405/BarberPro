"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

// Diekspor supaya parent (tabel) memakai tipe yang sama persis.
export type Value = ValuePiece | [ValuePiece, ValuePiece];

type Props = {
  onSendRange: (data: Value) => void;
};

const fmtDay = (d: Date) =>
  d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }).toLowerCase();

export default function DateRangePicker({ onSendRange }: Props) {
  const [value, setValue] = useState<Value | null>(null);
  const [fenceStart, setFenceStart] = useState<Date | null>(null);
  // G7: buka/tutup milik picker sendiri. Parent hanya memutuskan mount
  // (saat range === "custom"); urusan terlihat/tersembunyi berhenti di sini.
  const [open, setOpen] = useState(true);
  const MAX_RANGE_DAYS = 90;

  const complete = Array.isArray(value) && value[0] !== null && value[1] !== null;

  const sendRange = () => {
    if (!complete) return;
    onSendRange(value as [Date, Date]);
    setOpen(false); // G7: klik Terapkan = kalender tersembunyi.
  };

  const handleDayClick = (day: Date) => {
    // Pagar 90 hari sebagai prop kalender (desain Rafael): mencegah, bukan memarahi.
    // Konsekuensi sadar: pesan error 90-hari tidak akan pernah tampil,
    // karena tanggal di luar pagar tidak bisa diklik sama sekali.
    setFenceStart((cur) => (cur ? null : day));
  };

  const maxDate = fenceStart
    ? new Date(new Date(fenceStart).setDate(fenceStart.getDate() + MAX_RANGE_DAYS))
    : undefined;

  // ---- keadaan tertutup: satu tombol kecil, bukan pemakan layout ----
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-2 rounded-xl border border-cream/15 bg-ink px-3 py-2 text-xs text-cream/70 transition hover:border-gold/40 hover:text-cream"
      >
        {complete
          ? `Ubah rentang: ${fmtDay((value as [Date, Date])[0])} – ${fmtDay((value as [Date, Date])[1])}`
          : "Pilih rentang kustom…"}
      </button>
    );
  }

  // ---- keadaan terbuka: panel melayang + backdrop, nol pergeseran layout ----
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Calendar
          onChange={(v) => setValue(v as Value)}
          value={value}
          selectRange
          locale="id-ID"
          onClickDay={handleDayClick}
          minDate={fenceStart ?? undefined}
          maxDate={maxDate}
        />
        <div className="mt-2 flex justify-end gap-2 rounded-b-2xl bg-ink px-4 pb-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-cream/20 px-3 py-2 text-xs font-bold text-cream/70 transition hover:border-cream/50 hover:text-cream"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!complete}
            onClick={sendRange}
            className="rounded-xl bg-gold px-4 py-2 text-xs font-bold text-ink transition hover:bg-gold-soft disabled:opacity-50"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
