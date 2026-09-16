"use client";

import { Product } from "@/types/product";

type Props = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm">

      <div className="flex items-center gap-5">

        <img
          src={product.image}
          alt={product.name}
          className="h-24 w-24 rounded-xl object-cover"
        />

        <div>

          <h3 className="text-xl font-semibold">
            {product.name}
          </h3>

          <p className="mt-1 text-gray-500">
            {product.price} €
          </p>

          <p className="text-sm text-gray-400">
            {product.category}
          </p>

          <p className="text-sm text-gray-400">
            Stock: {product.stock}
          </p>

        </div>

      </div>

      <div className="flex gap-3">

        <button
            onClick={() => onEdit(product)}
  className="rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(product.id)}
          className="rounded-xl bg-red-600 px-5 py-3 text-white transition hover:bg-red-700"
        >
          Eliminar
        </button>

      </div>

    </div>
  );
}