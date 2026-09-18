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
<main className="flex min-h-screen items-center justify-center bg-[#faf9f7]">
<p className="text-gray-500">Cargando tu cuenta...</p>
</main>
);
}

return (
<main className="min-h-screen bg-[#faf9f7] px-6 py-16">
<div className="mx-auto max-w-6xl">
<div className="mb-12">
<p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#c6a96b]">
DASAIA
</p>

      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
        Mi cuenta
      </h1>

      <p className="mt-4 text-gray-600">
        Gestiona tu cuenta, tus favoritos y tus pedidos.
      </p>
    </div>

    <div className="grid gap-8 lg:grid-cols-3">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white">
          👤
        </div>

        <h2 className="mb-2 text-2xl font-semibold">
          Mis datos
        </h2>

        <p className="mb-6 text-sm text-gray-500">
          Esta es la cuenta con la que has iniciado sesión.
        </p>

        <div className="rounded-2xl bg-[#faf9f7] p-5">
          <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
            Correo electrónico
          </p>

          <p className="break-all font-medium">
            {email}
          </p>
        </div>
      </section>

      <Link
        href="/favorites"
        className="group rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white">
          ❤️
        </div>

        <h2 className="mb-2 text-2xl font-semibold">
          Mis favoritos
        </h2>

        <p className="text-gray-500">
          Consulta los productos que has guardado para verlos más tarde.
        </p>

        <p className="mt-8 font-semibold group-hover:underline">
          Ver favoritos →
        </p>
      </Link>

      <Link
        href="/orders"
        className="group rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white">
          📦
        </div>

        <h2 className="mb-2 text-2xl font-semibold">
          Mis pedidos
        </h2>

        <p className="text-gray-500">
          Consulta tus compras, los detalles de cada pedido y su estado.
        </p>

        <p className="mt-8 font-semibold group-hover:underline">
          Ver mis pedidos →
        </p>
      </Link>
    </div>

    <div className="mt-10 flex flex-wrap gap-4">
      <Link
        href="/"
        className="rounded-full border border-black px-7 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
      >
        ← Volver a la tienda
      </Link>

      <button
        onClick={signOut}
        className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        Cerrar sesión
      </button>
    </div>
  </div>
</main>

);
}