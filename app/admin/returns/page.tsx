"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ReturnRequest = {
id: string;
order_id: string;
user_id: string;
order_item_id: string;
reason: string;
status: string;
request_type: string | null;
requested_size: string | null;
requested_color: string | null;
};

type Order = {
id: string;
customer_name: string;
customer_lastname: string;
email: string;
};

type OrderItem = {
id: string;
product_name: string;
image: string;
quantity: number;
price: number;
};

type ReturnWithDetails = ReturnRequest & {
order: Order | null;
item: OrderItem | null;
};

export default function ReturnsPage() {
const [returns, setReturns] = useState<ReturnWithDetails[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
loadReturns();
}, []);

async function loadReturns() {
setLoading(true);

const { data: returnData, error: returnError } = await supabase
  .from("returns")
  .select("*")
  .order("id", { ascending: false });

if (returnError) {
  alert(returnError.message);
  setLoading(false);
  return;
}

const requests = returnData || [];

const orderIds = [
  ...new Set(requests.map((item) => item.order_id)),
];

const itemIds = [
  ...new Set(requests.map((item) => item.order_item_id)),
];

let orders: Order[] = [];
let orderItems: OrderItem[] = [];

if (orderIds.length > 0) {
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("id, customer_name, customer_lastname, email")
    .in("id", orderIds);

  if (orderError) {
    alert(orderError.message);
    setLoading(false);
    return;
  }

  orders = orderData || [];
}

if (itemIds.length > 0) {
  const { data: itemData, error: itemError } = await supabase
    .from("order_items")
    .select("id, product_name, image, quantity, price")
    .in("id", itemIds);

  if (itemError) {
    alert(itemError.message);
    setLoading(false);
    return;
  }

  orderItems = itemData || [];
}

const completeRequests: ReturnWithDetails[] = requests.map(
  (request) => ({
    ...request,
    order:
      orders.find((order) => order.id === request.order_id) || null,
    item:
      orderItems.find(
        (item) => item.id === request.order_item_id
      ) || null,
  })
);

setReturns(completeRequests);
setLoading(false);

}

async function updateStatus(returnId: string, newStatus: string) {
const { error } = await supabase
.from("returns")
.update({ status: newStatus })
.eq("id", returnId);

if (error) {
  alert(error.message);
  return;
}

setReturns((currentReturns) =>
  currentReturns.map((request) =>
    request.id === returnId
      ? { ...request, status: newStatus }
      : request
  )
);

}

function getStatusClasses(status: string) {
switch (status) {
case "Aceptada":
return "bg-green-100 text-green-800 border-green-300";
case "Rechazada":
return "bg-red-100 text-red-800 border-red-300";
case "En proceso de devolución":
return "bg-blue-100 text-blue-800 border-blue-300";
case "Devuelto":
return "bg-purple-100 text-purple-800 border-purple-300";
default:
return "bg-yellow-100 text-yellow-800 border-yellow-300";
}
}

return ( <main className="mx-auto max-w-7xl p-10"> <div className="mb-10"> <h1 className="text-4xl font-bold">Devoluciones y cambios</h1> <p className="mt-2 text-gray-500">
Solicitudes realizadas por los clientes. </p> </div>

```
  {loading ? (
    <p>Cargando solicitudes...</p>
  ) : returns.length === 0 ? (
    <div className="rounded-3xl bg-white p-10 text-center shadow">
      <h2 className="text-2xl font-bold">No hay solicitudes</h2>
      <p className="mt-2 text-gray-500">
        Cuando un cliente solicite una devolución o un cambio,
        aparecerá aquí.
      </p>
    </div>
  ) : (
    <div className="space-y-6">
      {returns.map((request) => (
        <div
          key={request.id}
          className="rounded-3xl bg-white p-8 shadow"
        >
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium">
                  {request.request_type || "Solicitud"}
                </span>

                <select
                  value={request.status || "Solicitado"}
                  onChange={(e) =>
                    updateStatus(request.id, e.target.value)
                  }
                  className={`rounded-lg border px-3 py-1 text-sm font-medium ${getStatusClasses(
                    request.status
                  )}`}
                >
                  <option value="Solicitado">Solicitado</option>
                  <option value="Aceptada">Aceptada</option>
                  <option value="En proceso de devolución">
                    En proceso de devolución
                  </option>
                  <option value="Devuelto">Devuelto</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </div>

              <h2 className="text-2xl font-bold">
                {request.item?.product_name || "Producto"}
              </h2>

              <div className="mt-5 space-y-2 text-gray-700">
                <p>
                  <strong>Cliente:</strong>{" "}
                  {request.order
                    ? `${request.order.customer_name} ${request.order.customer_lastname}`
                    : "No disponible"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {request.order?.email || "No disponible"}
                </p>

                <p>
                  <strong>Pedido:</strong> {request.order_id}
                </p>

                {request.requested_size && (
                  <p>
                    <strong>Talla solicitada:</strong>{" "}
                    {request.requested_size}
                  </p>
                )}

                {request.requested_color && (
                  <p>
                    <strong>Color solicitado:</strong>{" "}
                    {request.requested_color}
                  </p>
                )}

                <div className="pt-3">
                  <strong>Motivo:</strong>
                  <div className="mt-2 rounded-2xl bg-gray-50 p-4 text-gray-700">
                    {request.reason}
                  </div>
                </div>
              </div>
            </div>

            {request.item?.image && (
              <div className="flex items-start justify-center lg:w-40">
                <img
                  src={request.item.image}
                  alt={request.item.product_name}
                  className="h-40 w-40 rounded-2xl object-cover"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</main>


);
}
