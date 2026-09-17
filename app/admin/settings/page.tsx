"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("DASAIA");
  const [email, setEmail] = useState("dasaia070920@gmail.com");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shippingCost, setShippingCost] = useState("4.99");
  const [freeShippingFrom, setFreeShippingFrom] = useState("60");

  function saveSettings() {
    alert("✅ Configuración guardada");
  }

  return (
    <>
      <h1 className="mb-10 text-4xl font-bold">
        Ajustes
      </h1>

      <div className="max-w-4xl space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-semibold">
            Información de la tienda
          </h2>

          <p className="mt-2 text-gray-500">
            Datos básicos de tu tienda DASAIA.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">
                Nombre de la tienda
              </label>

              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-xl border p-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border p-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Teléfono
              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Teléfono de la tienda"
                className="w-full rounded-xl border p-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Dirección
              </label>

              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Dirección de la tienda"
                className="w-full rounded-xl border p-3 outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-semibold">
            Envíos
          </h2>

          <p className="mt-2 text-gray-500">
            Configura los gastos de envío de DASAIA.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">
                Gastos de envío
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  className="w-full rounded-xl border p-3 pr-10 outline-none focus:border-black"
                />

                <span className="absolute right-4 top-3 text-gray-500">
                  €
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Envío gratis a partir de
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={freeShippingFrom}
                  onChange={(e) =>
                    setFreeShippingFrom(e.target.value)
                  }
                  className="w-full rounded-xl border p-3 pr-10 outline-none focus:border-black"
                />

                <span className="absolute right-4 top-3 text-gray-500">
                  €
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={saveSettings}
          className="rounded-xl bg-black px-8 py-4 font-medium text-white transition hover:bg-neutral-800"
        >
          Guardar configuración
        </button>
      </div>
    </>
  );
}