"use client";

import Link from "next/link";

type Props = {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalSales: number;
};

export default function DashboardStats({
  totalProducts,
  totalOrders,
  totalCustomers,
  totalSales,
}: Props) {
  return (
    <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <Link
        href="/admin/products"
        className="block cursor-pointer rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="mb-5 inline-flex rounded-2xl bg-black p-4 text-3xl">
          📦
        </div>

        <h3 className="text-gray-500">
          Productos
        </h3>

        <p className="mt-2 text-3xl font-bold">
          {totalProducts}
        </p>

        <p className="mt-3 text-sm text-gray-400">
          Ver productos →
        </p>
      </Link>

      <Link
        href="/admin/orders"
        className="block cursor-pointer rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="mb-5 inline-flex rounded-2xl bg-black p-4 text-3xl">
          🛍️
        </div>

        <h3 className="text-gray-500">
          Pedidos
        </h3>

        <p className="mt-2 text-3xl font-bold">
          {totalOrders}
        </p>

        <p className="mt-3 text-sm text-gray-400">
          Ver pedidos →
        </p>
      </Link>

      <Link
        href="/admin/customers"
        className="block cursor-pointer rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="mb-5 inline-flex rounded-2xl bg-black p-4 text-3xl">
          👥
        </div>

        <h3 className="text-gray-500">
          Clientes
        </h3>

        <p className="mt-2 text-3xl font-bold">
          {totalCustomers}
        </p>

        <p className="mt-3 text-sm text-gray-400">
          Ver clientes →
        </p>
      </Link>

      <Link
        href="/admin/orders"
        className="block cursor-pointer rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="mb-5 inline-flex rounded-2xl bg-black p-4 text-3xl">
          💶
        </div>

        <h3 className="text-gray-500">
          Ventas
        </h3>

        <p className="mt-2 text-3xl font-bold">
          {totalSales.toFixed(2)} €
        </p>

        <p className="mt-3 text-sm text-gray-400">
          Ver ventas →
        </p>
      </Link>
    </div>
  );
}