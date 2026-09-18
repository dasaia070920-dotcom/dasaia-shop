"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomeButton() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  if (pathname === "/") {
    return null;
  }

  return (
    <Link
      href="/"
      className="fixed bottom-6 left-6 z-50 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-neutral-800"
    >
      ← Volver al inicio
    </Link>
  );
}