"use client";

import { Product } from "@/types/product";

type Props = {
  products: Product[];
};

export default function DashboardCards({ products }: Props) {
  const totalProducts = products.length;

  const productsInStock = products.filter(
    (product) => product.stock > 0
  ).length;

  const productsOutOfStock = products.filter(
    (product) => product.stock === 0
  ).length;

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );

  const cards = [
    {
      title: "Productos",
      value: totalProducts,
      color: "bg-blue-500",
      icon: "📦",
    },
    {
      title: "En stock",
      value: productsInStock,
      color: "bg-green-500",
      icon: "🟢",
    },
    {
      title: "Sin stock",
      value: productsOutOfStock,
      color: "bg-red-500",
      icon: "🔴",
    },
    {
      title: "Inventario",
      value: `${inventoryValue.toFixed(2)} €`,
      color: "bg-black",
      icon: "💶",
    },
  ];

  return (
    <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-3xl bg-white p-6 shadow-lg"
        >
          <div
            className={`mb-5 inline-flex rounded-2xl ${card.color} p-4 text-3xl text-white`}
          >
            {card.icon}
          </div>

          <h3 className="text-gray-500">
            {card.title}
          </h3>

          <p className="mt-2 text-3xl font-bold">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}