import { createBrowserClient } from "@supabase/ssr";

// Klien Supabase untuk BROWSER yang membawa cookie sesi login.
// Dipakai dashboard admin agar langganan realtime mendengar
// sebagai "admin yang sudah login", bukan sebagai orang asing.
export function createSupabaseBrowserClient() {
   return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
}