"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

export default function ProductList({
  products,
  onEdit,
  onDelete,
}: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">
        No hay productos.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}