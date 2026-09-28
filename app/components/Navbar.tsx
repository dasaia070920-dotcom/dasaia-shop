"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setMenuOpen(false);

    if (!search.trim()) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="relative z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[72px] w-full max-w-[1500px] items-center px-4 sm:h-[80px] sm:px-6 lg:h-[90px] lg:px-10">

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="mr-3 flex h-10 w-10 items-center justify-center lg:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? (
            <X size={24} strokeWidth={1.5} />
          ) : (
            <Menu size={24} strokeWidth={1.5} />
          )}
        </button>

        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="shrink-0 text-[21px] font-semibold tracking-[0.32em] text-[#111] sm:text-[24px] sm:tracking-[0.38em] lg:text-[28px] lg:tracking-[0.42em]"
        >
          DASAIA
        </Link>

        {/* MENÚ ORDENADOR */}
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

        {/* BUSCADOR ORDENADOR */}
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
        <div className="ml-3 flex shrink-0 items-center gap-4 text-[#172033] sm:ml-5 sm:gap-5 lg:ml-8 lg:gap-7">

          {/* BUSCAR MÓVIL */}
          <button
            type="button"
            onClick={() => router.push("/search")}
            className="transition hover:opacity-60 xl:hidden"
            aria-label="Buscar"
          >
            <Search
              size={21}
              strokeWidth={1.5}
            />
          </button>

          {/* FAVORITOS */}
          <Link
            href="/favorites"
            className="transition hover:opacity-60"
            aria-label="Favoritos"
          >
            <Heart
              size={21}
              strokeWidth={1.5}
            />
          </Link>

          {/* CARRITO */}
          <Link
            href="/cart"
            className="relative transition hover:opacity-60"
            aria-label="Carrito"
          >
            <ShoppingBag
              size={21}
              strokeWidth={1.5}
            />

            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* CUENTA */}
          <Link
            href="/account"
            className="hidden transition hover:opacity-60 sm:block"
            aria-label="Mi cuenta"
          >
            <User
              size={21}
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-5 py-6 lg:hidden">
          <div className="flex flex-col">

            <Link
              href="/"
              onClick={closeMenu}
              className="border-b border-gray-100 py-4 text-base font-medium text-gray-900"
            >
              Inicio
            </Link>

            <Link
              href="/#categories"
              onClick={closeMenu}
              className="border-b border-gray-100 py-4 text-base font-medium text-gray-900"
            >
              Colecciones
            </Link>

            <Link
              href="/#products"
              onClick={closeMenu}
              className="border-b border-gray-100 py-4 text-base font-medium text-gray-900"
            >
              Productos
            </Link>

            <Link
              href="/#about"
              onClick={closeMenu}
              className="border-b border-gray-100 py-4 text-base font-medium text-gray-900"
            >
              Sobre nosotros
            </Link>

            <Link
              href="/account"
              onClick={closeMenu}
              className="py-4 text-base font-medium text-gray-900"
            >
              Mi cuenta
            </Link>

            <form
              onSubmit={handleSearch}
              className="mt-4"
            >
              <div className="flex h-12 items-center rounded-full border border-gray-300 px-4">
                <Search
                  size={19}
                  strokeWidth={1.5}
                  className="mr-3 shrink-0 text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
