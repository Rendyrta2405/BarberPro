"use client";

import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/auth-actions";

export default function LogoutButton() {
   const router = useRouter();

   return (
      <button
         type="button"
         onClick={async () => {
            await logoutAdmin();
            router.push("/admin/login");
            router.refresh();
         }}
         className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-600"
      >
         Logout
      </button>
   );
}