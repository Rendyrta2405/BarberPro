export function normalizePhone(phone: string): string {
   const cleaned = phone. replace(/\D/g, "");

   if (cleaned.startsWith("0")) {
      return "+62" + cleaned.slice(1);
   }

   if (cleaned.startsWith("62")) {
      return "+" + cleaned;
   }

   return "+62" + cleaned; 
}

export function isValidIndonesianPhone(phone: string): boolean {
   const cleaned = phone.replace(/\D/g, "");

   return /^(08|628)\d{8,11}$/.test(cleaned);
}