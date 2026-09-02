export function timeToMinutes(time: string): number {
   const [hours, minutes] = time.split(":").map(Number);
   return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
   const h = Math.floor(minutes / 60);
   const m = minutes % 60;
   const hh = String(h).padStart(2, "0");
   const mm = String(m).padStart(2, "0");
   return `${hh}:${mm}`;
}

export function generateSlots(
   startMinutes: number,
   endMinutes: number,
   durationMinutes: number,
   intervalMinutes: number = 30
): number[] {
   const slots: number[] = [];

   for (
      let current = startMinutes;
      current + durationMinutes <= endMinutes; 
      current += intervalMinutes
   ) {
      slots.push(current);
   }

   return slots;
}

export function filterPastSlots(slots: number[], dateStr: string): number[] {
   const now = new Date();
   const today = now.toLocaleDateString("en-CA");

   if (dateStr !== today) return slots;

   const nowMinutes = now.getHours() * 60 + now.getMinutes();
   return slots.filter((slot) => slot > nowMinutes);
}