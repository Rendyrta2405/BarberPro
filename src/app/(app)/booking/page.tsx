import {
   getActiveServices,
   getActiveBarbers,
   getAllWorkingHours,
} from "@/lib/queries";
import BookingClient from "@/components/BookingClient";

export default async function BookingPage() {
   //  Fetch Dua Tabel dengan Promise.all
  const [servicesResult, barbersResult, workingHoursResult ] = 
   await Promise.all([
     getActiveServices(),
     getActiveBarbers(),
     getAllWorkingHours(),
   ]);

   const { data: services, error: servicesError } = servicesResult;
   const { data: barbers, error: barbersError } = barbersResult;
   const { data: workingHours, error: workingHoursError } = workingHoursResult;

   
  if (servicesError || barbersError || workingHoursError) {
    return 
       <p className="text-red-500">Gagal memuat data booking.</p>;
  }
   
   return (
      <BookingClient
         services={services}
         barbers={barbers}
         workingHours={workingHours}
      />
   );
}