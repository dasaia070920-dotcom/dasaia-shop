"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { getProducts, Product } from "@/lib/products";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { favorites, toggleFavorite, isFavorite } =
    useFavorites();

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }

    loadProducts();
  }, []);

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-32">
      <h1 className="mb-10 text-4xl font-bold">
        Mis favoritos
      </h1>

      {loading ? (
        <div className="py-20 text-center text-gray-500">
          Cargando favoritos...
        </div>
      ) : favoriteProducts.length === 0 ? (
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
              onAddToCart={(quantity) =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  quantity,
                })
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}