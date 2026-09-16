"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    setEmail(user.email || "");
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-2 text-4xl font-bold">
        Mi cuenta
      </h1>

      <p className="mb-10 text-gray-600">
        Bienvenida, <strong>{email}</strong>
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/favorites"
          className="rounded-3xl bg-white p-8 shadow transition hover:shadow-lg"
        >
          <h2 className="mb-2 text-2xl font-semibold">
            ❤️ Favoritos
          </h2>

          <p className="text-gray-600">
            Consulta todos tus productos favoritos.
          </p>
        </Link>

        <Link
          href="/account/orders"
          className="rounded-3xl bg-white p-8 shadow transition hover:shadow-lg"
        >
          <h2 className="mb-2 text-2xl font-semibold">
            📦 Mis pedidos
          </h2>

          <p className="text-gray-600">
            Consulta el estado de tus compras.
          </p>
        </Link>
      </div>

      <button
        onClick={signOut}
        className="mt-10 rounded-xl bg-red-600 px-6 py-3 text-white transition hover:bg-red-700"
      >
        Cerrar sesión
      </button>
    </main>
  );
}