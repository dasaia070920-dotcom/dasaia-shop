"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-6 py-32">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-sm md:p-16">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle
            size={44}
            className="text-green-600"
          />
        </div>

        <h1 className="mt-8 text-4xl font-bold">
          ¡Pedido realizado!
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-lg text-gray-600">
          Gracias por comprar en DASAIA. Hemos recibido correctamente
          tu pedido y estamos preparando todo para enviártelo.
        </p>

        <p className="mt-4 text-gray-500">
          Recibirás la información de tu pedido en tu correo electrónico.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-black px-8 py-4 font-semibold text-white transition hover:bg-neutral-800"
        >
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}