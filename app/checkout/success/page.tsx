"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // Solo vaciamos el carrito una vez al entrar en esta página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-32">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✓
        </div>

        <h1 className="mt-8 text-4xl font-bold">
          ¡Pago realizado correctamente!
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-600">
          Gracias por tu compra en DASAIA. Hemos recibido tu pago
          correctamente.
        </p>

        <p className="mt-3 text-gray-500">
          Recibirás la información de tu pedido en tu correo electrónico.
        </p>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-10 rounded-full bg-black px-8 py-4 font-semibold text-white transition hover:bg-neutral-800"
        >
          Volver a DASAIA
        </button>
      </div>
    </main>
  );
}