"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/auth-actions";

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
   
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
       <h1 className="text-2xl font-bold">Login Admin</h1>
       <p className="mt-1 text-sm text-gray-600"> 
         Khusus staf BarberPro. 
       </p>

       <div className="mt-4 space-y-4">
          <div>
             <label htmlFor="email" className="text-sm font-medium">
                Email
             </label>
             <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-gray-200 bg-white p-3 text-sm"
                placeholder="admin@barberpro.com"
             />
          </div>
          
          <div>
             <label htmlFor="password" className="text-sm font-medium">
                Password
             </label>
             <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-gray-200 bg-white p-3 text-sm"
                placeholder="••••••••"
             />
          </div>

          {error && (
             <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}

          <button
             type="button"
             onClick={handleSubmit}
             disabled={loading}
             className="w-full rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
             {loading ? "Memeriksa..." : "Masuk"}
          </button>
       </div>
    </section>
  );
}