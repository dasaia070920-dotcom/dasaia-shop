"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const router = useRouter();

  const [search, setSearch] = useState("");

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!search.trim()) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="relative z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[90px] w-full max-w-[1500px] items-center px-8 lg:px-10">

        {/* LOGO */}
        <Link
          href="/"
          className="shrink-0 text-[28px] font-semibold tracking-[0.42em] text-[#111]"
        >
          DASAIA
        </Link>

        {/* MENÚ */}
        <div className="ml-16 hidden items-center gap-12 lg:flex">
          <Link
            href="/"
            className="text-[15px] text-gray-800 transition hover:text-black"
          >
            Inicio
          </Link>

          <Link
            href="/#categories"
            className="text-[15px] text-gray-800 transition hover:text-black"
          >
            Colecciones
          </Link>

          <Link
            href="/#products"
            className="text-[15px] text-gray-800 transition hover:text-black"
          >
            Productos
          </Link>

          <Link
            href="/#about"
            className="text-[15px] text-gray-800 transition hover:text-black"
          >
            Sobre nosotros
          </Link>
        </div>

        {/* ESPACIO FLEXIBLE */}
        <div className="flex-1" />

        {/* BUSCADOR */}
        <form
          onSubmit={handleSearch}
          className="hidden xl:block"
        >
          <div className="flex h-[54px] w-[360px] items-center rounded-full border border-gray-300 bg-white px-5 transition focus-within:border-black">

            <Search
              size={20}
              strokeWidth={1.5}
              className="mr-3 shrink-0 text-gray-500"
            />

            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-[15px] text-gray-800 outline-none placeholder:text-gray-500"
            />

          </div>
        </form>

        {/* ICONOS */}
        <div className="ml-8 flex shrink-0 items-center gap-7 text-[#172033]">

          <Link
            href="/favorites"
            className="transition hover:opacity-60"
            aria-label="Favoritos"
          >
            <Heart
              size={23}
              strokeWidth={1.5}
            />
          </Link>

          <Link
            href="/cart"
            className="relative transition hover:opacity-60"
            aria-label="Carrito"
          >
            <ShoppingBag
              size={23}
              strokeWidth={1.5}
            />

            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            href="/account"
            className="transition hover:opacity-60"
            aria-label="Mi cuenta"
          >
            <User
              size={23}
              strokeWidth={1.5}
            />
          </Link>

        </div>

      </div>
    </nav>
  );
}