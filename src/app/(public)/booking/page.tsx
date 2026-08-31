import { supabase } from "@/lib/supabase";
import { Barber, Service } from "@/lib/types";
import BookingClient from "@/components/BookingClient";

export default async function BookingPage() {
   //  Fetch Dua Tabel dengan Promise.all
  const [servicesResult, barbersResult] = await Promise.all([
     supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true }),
     supabase
        .from("barbers")
        .select("*")
        .eq("is_active", true)
        .order("name"),
   ]);

   const { data: services, error: servicesError } = servicesResult;
   const { data: barbers, error: barbersError } = barbersResult;

   if (servicesError || barbersError || !services || !barbers) {   
     return 
        <p className="text-red-500">
           Gagal memuat data. Coba lagi nanti. 
        </p>
   }
   
   return (
      <BookingClient
         services={services as Service[]}
         barbers={barbers as Barber[]}
      />
   );
}