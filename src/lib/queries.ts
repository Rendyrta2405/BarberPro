import { supabase } from "@/lib/supabase";
import { Barber, Service, WorkingHour } from "@/lib/types";

export async function getActiveServices() {
   const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

   return { data: (data ?? []) as Service[], error};
}

export async function getActiveBarbers() {
   const { data, error } = await supabase
        .from("barbers")
        .select("*")
        .eq("is_active", true)
        .order("name");

   return { data: (data ?? []) as Barber[], error };
}

export async function getAllWorkingHours() {
   const { data, error } = await supabase
      .from("working_hours")
      .select('*');

   return { data: (data ?? []) as WorkingHour[], error };
}