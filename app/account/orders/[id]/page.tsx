"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_lastname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  total: number;
  status: string;
};

type OrderItem = {
  id: string;
  product_name: string;
  image: string;
  price: number;
  quantity: number;
};

export default function AccountOrderDetailPage() {
  const router = useRouter();
  const params = useParams();

  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single();

      if (orderError || !orderData) {
        throw new Error("No se ha encontrado el pedido.");
      }

      const { data: itemData, error: itemError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (itemError) {
        throw itemError;
      }

      setOrder(orderData);
      setItems(itemData || []);
    } catch (error: any) {
      console.error(error);

      alert(
        error?.message ||
          "No se ha podido cargar el pedido."
      );

      router.push("/account/orders");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-10">
        <p className="text-gray-500">
          Cargando pedido...
        </p>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <main className="mx-auto max-w-5xl p-10">
      <Link
        href="/account/orders"
        className="mb-8 inline-block text-gray-500 hover:text-black"
      >
        ← Volver a mis pedidos
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Pedido
        </h1>

        <p className="mt-2 text-gray-500">
          Realizado el{" "}
          {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-8 shadow">
          <h2 className="mb-6 text-2xl font-bold">
            Estado del pedido
          </h2>

          <span className="inline-block rounded-full bg-gray-100 px-4 py-2 font-medium">
            {order.status}
          </span>

          <h2 className="mb-6 mt-10 text-2xl font-bold">
            Datos de entrega
          </h2>

          <div className="space-y-2 text-gray-600">
            <p>
              <strong className="text-black">
                {order.customer_name}{" "}
                {order.customer_lastname}
              </strong>
            </p>

            <p>{order.email}</p>
            <p>{order.phone}</p>
            <p>{order.address}</p>
            <p>
              {order.postal_code} {order.city}
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow">
          <h2 className="mb-6 text-2xl font-bold">
            Productos
          </h2>

          <div className="space-y-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b pb-5"
              >
                <img
                  src={item.image}
                  alt={item.product_name}
                  className="h-24 w-24 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {item.product_name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Cantidad: {item.quantity}
                  </p>

                  <p className="mt-2 font-medium">
                    {Number(item.price).toFixed(2)} €
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between border-t pt-6 text-2xl font-bold">
            <span>Total</span>
            <span>
              {Number(order.total).toFixed(2)} €
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}