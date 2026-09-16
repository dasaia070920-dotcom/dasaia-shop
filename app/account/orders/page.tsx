"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-10">
        <h1 className="text-4xl font-bold">
          Cargando pedidos...
        </h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-10">
      <h1 className="mb-10 text-4xl font-bold">
        Mis pedidos
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 shadow">
          <p className="text-lg text-gray-600">
            Todavía no has realizado ningún pedido.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block rounded-3xl bg-white p-8 shadow transition hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Pedido #{order.id.slice(0, 8)}
                  </h2>

                  <p className="mt-2 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {Number(order.total).toFixed(2)} €
                  </p>

                  <span className="rounded-full bg-gray-100 px-4 py-2 text-sm">
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}