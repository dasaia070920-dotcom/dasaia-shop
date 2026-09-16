"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Productos",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Clientes",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Ajustes",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();

    router.push("/admin/login");
  }

  return (
    <aside className="flex h-screen w-72 flex-col bg-black text-white">
      <div className="border-b border-white/10 p-8">
        <h1 className="text-3xl font-bold tracking-wider">
          DASAIA
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Panel de administración
        </p>
      </div>

      <nav className="flex-1 px-4 py-8">
        <ul className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-white hover:text-black"
                >
                  <Icon size={22} />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-red-600"
        >
          <LogOut size={22} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}