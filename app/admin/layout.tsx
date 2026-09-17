"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "./components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // La página de login no necesita comprobar si ya hay sesión
    if (pathname === "/admin/login") {
      setChecking(false);
      setAuthorized(true);
      return;
    }

    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      setAuthorized(true);
      setChecking(false);
    }

    checkUser();
  }, [pathname, router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Comprobando acceso...</p>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  // El login se muestra sin la barra lateral
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>
    </div>
  );
}