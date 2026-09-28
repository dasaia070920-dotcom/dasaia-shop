"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_lastname: string;
  email: string;
  total: number;
  status: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setOrders(data || []);
  }

  function getStatusClasses(status: string) {
    switch (status) {
      case "Entregado":
        return "bg-green-100 text-green-800";

      case "Cancelado":
        return "bg-red-100 text-red-800";

      case "Preparando":
        return "bg-sky-100 text-sky-800";

      case "Enviado":
        return "bg-purple-100 text-purple-800";

      default:
        return "bg-yellow-100 text-yellow-800";
    }
  }

  return (
    <>
      <h1 className="mb-10 text-4xl font-bold">
        Pedidos
      </h1>

      <div className="rounded-3xl bg-white p-10 shadow">
        <h2 className="mb-8 text-2xl font-semibold">
          Gestión de pedidos
        </h2>

        {orders.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-10 text-center text-gray-400">
            Todavía no hay pedidos.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <a
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition hover:bg-gray-50"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {order.customer_name}{" "}
                    {order.customer_lastname}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {order.email}
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {Number(order.total).toFixed(2)} €
                  </p>

                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}