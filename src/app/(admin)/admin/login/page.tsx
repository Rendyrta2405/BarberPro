"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/auth-actions";
import { STORE } from "@/lib/data";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const result = await loginAdmin(email, password);

    setLoading(false);

    if (result.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(result.message);
    }
  }

  async function handleSubmitDemoGuest() {
     setLoading(true);
     setError("");
     
     const result = await loginAdmin("demo@gmail.com", "barberpro");

     if (result.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(result.message);
    }
  }

  return (
    <>
       <section className="mx-auto max-w-md rounded-2xl border border-cream/10 bg-ink-soft p-8">
         <p className="eyebrow">Area Admin</p>
         <h1 className="font-display mt-2 text-3xl font-semibold">Masuk</h1>
         <p className="mt-2 text-sm text-cream/60">Khusus staf {STORE.name}.</p>
   
         <div className="mt-6 space-y-4">
           <div>
             <label htmlFor="email" className="text-sm font-semibold">Email</label>
             <input
               id="email"
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="your@email.com"
               className="mt-1 w-full rounded-xl border border-cream/15 bg-ink px-4 py-3 text-sm outline-none transition focus:border-gold"
             />
           </div>
   
           <div>
             <label htmlFor="password" className="text-sm font-semibold">Password</label>
             <input
               id="password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="●●●●●●●●"
               className="mt-1 w-full rounded-xl border border-cream/15 bg-ink px-4 py-3 text-sm outline-none transition focus:border-gold"
             />
           </div>
   
           {error && (
             <p className="rounded-xl bg-red-400/10 p-3 text-sm text-red-300">{error}</p>
           )}
   
           <button
             type="button"
             onClick={handleSubmit}
             disabled={loading}
             className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-50"
           >
             {loading ? "Memeriksa..." : "Masuk"}
           </button>
         </div>

         <span className="py-4 text-cream/50 block text-center">ATAU</span>
          
          <form action={handleSubmitDemoGuest} className="text-center">
           <input type="hidden" name="email" value="demo@gmail.com" />
           <input type="hidden" name="password" value="barberpro" />
           <button type="submit" className="text-xs text-cream underline underline-offset-4 transition hover:text-ink [word-spacing:0.1rem] tracking-wider">
             Masuk sebagai tamu demo (satu ketukan)
           </button>
         </form>
       </section>

    </>
  );
}