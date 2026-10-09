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
  customer_comments: string | null;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
};

type OrderItem = {
  id: string;
  product_name: string;
  image: string;
  quantity: number;
  price: number;
};

type ReturnRequest = {
  id: string;
  order_item_id: string;
  reason: string;
  status: string;
  request_type: string | null;
  requested_size: string | null;
  requested_color: string | null;
};

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadOrder() {
      const { id } = await params;

      const { data: orderData, error: orderError } =
        await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single();

      if (orderError) {
        alert(orderError.message);
        return;
      }

      const { data: itemsData, error: itemsError } =
        await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", id);

      if (itemsError) {
        alert(itemsError.message);
        return;
      }

      const { data: returnData, error: returnError } =
        await supabase
          .from("returns")
          .select(
            "id, order_item_id, reason, status, request_type, requested_size, requested_color"
          )
          .eq("order_id", id);

      if (returnError) {
        alert(returnError.message);
        return;
      }

      setOrder(orderData);
      setStatus(orderData.status);
      setItems(itemsData || []);
      setReturns(returnData || []);
    }

    loadOrder();
  }, [params]);

  async function updateStatus(newStatus: string) {
    if (!order) return;

    const previousStatus = order.status;

    if (previousStatus === newStatus) {
      return;
    }

    setStatus(newStatus);

    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
      })
      .eq("id", order.id);

    if (error) {
      alert(error.message);
      setStatus(previousStatus);
      return;
    }

    setOrder({
      ...order,
      status: newStatus,
    });

    if (newStatus === "Enviado" && previousStatus !== "Enviado") {
      try {
        const response = await fetch("/api/orders/status-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "El pedido se actualizó, pero no se pudo enviar el correo:",
            data
          );

          alert(
            "El pedido se ha marcado como enviado, pero no se ha podido enviar el correo al cliente."
          );
        }
      } catch (error) {
        console.error("Error enviando el correo:", error);

        alert(
          "El pedido se ha marcado como enviado, pero ha ocurrido un error al enviar el correo."
        );
      }
    }
  }

  function getStatusClasses() {
    switch (status) {
      case "Entregado":
        return "bg-green-100 text-green-800 border-green-300";

      case "Cancelado":
        return "bg-red-100 text-red-800 border-red-300";

      case "Preparando":
        return "bg-sky-100 text-sky-800 border-sky-300";

      case "Enviado":
        return "bg-purple-100 text-purple-800 border-purple-300";

      case "En proceso de devolución":
        return "bg-orange-100 text-orange-800 border-orange-300";

      case "Devuelto":
        return "bg-blue-100 text-blue-800 border-blue-300";

      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  }

  function getPaymentStatusClasses() {
    switch (order?.payment_status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-300";

      case "expired":
        return "bg-red-100 text-red-800 border-red-300";

      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  }

  function getPaymentStatusText() {
    switch (order?.payment_status) {
      case "paid":
        return "Pagado";

      case "expired":
        return "Caducado";

      case "pending":
        return "Pendiente";

      default:
        return order?.payment_status || "Desconocido";
    }
  }

  function getReturnStatusClasses(returnStatus: string) {
    switch (returnStatus) {
      case "Aceptada":
        return "bg-green-100 text-green-800 border-green-300";

      case "Rechazada":
        return "bg-red-100 text-red-800 border-red-300";

      case "Completada":
        return "bg-blue-100 text-blue-800 border-blue-300";

      case "Solicitado":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
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

          <p>
            <strong>Estado del pago:</strong>{" "}
            <span
              className={`inline-block rounded-lg border px-3 py-1 font-medium ${getPaymentStatusClasses()}`}
            >
              {getPaymentStatusText()}
            </span>
          </p>

          <div className="flex items-center gap-3 pt-3">
            <strong>Estado:</strong>

            <select
              value={status}
              onChange={(e) => updateStatus(e.target.value)}
              className={`rounded-lg border p-2 font-medium ${getStatusClasses()}`}
            >
              <option value="Pendiente">
                Pendiente
              </option>

              <option value="Preparando">
                Preparando
              </option>

              <option value="Enviado">
                Enviado
              </option>

              <option value="Entregado">
                Entregado
              </option>

              <option value="En proceso de devolución">
                En proceso de devolución
              </option>

              <option value="Devuelto">
                Devuelto
              </option>

              <option value="Cancelado">
                Cancelado
              </option>
            </select>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="mb-3 text-lg font-bold">
            Comentarios sobre el pedido
          </h3>

          {order.customer_comments ? (
            <div className="rounded-2xl bg-gray-50 p-5 text-gray-700">
              {order.customer_comments}
            </div>
          ) : (
            <p className="text-gray-500">
              El cliente no ha dejado ningún comentario.
            </p>
          )}
        </div>
      </div>

      <div className="mb-10 rounded-3xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold">
          Productos del pedido
        </h2>

        <div className="space-y-5">
          {items.map((item) => {
            const itemReturn = returns.find(
              (request) =>
                request.order_item_id === item.id
            );

            return (
              <div
                key={item.id}
                className="rounded-2xl border p-5"
              >
                <div className="flex items-center gap-5">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                      Sin imagen
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {item.product_name}
                    </h3>

                    <p className="text-gray-500">
                      Cantidad: {item.quantity}
                    </p>

                    <p className="font-semibold">
                      {Number(item.price).toFixed(2)} €
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toFixed(2)} €
                    </p>
                  </div>
                </div>

                {itemReturn && (
                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <h4 className="font-bold text-amber-900">
                      Solicitud de devolución o cambio
                    </h4>

                    <div className="mt-3 space-y-3 text-sm text-amber-900">
                      <p>
                        <strong>Tipo:</strong>{" "}
                        {itemReturn.request_type ||
                          "No especificado"}
                      </p>

                      {itemReturn.requested_size && (
                        <p>
                          <strong>Talla solicitada:</strong>{" "}
                          {itemReturn.requested_size}
                        </p>
                      )}

                      {itemReturn.requested_color && (
                        <p>
                          <strong>Color solicitado:</strong>{" "}
                          {itemReturn.requested_color}
                        </p>
                      )}

                      <p>
                        <strong>Motivo:</strong>{" "}
                        {itemReturn.reason}
                      </p>

                      <div className="flex items-center gap-2">
                        <strong>
                          Estado de la solicitud:
                        </strong>

                        <span
                          className={`inline-block rounded-lg border px-3 py-1 font-medium ${getReturnStatusClasses(
                            itemReturn.status
                          )}`}
                        >
                          {itemReturn.status || "Solicitado"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-between border-t pt-6">
          <span className="text-2xl font-bold">
            Total
          </span>

          <span className="text-3xl font-bold">
            {Number(order.total).toFixed(2)} €
          </span>
        </div>
      </div>
    </main>
  );
}