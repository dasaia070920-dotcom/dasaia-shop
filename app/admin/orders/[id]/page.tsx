"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  customer_name: string;
  customer_lastname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  total: number;
  status: string;
  created_at: string;
};

type OrderItem = {
  id: string;
  product_name: string;
  image: string;
  quantity: number;
  price: number;
};

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadOrder() {
      const { id } = await params;

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (orderError) {
        alert(orderError.message);
        return;
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", id);

      if (itemsError) {
        alert(itemsError.message);
        return;
      }

      setOrder(orderData);
      setStatus(orderData.status);
      setItems(itemsData || []);
    }

    loadOrder();
  }, [params]);

  async function updateStatus(newStatus: string) {
    setStatus(newStatus);

    if (!order) return;

    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
      })
      .eq("id", order.id);

    if (error) {
      alert(error.message);
    } else {
      setOrder({
        ...order,
        status: newStatus,
      });
    }
  }

  if (!order) {
    return <p className="p-10">Cargando pedido...</p>;
  }

  return (
    <main className="mx-auto max-w-6xl p-10">

      <Link
        href="/admin/orders"
        className="mb-8 inline-block text-blue-600 hover:underline"
      >
        ← Volver a pedidos
      </Link>

      <h1 className="mb-8 text-4xl font-bold">
        Pedido
      </h1>

      <div className="mb-10 rounded-3xl bg-white p-8 shadow">

        <h2 className="mb-6 text-2xl font-bold">
          Datos del cliente
        </h2>

        <div className="space-y-3">

          <p>
            <strong>Nombre:</strong>{" "}
            {order.customer_name} {order.customer_lastname}
          </p>

          <p>
            <strong>Email:</strong> {order.email}
          </p>

          <p>
            <strong>Teléfono:</strong> {order.phone}
          </p>

          <p>
            <strong>Dirección:</strong> {order.address}
          </p>

          <p>
            <strong>Ciudad:</strong> {order.city}
          </p>

          <p>
            <strong>Código Postal:</strong> {order.postal_code}
          </p>

          <div className="flex items-center gap-3">

            <strong>Estado:</strong>

            <select
              value={status}
              onChange={(e) => updateStatus(e.target.value)}
              className="rounded-lg border p-2"
            >
              <option>Pendiente</option>
              <option>Preparando</option>
              <option>Enviado</option>
              <option>Entregado</option>
            </select>

          </div>

        </div>

      </div>
            <div className="rounded-3xl bg-white p-8 shadow">

        <h2 className="mb-6 text-2xl font-bold">
          Productos del pedido
        </h2>

        <div className="space-y-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-5 rounded-2xl border p-5"
            >
              <img
                src={item.image}
                alt={item.product_name}
                className="h-24 w-24 rounded-xl object-cover"
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {item.product_name}
                </h3>

                <p className="text-gray-500">
                  Cantidad: {item.quantity}
                </p>

                <p className="font-semibold">
                  {item.price} €
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg">
                  {(item.price * item.quantity).toFixed(2)} €
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between border-t pt-6">
          <span className="text-2xl font-bold">
            Total
          </span>

          <span className="text-3xl font-bold">
            {order.total} €
          </span>
        </div>

      </div>

    </main>
  );
}