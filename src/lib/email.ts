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

   await resend.emails.send({
      from: "BarberPro <onboarding@resend.dev>",
      to: p.toEmail,
      subject: `Booking BarberPro — ${p.date} ${p.timeLabel}`,
      html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e5e5;border-radius:12px">
         <h2 style="margin:0 0 12px">Booking Diterima ✔</h2> 
         <p style="margin:0 0 8px">Halo ${p.customerName},</p>
         <p style="margin:0 0 16px">Booking kamu sudah kami catat:</p>
         <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr>
               <td style="padding:6px 0;color:#666">Layanan</td>
               <td style="padding:6px 0;"><b>${p.serviceName}</b></td>
            </tr>
            <tr>
               <td style="padding:6px 0;color:#666">Barber</td>
               <td style="padding:6px 0;"><b>${p.barberName}</b></td>
            </tr>
            <tr>
               <td style="padding:6px 0;color:#666">Tanggal</td>
               <td style="padding:6px 0;"><b>${p.date}</b></td>
            </tr>
            <tr>
               <td style="padding:6px 0;color:#666">Jam</td>
               <td style="padding:6px 0;"><b>${p.timeLabel} WIB</b></td>
            </tr>
         </table>
         <p style="margin:16px 0 0;font-size:13px;color:#666">
            Status: <b>pending</b> — menunggu konfirmasi admin.
         </p>
      </div>
      `
   })
}