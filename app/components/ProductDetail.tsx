"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
};

export default function ProductDetail({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  const stock = Math.max(0, Number(product.stock) || 0);

  const isOutOfStock = stock === 0;

  function handleAddToCart() {
    if (isOutOfStock) {
      alert("Este producto está agotado.");
      return;
    }

    if (quantity > stock) {
      alert(`Solo quedan ${stock} unidades disponibles.`);
      setQuantity(stock);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });

    alert("Producto añadido al carrito");
  }

  function increaseQuantity() {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  }

  function decreaseQuantity() {
    setQuantity(Math.max(1, quantity - 1));
  }

  return (
    <main className="bg-white pt-32 pb-20">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="h-[700px] w-full rounded-2xl object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-3 uppercase tracking-[0.35em] text-gray-500">
            DASAIA COLLECTION
          </p>

          <h1 className="text-5xl font-bold">
            {product.name}
          </h1>

          <p className="mt-6 text-4xl font-semibold">
            {product.price.toFixed(2)} €
          </p>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            {product.description}
          </p>

          <div className="mt-8">
            {isOutOfStock ? (
              <p className="font-semibold text-red-600">
                Producto agotado
              </p>
            ) : stock <= 5 ? (
              <p className="font-medium text-orange-600">
                Últimas {stock} unidades disponibles
              </p>
            ) : (
              <p className="font-medium text-green-700">
                En stock
              </p>
            )}
          </div>

          {!isOutOfStock && (
            <div className="mt-6 flex items-center gap-4">
              <span className="font-medium">
                Cantidad
              </span>

              <div className="flex overflow-hidden rounded-xl border">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="px-5 py-3 text-xl hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>

                <div className="flex w-14 items-center justify-center">
                  {quantity}
                </div>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= stock}
                  className="px-5 py-3 text-xl hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="mt-10 flex items-center justify-center gap-3 rounded-full bg-black py-5 text-lg font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <ShoppingBag size={22} />

            {isOutOfStock
              ? "Producto agotado"
              : "Añadir al carrito"}
          </button>

          {!isOutOfStock && (
            <Link
              href="/cart"
              className="mt-4 flex items-center justify-center rounded-full border border-black py-5 text-lg font-semibold text-black transition hover:bg-black hover:text-white"
            >
              Ir al carrito
            </Link>
          )}

          <div className="mt-14 space-y-6 border-t pt-10">
            <div className="flex gap-4">
              <Truck />

              <div>
                <h3 className="font-semibold">
                  Envío gratuito
                </h3>

                <p className="text-gray-500">
                  En compras superiores a 60 €.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <RotateCcw />

              <div>
                <h3 className="font-semibold">
                  Devoluciones fáciles
                </h3>

                <p className="text-gray-500">
                  Dispones de 30 días para devolver el pedido.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <ShieldCheck />

              <div>
                <h3 className="font-semibold">
                  Pago seguro
                </h3>

                <p className="text-gray-500">
                  Tus datos se mantienen protegidos durante la compra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}