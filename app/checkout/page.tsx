"use client";

import { useState } from "react";
import Link from "next/link";

import { useCart } from "../context/CartContext";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const { cart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerLastname, setCustomerLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 60 ? 0 : 4.99;
  const total = subtotal + shipping;

  async function handlePayment() {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    if (
      !customerName.trim() ||
      !customerLastname.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !postalCode.trim()
    ) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Obtenemos la sesión de la cuenta que está conectada.
       */
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      /*
       * Si hay una sesión iniciada, enviamos el token
       * para que el servidor pueda identificar al usuario.
       */
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers,
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerLastname: customerLastname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
          cart,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "No se ha podido iniciar el pago."
        );
      }

      if (!data.url) {
        throw new Error(
          "Stripe no ha devuelto la dirección de pago."
        );
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.error(error);

      alert(
        error?.message ||
          "Ha ocurrido un error al iniciar el pago."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-4xl font-bold">
          Finalizar compra
        </h1>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              Datos del cliente
            </h2>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Nombre"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-black"
              />

              <input
                type="text"
                placeholder="Apellidos"
                value={customerLastname}
                onChange={(e) =>
                  setCustomerLastname(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-black"
              />

              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-black"
              />

              <input
                type="tel"
                placeholder="Teléfono"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-black"
              />

              <input
                type="text"
                placeholder="Dirección"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-black"
              />

              <input
                type="text"
                placeholder="Ciudad"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-black"
              />

              <input
                type="text"
                placeholder="Código postal"
                value={postalCode}
                onChange={(e) =>
                  setPostalCode(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">
              Resumen del pedido
            </h2>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 border-b pb-3"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span className="font-medium">
                    {(item.price * item.quantity).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3 border-t pt-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between">
                <span>Envío</span>

                <span>
                  {shipping === 0
                    ? "Gratis"
                    : `${shipping.toFixed(2)} €`}
                </span>
              </div>

              <div className="flex justify-between pt-4 text-2xl font-bold">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading || cart.length === 0}
              className="mt-8 w-full rounded-full bg-black py-4 text-lg font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Preparando pago..."
                : "Pagar ahora"}
            </button>

            <p className="mt-4 text-center text-sm text-gray-500">
              Serás redirigida a Stripe para realizar el pago de forma
              segura.
            </p>

            <Link
              href="/cart"
              className="mt-4 block text-center text-gray-500 hover:text-black"
            >
              Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}