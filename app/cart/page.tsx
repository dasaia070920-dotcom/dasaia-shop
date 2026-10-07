"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Truck,
  ShieldCheck,
  ArrowRight,
  X,
  UserRound,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = total >= 60 ? 0 : 4.99;

  const finalTotal = total + shipping;

  return (
    <main className="bg-[#faf9f7] min-h-screen pt-32 pb-20">

      <div className="mx-auto max-w-7xl px-6">

        <h1 className="mb-12 text-5xl font-bold">
          Mi carrito
        </h1>

        {cart.length === 0 ? (
          <div className="rounded-3xl bg-white p-20 text-center shadow">

            <h2 className="text-3xl font-semibold">
              Tu carrito está vacío
            </h2>

            <p className="mt-5 text-gray-500">
              Descubre nuestra colección y encuentra
              tus próximos favoritos.
            </p>

            <Link
              href="/"
              className="mt-10 inline-flex rounded-full bg-black px-8 py-4 text-white transition hover:bg-neutral-800"
            >
              Seguir comprando
            </Link>

          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">

            <div className="space-y-6">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 rounded-3xl bg-white p-6 shadow-sm"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-40 w-32 rounded-2xl object-cover"
                  />

                  <div className="flex flex-1 flex-col justify-between">

                    <div>

                      <h2 className="text-2xl font-semibold">
                        {item.name}
                      </h2>

                      <p className="mt-3 text-xl">
                        {item.price.toFixed(2)} €
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                        className="h-10 w-10 rounded-full border transition hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                        className="h-10 w-10 rounded-full border transition hover:bg-gray-100"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <div className="flex flex-col items-end justify-between">

                    <button
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                      className="text-gray-400 transition hover:text-red-600"
                    >
                      <Trash2 />
                    </button>

                    <p className="text-2xl font-bold">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>

                  </div>

                </div>
              ))}

            </div>

            <div>

              <div className="sticky top-28 rounded-3xl bg-white p-8 shadow">

                <h2 className="mb-8 text-3xl font-bold">
                  Resumen
                </h2>

                <div className="space-y-4">

                  <div className="flex justify-between">
                    <span>Productos</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Envío</span>

                    <span>
                      {shipping === 0
                        ? "Gratis"
                        : `${shipping.toFixed(2)} €`}
                    </span>
                  </div>

                  <div className="border-t pt-5 text-xl font-bold flex justify-between">
                    <span>Total</span>
                    <span>{finalTotal.toFixed(2)} €</span>
                  </div>

                </div>

                {total < 60 && (
                  <p className="mt-6 rounded-xl bg-gray-100 p-4 text-sm">
                    Añade{" "}
                    <strong>
                      {(60 - total).toFixed(2)} €
                    </strong>{" "}
                    para conseguir envío gratuito.
                  </p>
                )}

                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-black py-4 text-lg font-semibold text-white transition hover:bg-neutral-800"
                >
                  Finalizar compra
                  <ArrowRight size={20} />
                </button>

                <button
                  onClick={clearCart}
                  className="mt-4 w-full rounded-full border py-4 transition hover:bg-gray-100"
                >
                  Vaciar carrito
                </button>

                <div className="mt-10 space-y-5 border-t pt-8">

                  <div className="flex items-center gap-3 text-sm">
                    <Truck size={20} />
                    Envío rápido 24/72 h
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <ShieldCheck size={20} />
                    Pago totalmente seguro
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">

          <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-black"
              aria-label="Cerrar"
            >
              <X size={22} />
            </button>

            <div className="mb-8 text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#faf9f7]">
                <ShoppingBag size={28} />
              </div>

              <h2 className="text-3xl font-bold">
                ¿Cómo quieres continuar?
              </h2>

              <p className="mt-3 text-gray-500">
                Puedes comprar sin crear una cuenta o registrarte
                para disfrutar de todas las opciones de tu cuenta.
              </p>

            </div>

            <div className="space-y-4">

              <Link
                href="/checkout"
                className="block rounded-2xl border border-gray-200 p-5 transition hover:border-black hover:bg-[#faf9f7]"
                onClick={() => setShowCheckoutModal(false)}
              >
                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
                    <ShoppingBag size={20} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      Continuar como invitada/o
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      No necesitas crear una cuenta. Recibirás la
                      confirmación y los datos de tu pedido por email.
                    </p>
                  </div>

                </div>
              </Link>

              <Link
                href="/login"
                className="block rounded-2xl border border-gray-200 p-5 transition hover:border-black hover:bg-[#faf9f7]"
                onClick={() => setShowCheckoutModal(false)}
              >
                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#faf9f7] text-black">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      Crear una cuenta
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Podrás consultar tus pedidos y gestionar tu
                      cuenta desde DASAIA.
                    </p>
                  </div>

                </div>
              </Link>

            </div>

            <button
              onClick={() => setShowCheckoutModal(false)}
              className="mt-6 w-full py-3 text-sm text-gray-500 transition hover:text-black"
            >
              Seguir revisando mi carrito
            </button>

          </div>

        </div>
      )}

    </main>
  );
}