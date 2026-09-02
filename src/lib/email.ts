import { Resend } from "resend";

interface ConfirmationParams {
   toEmail: string;
   customerName: string;
   serviceName: string;
   barberName: string;
   date: string;
   timeLabel: string;
}

export async function sendBookingConfirmation(p: ConfirmationParams) {
   const resend = new Resend(process.env.RESEND_API_KEY);

   // Tentukan tautan media sosial BarberPro Anda di sini
   const SOCIAL_LINKS = {
      instagram: "https://instagram.com/universe.dev.id",
      facebook: "https://facebook.com/universe.dev.id",
      linkedin: "https://linkedin.com/in/developer-id"
   };

   // Menggunakan ikon resmi berbasis CDN publik gratis yang aman (Lucide Icons)
   const ICON_URL = {
      instagram: "https://img.icons8.com/?size=100&id=BrU2BBoRXiWq&format=png&color=000000",
      facebook: "https://img.icons8.com/?size=100&id=kQzCK4emnaD2&format=png&color=228BE6",
      linkedin: "https://img.icons8.com/?size=100&id=13930&format=png&color=000000"
   };

   await resend.emails.send({
      from: "BarberPro <onboarding@resend.dev>", 
      to: p.toEmail,
      subject: `Konfirmasi Booking BarberPro — ${p.date} (${p.timeLabel})`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
         <meta charset="utf-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Booking Confirmation</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
         <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f9fafb;padding:32px 16px;">
            <tr>
               <td align="center">
                  <table role="presentation" width="100%" style="max-width:500px;background-color:#ffffff;border:1px solid #eaecf0;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0" border="0">
                     
                     <!-- Header Accent Line -->
                     <tr>
                        <td height="4" style="background-color:#1e1e1e;"></td>
                     </tr>

                     <!-- Main Body Content -->
                     <tr>
                        <td style="padding:32px 24px;">
                           <!-- Brand Logo / Name Text -->
                           <p style="margin:0 0 24px;font-size:20px;font-weight:bold;letter-spacing:-0.5px;color:#1e1e1e;">
                              Barber<span style="color:#6366f1;">Pro</span>
                           </p>

                           <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#101828;line-height:1.3;">
                              Booking Diterima ✔
                           </h2> 
                           
                           <p style="margin:0 0 24px;font-size:15px;color:#475467;line-height:1.5;">
                              Halo <strong>${p.customerName}</strong>, terima kasih telah mempercayakan perawatan rambut Anda kepada kami. Sesi booking Anda telah berhasil dicatat ke sistem kami.
                           </p>

                           <!-- Booking Card Details -->
                           <table role="presentation" width="100%" style="background-color:#f8f9fa;border:1px solid #f2f4f7;border-radius:12px;padding:16px;margin-bottom:24px;" cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                 <td style="padding:6px 0;font-size:14px;color:#667085;" width="35%">Layanan</td>
                                 <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1d2939;">${p.serviceName}</td>
                              </tr>
                              <tr>
                                 <td style="padding:6px 0;font-size:14px;color:#667085;">Barber</td>
                                 <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1d2939;">${p.barberName}</td>
                              </tr>
                              <tr>
                                 <td style="padding:6px 0;font-size:14px;color:#667085;">Tanggal</td>
                                 <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1d2939;">${p.date}</td>
                              </tr>
                              <tr>
                                 <td style="padding:6px 0;font-size:14px;color:#667085;">Jam Sesi</td>
                                 <td style="padding:6px 0;font-size:14px;font-weight:600;color:#1d2939;">${p.timeLabel} WIB</td>
                              </tr>
                           </table>

                           <!-- Status Badge -->
                           <div style="border-left:3px solid #f59e0b;background-color:#fffbeb;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:24px;">
                              <p style="margin:0;font-size:14px;color:#b45309;line-height:1.4;">
                                 Status saat ini: <strong style="text-transform:uppercase;">pending</strong>.<br>
                                 <span style="font-size:13px;opacity:0.9;">Mohon tunggu sebentar, admin sedang memvalidasi jadwal Anda.</span>
                              </p>
                           </div>

                           <p style="margin:0;font-size:14px;color:#475467;line-height:1.5;">
                              Sampai jumpa di lokasi,<br>
                              <strong>Tim BarberPro</strong>
                           </p>
                        </td>
                     </tr>

                     <!-- Footer Area with Social Media -->
                     <tr>
                        <td style="padding:0 24px 32px;background-color:#ffffff;border-top:1px solid #f2f4f7;" align="center">
                           <p style="margin:24px 0 16px;font-size:13px;color:#98a2b3;text-align:center;">
                              Ikuti perkembangan tren gaya rambut terbaru kami di media sosial:
                           </p>
                           
                           <!-- Social Media Icons Row -->
                           <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
                              <tr>
                                 <td style="padding:0 12px;">
                                    <a href="${SOCIAL_LINKS.instagram}" target="_blank" style="text-decoration:none;">
                                       <img src="${ICON_URL.instagram}" width="20" height="20" alt="Instagram" style="display:block;filter:invert(40%) sepia(10%) saturate(400%) assignment-color-zinc;">
                                    </a>
                                 </td>
                                 <td style="padding:0 12px;">
                                    <a href="${SOCIAL_LINKS.facebook}" target="_blank" style="text-decoration:none;">
                                       <img src="${ICON_URL.facebook}" width="20" height="20" alt="Facebook" style="display:block;filter:invert(40%) sepia(10%) saturate(400%);">
                                    </a>
                                 </td>
                                 <td style="padding:0 12px;">
                                    <a href="${SOCIAL_LINKS.linkedin}" target="_blank" style="text-decoration:none;">
                                       <img src="${ICON_URL.linkedin}" width="20" height="20" alt="LinkedIn" style="display:block;filter:invert(40%) sepia(10%) saturate(400%);">
                                    </a>
                                 </td>
                              </tr>
                           </table>

                           <p style="margin:20px 0 0;font-size:12px;color:#98a2b3;text-align:center;line-height:1.4;">
                              &copy; ${new Date().getFullYear()} BarberPro Indonesia. Hak Cipta Dilindungi.<br>
                              Email ini dikirim secara otomatis, Anda tidak perlu membalas email ini.
                           </p>
                        </td>
                     </tr>

                  </table>
               </td>
            </tr>
         </table>
      </body>
      </html>
      `
   });
}
