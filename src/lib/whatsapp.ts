const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL ?? "https://api.fonnte.com/send";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const ADMIN_WHATSAPP_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER;

export function isWhatsAppConfigured(): boolean {
   return Boolean(WHATSAPP_TOKEN && ADMIN_WHATSAPP_NUMBER);
}

interface BookingMessageParams {
   customerName: string;
   customerPhone: string;
   customerNotes: string;
   serviceName: string;
   barberName: string;
   date: string;
   timeLabel: string;
}

export function buildBookingMessage(p: BookingMessageParams) {
   return [
      "🔔 BOOKING BARU",
      "",
      `Nama: ${p.customerName}`,
      `Layanan: ${p.serviceName}`,
      `Barber: ${p.barberName}`,
      `Tanggal: ${p.date}`,
      `Jam: ${p.timeLabel} WIB`,
      `WA: ${p.customerPhone}`,
      p.customerNotes ? `Catatan: ${p.customerNotes}` : "",
   ]
      .filter(Boolean)
      .join("\n");
}

export async function sendWhatsAppToAdmin(message: string): Promise<void> {
   if (!isWhatsAppConfigured()) {
      throw new Error("Whatsapp belum dikonfigurasi.");
   }

   const response = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
         Authorization: WHATSAPP_TOKEN!,
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         target: ADMIN_WHATSAPP_NUMBER,
         message,
      }),
   });

   if (!response.ok) {
      throw new Error(`WhatsApp gateway error: ${response.status}`);
   }

   const json = await response.json().catch(() => null);

   if (json && json.status === false) {
      throw new Error(json.reason ?? "Gateway menolak pesan.");
   }
}