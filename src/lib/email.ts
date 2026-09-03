import { Resend } from "resend";

export type BookingStatus = "pending" | "confirmed" | "done" | "cancelled";

interface EmailParams {
  toEmail: string;
  customerName: string;
  serviceName: string;
  barberName: string;
  date: string;
  timeLabel: string;
  status: BookingStatus;
}

// ---------- konfigurasi per status ----------
// Ubah copywriting / warna / subject di sini saja.
const STATUS_CONFIG: Record<
  BookingStatus,
  {
    subjectPrefix: string;
    heading: string;
    body: (name: string) => string;
    statusLabel: string;
    statusHint: string;
    statusBorder: string;
    statusBg: string;
    statusText: string;
    cta?: { label: string; href: string };
  }
> = {
  pending: {
    subjectPrefix: "Konfirmasi Booking BarberPro",
    heading: "Booking Diterima ✔",
    body: (name) =>
      `Halo <strong>${name}</strong>, terima kasih telah mempercayakan perawatan rambut Anda kepada kami. Sesi booking Anda telah berhasil dicatat ke sistem kami.`,
    statusLabel: "PENDING",
    statusHint: "Mohon tunggu sebentar, admin sedang memvalidasi jadwal Anda.",
    statusBorder: "#f59e0b",
    statusBg: "#fffbeb",
    statusText: "#b45309",
  },
  confirmed: {
    subjectPrefix: "Booking Anda Dikonfirmasi ✓",
    heading: "Booking Dikonfirmasi ✓",
    body: (name) =>
      `Halo <strong>${name}</strong>, kabar baik! Admin sudah <strong>mengonfirmasi</strong> jadwal Anda. Barber pilihanmu akan menunggumu di kursi tepat waktu.`,
    statusLabel: "CONFIRMED",
    statusHint: "Silakan datang 5–10 menit sebelum jam sesi dimulai.",
    statusBorder: "#0ea5e9",
    statusBg: "#f0f9ff",
    statusText: "#0369a1",
  },
  done: {
    subjectPrefix: "Sesi BarberPro Selesai ✨",
    heading: "Sesi Selesai ✨",
    body: (name) =>
      `Halo <strong>${name}</strong>, terima kasih sudah berkunjung. Kami senang bisa melayani Anda hari ini. Semoga penampilan barunya membawa percaya diri sepanjang minggu.`,
    statusLabel: "COMPLETED",
    statusHint: "Sesi Anda telah selesai. Sampai jumpa di sesi berikutnya!",
    statusBorder: "#10b981",
    statusBg: "#ecfdf5",
    statusText: "#047857",
    cta: { label: "Booking Lagi", href: "https://barberpro.rrdevs.my.id/booking" },
  },
  cancelled: {
    subjectPrefix: "Booking Dibatalkan",
    heading: "Booking Dibatalkan",
    body: (name) =>
      `Halo <strong>${name}</strong>, kami menerima informasi bahwa booking Anda telah <strong>dibatalkan</strong>. Kalau ini adalah kesalahan, silakan hubungi kami atau booking ulang melalui website.`,
    statusLabel: "CANCELLED",
    statusHint: "Kursi Anda sudah dilepaskan dan bisa dipesan oleh pelanggan lain.",
    statusBorder: "#ef4444",
    statusBg: "#fef2f2",
    statusText: "#b91c1c",
    cta: { label: "Booking Ulang", href: "https://barberpro.rrdevs.my.id/booking" },
  },
};

const SOCIAL_LINKS = {
  instagram: "https://instagram.com/universe.dev.id",
  facebook: "https://facebook.com/universe.dev.id",
  linkedin: "https://linkedin.com/in/developer-id",
};

const ICON_URL = {
  instagram:
    "https://img.icons8.com/?size=100&id=BrU2BBoRXiWq&format=png&color=000000",
  facebook:
    "https://img.icons8.com/?size=100&id=kQzCK4emnaD2&format=png&color=228BE6",
  linkedin:
    "https://img.icons8.com/?size=100&id=13930&format=png&color=000000",
};

