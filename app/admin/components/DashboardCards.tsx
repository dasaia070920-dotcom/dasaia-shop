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
  const cards = [
    {
      title: "Productos",
      value: totalProducts,
      icon: "📦",
      href: "/admin/products",
    },
    {
      title: "Pedidos",
      value: totalOrders,
      icon: "🛍️",
      href: "/admin/orders",
    },
    {
      title: "Clientes",
      value: totalCustomers,
      icon: "👥",
      href: "/admin/customers",
    },
    {
      title: "Ventas",
      value: `${totalSales.toFixed(2)} €`,
      icon: "💶",
      href: "/admin/orders",
    },
  ];

  return (
    <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="mb-5 inline-flex rounded-2xl bg-black p-4 text-3xl">
            {card.icon}
          </div>

          <h3 className="text-gray-500">
            {card.title}
          </h3>

          <p className="mt-2 text-3xl font-bold">
            {card.value}
          </p>

          <p className="mt-3 text-sm text-gray-400">
            Ver detalles →
          </p>
        </Link>
      ))}
    </div>
  );
}