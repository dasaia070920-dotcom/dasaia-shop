"use client";

import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";

export default function FavoritesPage() {
  const { favorites, toggleFavorite, isFavorite } =
    useFavorites();

  const { addToCart } = useCart();

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-10 text-4xl font-bold">
        Mis favoritos
      </h1>

      {favoriteProducts.length === 0 ? (
        <div className="text-center">
          <p className="mb-6 text-gray-500">
            Aún no tienes productos favoritos.
          </p>

          <Link
            href="/"
            className="rounded-full bg-black px-6 py-3 text-white"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              badge={product.badge}
              stock={product.stock}
              favorite={isFavorite(product.id)}
              onFavorite={() => toggleFavorite(product.id)}
              onAddToCart={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  quantity: 1,
                })
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}