// ---------- fungsi utama ----------
export async function sendBookingEmail(p: EmailParams) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const cfg = STATUS_CONFIG[p.status];

  await resend.emails.send({
    from: "BarberPro <barberpro@rrdevs.my.id>",
    to: p.toEmail,
    subject: `${cfg.subjectPrefix} — ${p.date} (${p.timeLabel})`,
    html: buildHtml({ ...p, cfg }),
  });
}

// Backward compat: caller lama (booking-actions) masih bisa pakai nama lama.
export const sendBookingConfirmation = sendBookingEmail;

// ---------- template builder ----------
function buildHtml(
  p: EmailParams & { cfg: (typeof STATUS_CONFIG)[BookingStatus] }
): string {
  const { customerName, serviceName, barberName, date, timeLabel, cfg } = p;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking BarberPro</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f9fafb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:500px;background-color:#ffffff;border:1px solid #eaecf0;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0" border="0">

          <tr><td height="4" style="background-color:${cfg.statusBorder};"></td></tr>

          <tr>
            <td style="padding:32px 24px;">
              <p style="margin:0 0 24px;font-size:20px;font-weight:bold;letter-spacing:-0.5px;color:#1e1e1e;">
                Barber<span style="color:#6366f1;">Pro</span>
              </p>

              <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#101828;line-height:1.3;">
                ${cfg.heading}
              </h2>

              <p style="margin:0 0 24px;font-size:15px;color:#475467;line-height:1.5;">
                ${cfg.body(customerName)}
              </p>

              <table role="presentation" width="100%" style="background-color:#f8f9fa;border:1px solid #f2f4f7;border-radius:12px;" cellspacing="0" cellpadding="16" border="0">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#667085;" width="35%">Layanan</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1d2939;">${serviceName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#667085;">Barber</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1d2939;">${barberName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#667085;">Tanggal</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1d2939;">${date}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#667085;">Jam Sesi</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1d2939;">${timeLabel} WIB</td>
                </tr>
              </table>

              <div style="border-left:3px solid ${cfg.statusBorder};background-color:${cfg.statusBg};padding:12px 16px;border-radius:0 8px 8px 0;margin:24px 0;">
                <p style="margin:0;font-size:14px;color:${cfg.statusText};line-height:1.4;">
                  Status saat ini: <strong style="text-transform:uppercase;">${cfg.statusLabel}</strong><br>
                  <span style="font-size:13px;opacity:0.9;">${cfg.statusHint}</span>
                </p>
              </div>

              ${
                cfg.cta
                  ? `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="border-radius:8px;background-color:#1e1e1e;">
                      <a href="${cfg.cta.href}" target="_blank" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                        ${cfg.cta.label} →
                      </a>
                    </td>
                  </tr>
                </table>
              `
                  : ""
              }

              <p style="margin:0;font-size:14px;color:#475467;line-height:1.5;">
                Sampai jumpa di lokasi,<br>
                <strong>Tim BarberPro</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 24px 32px;background-color:#ffffff;border-top:1px solid #f2f4f7;" align="center">
              <p style="margin:24px 0 16px;font-size:13px;color:#98a2b3;text-align:center;">
                Ikuti perkembangan tren gaya rambut terbaru kami:
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 12px;">
                    <a href="${SOCIAL_LINKS.instagram}" target="_blank"><img src="${ICON_URL.instagram}" width="20" height="20" alt="Instagram" style="display:block;"></a>
                  </td>
                  <td style="padding:0 12px;">
                    <a href="${SOCIAL_LINKS.facebook}" target="_blank"><img src="${ICON_URL.facebook}" width="20" height="20" alt="Facebook" style="display:block;"></a>
                  </td>
                  <td style="padding:0 12px;">
                    <a href="${SOCIAL_LINKS.linkedin}" target="_blank"><img src="${ICON_URL.linkedin}" width="20" height="20" alt="LinkedIn" style="display:block;"></a>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0;font-size:12px;color:#98a2b3;text-align:center;line-height:1.4;">
                &copy; ${new Date().getFullYear()} BarberPro Indonesia.<br>
                Email ini dikirim otomatis — jangan balas ke alamat ini.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}