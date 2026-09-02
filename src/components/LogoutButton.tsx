"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
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
      className="flex items-center gap-1.5 rounded-full border border-cream/20 px-4 py-1.5 text-xs font-bold text-cream/70 transition hover:border-gold hover:text-gold"
    >
      <LogOut size={14} />
      Logout
    </button>
  );
}