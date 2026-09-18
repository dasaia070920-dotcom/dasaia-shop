"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProducts, Product } from "@/lib/products";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [search, setSearch] = useState(query);
  const [category, setCategory] = useState("Todos");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearch(query);
  }, [query]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const text = search.toLowerCase().trim();

    const matchesSearch =
      !text ||
      product.name.toLowerCase().includes(text) ||
      product.category.toLowerCase().includes(text) ||
      product.description.toLowerCase().includes(text);

    const matchesCategory =
      category === "Todos" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Buscar productos
      </h1>

      <input
        type="text"
        placeholder="Buscar productos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-black"
      />

      <div className="mb-10 flex flex-wrap gap-3">
        {["Todos", "Perfumes", "Accesorios", "Belleza", "Relojes"].map(
          (cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-5 py-2 font-medium transition ${
                category === cat
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {loading ? (
        <p className="py-20 text-center text-gray-500">
          Cargando productos...
        </p>
      ) : filteredProducts.length === 0 ? (
        <p className="py-20 text-center text-gray-500">
          No se encontraron productos.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-72 w-full rounded-2xl object-cover transition duration-500 group-hover:scale-105"
              />

              {product.badge && (
                <span className="mt-4 inline-block rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                  {product.badge}
                </span>
              )}

              <h2 className="mt-4 text-xl font-semibold">
                {product.name}
              </h2>

              <p className="mt-2 text-gray-500">
                {product.category}
              </p>

              <p className="mt-3 text-2xl font-bold">
                {Number(product.price).toFixed(2)} €
              </p>

              <Link
                href={`/product/${product.id}`}
                className="mt-6 block rounded-full bg-black py-3 text-center font-semibold text-white transition hover:bg-neutral-800"
              >
                Ver producto
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-gray-500">
            Cargando búsqueda...
          </p>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}