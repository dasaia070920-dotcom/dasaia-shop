"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
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
              <Link
  key={order.id}
  href={`/admin/orders/${order.id}`}
  className="flex items-center justify-between rounded-2xl border p-5 transition hover:bg-gray-50"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {order.customer_name} {order.customer_lastname}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {order.email}
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {order.total} €
                  </p>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}