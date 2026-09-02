"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function loginAdmin(email: string, password: string) {
   const supabase = await createSupabaseServerClient();

   const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
   });

   if (error) {
      return { ok: false as const, message: "Email atau password salah." };
   }

   return { ok: true as const };
}

export async function logoutAdmin() {
   const supabase = await createSupabaseServerClient();
   await supabase.auth.signOut();
}