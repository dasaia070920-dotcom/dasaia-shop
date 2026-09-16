"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";

type ProductProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  badge: string;
  stock: number;
  favorite: boolean;
  onFavorite: () => void;
  onAddToCart: (quantity: number) => void;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  badge,
  stock,
  favorite,
  onFavorite,
  onAddToCart,
}: ProductProps) {
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = stock <= 0;

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(stock, current + 1)
    );
  }

  function handleAddToCart() {
    if (isOutOfStock) return;

    onAddToCart(quantity);

    setQuantity(1);
  }

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

      <div className="relative overflow-hidden">

        <img
          src={image}
          alt={name}
          className="h-80 w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <span className="absolute left-4 top-4 rounded-full bg-black px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
          {badge}
        </span>

        <button
          type="button"
          onClick={onFavorite}
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow-lg transition hover:scale-110"
        >
          <Heart
            size={20}
            fill={favorite ? "#ef4444" : "transparent"}
            color={favorite ? "#ef4444" : "#111827"}
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 transition duration-500 group-hover:translate-y-0">

          <Link
            href={`/product/${id}`}
            className="mb-3 flex items-center justify-center gap-2 rounded-full bg-white py-3 font-semibold text-black transition hover:bg-gray-100"
          >
            <Eye size={18} />
            Ver producto
          </Link>

          {stock > 0 ? (
            <>
              <div className="mb-3 flex items-center justify-center">

                <div className="flex overflow-hidden rounded-full border border-white/40 bg-white">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-5 py-2 text-xl text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>

                  <div className="flex w-12 items-center justify-center font-semibold text-black">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= stock}
                    className="px-5 py-2 text-xl text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>

                </div>

              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3 font-semibold text-white transition hover:bg-neutral-800"
              >
                <ShoppingBag size={18} />
                Añadir {quantity} al carrito
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-red-600 py-3 font-semibold text-white opacity-80"
            >
              Agotado
            </button>
          )}

        </div>

      </div>

      <div className="p-6">

        <h3 className="text-xl font-semibold text-gray-900 transition group-hover:text-black">
          {name}
        </h3>

        <p className="mt-3 text-3xl font-bold text-black">
          {price.toFixed(2)} €
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {stock > 0
            ? `${stock} disponibles`
            : "Sin stock"}
        </p>

      </div>

    </div>
  );
}