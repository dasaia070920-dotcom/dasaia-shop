"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
};

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }
    if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Cargando pedidos...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-10 text-4xl font-bold">
        Mis pedidos
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow">
          <h2 className="mb-3 text-2xl font-semibold">
            Todavía no has realizado ningún pedido
          </h2>

          <p className="mb-6 text-gray-500">
            Cuando realices tu primera compra aparecerá aquí.
          </p>

          <Link
            href="/"
            className="rounded-xl bg-black px-6 py-3 text-white transition hover:bg-neutral-800"
          >
            Ir a comprar
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl bg-white p-6 shadow"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Pedido
                  </p>

                  <h2 className="font-semibold">
                    #{order.id.slice(0, 8)}
                  </h2>

                  <p className="mt-2 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("es-ES")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Estado
                  </p>

                  <p className="font-semibold">
                    {order.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="text-xl font-bold">
                    {Number(order.total).toFixed(2)} €
                  </p>
                </div>

                <Link
                  href={`/orders/${order.id}`}
                  className="rounded-xl bg-black px-5 py-3 text-center text-white transition hover:bg-neutral-800"
                >
                  Ver pedido
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}