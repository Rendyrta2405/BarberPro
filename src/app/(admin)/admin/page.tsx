import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminPage() {
   const supabase = await createSupabaseServerClient();
   const { data } = await supabase.auth.getUser();

   if (!data.user) {
      redirect("/admin/login");
   }
   
   return (
      <section>
         <h1 className="text-2xl font-bold">Dashboard</h1>
         <p className="mt-2 text-gray-600">
            Selamat datang, admin. Daftar booking akan muncul di Part 14.
         </p>
      </section>
   );
}