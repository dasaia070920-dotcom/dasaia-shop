"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  customer_name: string;
  customer_lastname: string | null;
  email: string;
  phone: string | null;
  address: string;
  city: string;
  postal_code: string;
  total: number;
  status: string;
  payment_status: string | null;
  payment_expires_at: string | null;
  created_at: string;
};

type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    loadOrder();

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId]);

  async function loadOrder() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: orderData, error: orderError } =
      await supabase
        .from("orders")
        .select(
          "id, customer_name, customer_lastname, email, phone, address, city, postal_code, total, status, payment_status, payment_expires_at, created_at"
        )
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single();

    if (orderError || !orderData) {
      setLoading(false);
      return;
    }

    const { data: itemsData } = await supabase
      .from("order_items")
      .select(
        "id, product_id, product_name, quantity, price"
      )
      .eq("order_id", orderId);

    setOrder(orderData);
    setItems(itemsData || []);
    setLoading(false);
  }

  function getRemainingTime() {
    if (!order?.payment_expires_at) return null;

    const difference =
      new Date(order.payment_expires_at).getTime() - now;

    if (difference <= 0) {
      return "00:00:00";
    }

    const totalSeconds = Math.floor(difference / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Cargando pedido...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <div className="rounded-3xl bg-white p-10 text-center shadow">
          <h1 className="mb-3 text-2xl font-bold">
            Pedido no encontrado
          </h1>

          <p className="mb-6 text-gray-500">
            No hemos podido encontrar este pedido.
          </p>

          <Link
            href="/orders"
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            Volver a mis pedidos
          </Link>
        </div>
      </main>
    );
  }

  const remainingTime = getRemainingTime();

  const isPending =
    order.payment_status === "pending" &&
    order.status === "Pago pendiente";

  const expired =
    isPending &&
    order.payment_expires_at &&
    new Date(order.payment_expires_at).getTime() <= now;

  return (
    <main className="mx-auto max-w-4xl p-8">
      <Link
        href="/orders"
        className="mb-8 inline-block text-sm font-semibold"
      >
        ← Volver a mis pedidos
      </Link>

      <div className="mb-8">
        <p className="text-sm text-gray-500">
          Pedido
        </p>

        <h1 className="text-4xl font-bold">
          #{order.id.slice(0, 8)}
        </h1>

        <p className="mt-2 text-gray-500">
          {new Date(order.created_at).toLocaleDateString(
            "es-ES"
          )}
        </p>
      </div>

      {isPending && !expired && (
        <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold text-amber-900">
            Pago pendiente
          </p>

          <p className="mt-2 text-sm text-amber-800">
            Este pedido está reservado mientras completas
            el pago.
          </p>

          <div className="mt-4 text-4xl font-bold text-amber-900">
            {remainingTime}
          </div>

          <Link
            href="/orders"
            className="mt-5 inline-block rounded-full bg-black px-6 py-3 font-semibold text-white"
          >
            Continuar con el pago
          </Link>
        </div>
      )}

      {expired && (
        <div className="mb-8 rounded-3xl border border-gray-200 bg-gray-50 p-6">
          <p className="font-semibold">
            Pedido cancelado
          </p>

          <p className="mt-2 text-sm text-gray-500">
            El tiempo para completar el pago ha terminado.
          </p>
        </div>
      )}

      <div className="mb-8 rounded-3xl bg-white p-6 shadow">
        <h2 className="mb-5 text-xl font-bold">
          Productos
        </h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-gray-100 pb-4"
            >
              <div>
                <p className="font-semibold">
                  {item.product_name}
                </p>

                <p className="text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </p>
              </div>

              <p className="font-semibold">
                {(
                  Number(item.price) * item.quantity
                ).toFixed(2)}{" "}
                €
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t pt-5 text-xl font-bold">
          <span>Total</span>

          <span>
            {Number(order.total).toFixed(2)} €
          </span>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow">
        <h2 className="mb-5 text-xl font-bold">
          Datos del pedido
        </h2>

        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Nombre:</strong>{" "}
            {order.customer_name}{" "}
            {order.customer_lastname || ""}
          </p>

          <p>
            <strong>Email:</strong> {order.email}
          </p>

          {order.phone && (
            <p>
              <strong>Teléfono:</strong> {order.phone}
            </p>
          )}

          <p>
            <strong>Dirección:</strong> {order.address}
          </p>

          <p>
            <strong>Ciudad:</strong> {order.city}
          </p>

          <p>
            <strong>Código postal:</strong>{" "}
            {order.postal_code}
          </p>

          <p>
            <strong>Estado:</strong>{" "}
            {expired ? "Cancelado" : order.status}
          </p>
        </div>
      </div>
    </main>
  );
}