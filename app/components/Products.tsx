"use client";

import { useEffect, useMemo, useState } from "react";
import { getProducts, Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("default");

  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }

    loadProducts();
  }, []);

  useEffect(() => {
    function handleCategory(event: Event) {
      const customEvent = event as CustomEvent<string>;
      const selectedCategory = customEvent.detail;

      setCategory(selectedCategory);
    }

    window.addEventListener(
      "dasaia-category",
      handleCategory
    );

    return () => {
      window.removeEventListener(
        "dasaia-category",
        handleCategory
      );
    };
  }, []);

  const categories = [
    "Todas",
    ...new Set(products.map((p) => p.category)),
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "Todas") {
      list = list.filter(
        (p) => p.category === category
      );
    }

    if (sort === "low") {
      list.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, search, category, sort]);

  if (loading) {
    return (
      <section className="py-32 text-center">
        <h2 className="text-4xl font-bold">
          Cargando productos...
        </h2>
      </section>
    );
  }

  return (
    <section
      id="products"
      className="bg-[#faf9f7] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 uppercase tracking-[0.35em] text-gray-500">
            DASAIA
          </p>

          <h2 className="text-5xl font-bold">
            Productos destacados
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Moda, accesorios y belleza cuidadosamente
            seleccionados para mujeres que buscan
            elegancia todos los días.
          </p>
        </div>

        <div className="mb-14 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row">
          <input
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 px-5 py-3 outline-none transition focus:border-black"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-gray-200 px-5 py-3 outline-none"
          >
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-gray-200 px-5 py-3 outline-none"
          >
            <option value="default">
              Ordenar
            </option>

            <option value="low">
              Precio ↑
            </option>

            <option value="high">
              Precio ↓
            </option>
          </select>
        </div>

        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              badge={product.badge}
              stock={product.stock}
              favorite={isFavorite(product.id)}
              onFavorite={() =>
                toggleFavorite(product.id)
              }
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
      </div>
    </section>
  );
}