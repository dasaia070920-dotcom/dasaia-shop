"use client";

import Link from "next/link";

type Props = {
totalProducts: number;
totalOrders: number;
totalCustomers: number;
totalSales: number;
totalReturns: number;
};

export default function DashboardStats({
totalProducts,
totalOrders,
totalCustomers,
totalSales,
totalReturns,
}: Props) {
return ( <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5"> <Link
     href="/admin/products"
     className="block rounded-3xl bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
   > <div className="mb-4 inline-flex rounded-2xl bg-black p-3 text-2xl">
📦 </div> <h3 className="text-gray-500">Productos</h3> <p className="mt-2 text-3xl font-bold">{totalProducts}</p> <p className="mt-3 text-sm text-gray-400">Ver productos →</p> </Link>

```
  <Link
    href="/admin/orders"
    className="block rounded-3xl bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="mb-4 inline-flex rounded-2xl bg-black p-3 text-2xl">
      🛍️
    </div>
    <h3 className="text-gray-500">Pedidos</h3>
    <p className="mt-2 text-3xl font-bold">{totalOrders}</p>
    <p className="mt-3 text-sm text-gray-400">Ver pedidos →</p>
  </Link>

  <Link
    href="/admin/customers"
    className="block rounded-3xl bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="mb-4 inline-flex rounded-2xl bg-black p-3 text-2xl">
      👥
    </div>
    <h3 className="text-gray-500">Clientes</h3>
    <p className="mt-2 text-3xl font-bold">{totalCustomers}</p>
    <p className="mt-3 text-sm text-gray-400">Ver clientes →</p>
  </Link>

  <Link
    href="/admin/orders"
    className="block rounded-3xl bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="mb-4 inline-flex rounded-2xl bg-black p-3 text-2xl">
      💶
    </div>
    <h3 className="text-gray-500">Ventas</h3>
    <p className="mt-2 text-2xl font-bold">
      {totalSales.toFixed(2)} €
    </p>
    <p className="mt-3 text-sm text-gray-400">Ver ventas →</p>
  </Link>

  <Link
    href="/admin/returns"
    className="block rounded-3xl bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="mb-4 inline-flex rounded-2xl bg-black p-3 text-2xl">
      🔄
    </div>
    <h3 className="text-gray-500">Devoluciones y cambios</h3>
    <p className="mt-2 text-3xl font-bold">{totalReturns}</p>
    <p className="mt-3 text-sm text-gray-400">
      Ver solicitudes →
    </p>
  </Link>
</div>


);
}
