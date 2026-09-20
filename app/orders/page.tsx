"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  total: number;
  status: string;
  payment_status: string | null;
  payment_expires_at: string | null;
  created_at: string;
};

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
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
      .select(
        "id, total, status, payment_status, payment_expires_at, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  function getRemainingTime(expiresAt: string | null) {
    if (!expiresAt) return null;

    const difference = new Date(expiresAt).getTime() - now;

    if (difference <= 0) {
      return "00:00:00";
    }

    const totalSeconds = Math.floor(difference / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  async function continuePayment(orderId: string) {
    try {
      setPayingOrderId(orderId);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const headers: HeadersInit = {};

      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch(
        `/api/orders/${orderId}/pay`,
        {
          method: "GET",
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "No se ha podido continuar con el pago."
        );
      }

      if (!data.url) {
        throw new Error(
          "No se ha encontrado la página de pago."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No se ha podido continuar con el pago."
      );

      setPayingOrderId(null);

      await loadOrders();
    }
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
          {orders.map((order) => {
            const remainingTime = getRemainingTime(
              order.payment_expires_at
            );

            const isPending =
              order.payment_status === "pending" &&
              order.status === "Pago pendiente";

            const isExpired =
              order.payment_status === "expired" ||
              order.status === "Cancelado";

            const timeHasExpired =
              isPending &&
              order.payment_expires_at &&
              new Date(order.payment_expires_at).getTime() <= now;

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-white p-6 shadow"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Pedido
                    </p>

                    <h2 className="font-semibold">
                      #{order.id.slice(0, 8)}
                    </h2>

                    <p className="mt-2 text-gray-500">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString("es-ES")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Estado
                    </p>

                    <p className="font-semibold">
                      {timeHasExpired
                        ? "Cancelado"
                        : order.status}
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

                {isPending && !timeHasExpired && (
                  <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <p className="font-semibold text-amber-900">
                      Pago pendiente
                    </p>

                    <p className="mt-1 text-sm text-amber-800">
                      Tienes tiempo para terminar el pago de este
                      pedido.
                    </p>

                    <div className="mt-3 text-3xl font-bold tracking-wider text-amber-900">
                      {remainingTime}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        continuePayment(order.id)
                      }
                      disabled={payingOrderId === order.id}
                      className="mt-5 w-full rounded-full bg-black py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {payingOrderId === order.id
                        ? "Abriendo pago..."
                        : "Continuar con el pago"}
                    </button>

                    <p className="mt-3 text-xs text-amber-700">
                      Si no se completa el pago antes de que termine
                      la cuenta atrás, el pedido se cancelará.
                    </p>
                  </div>
                )}

                {(isExpired || timeHasExpired) && (
                  <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <p className="font-semibold text-gray-800">
                      Pedido cancelado
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      El plazo para completar el pago ha terminado.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}