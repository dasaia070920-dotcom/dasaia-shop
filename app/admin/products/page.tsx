"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";

import { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setProducts(data || []);
  }

  async function saveProduct(product: Omit<Product, "id">) {
    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(product)
        .eq("id", editingProduct.id);

      if (error) {
        alert(error.message);
        return;
      }

      alert("✅ Producto actualizado");

      setEditingProduct(null);
      await loadProducts();
      return;
    }

    const { error } = await supabase
      .from("products")
      .insert([product]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("✅ Producto añadido");

    await loadProducts();
  }

  async function deleteProduct(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadProducts();
  }

  function cancelEdit() {
    setEditingProduct(null);
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <>
      <h1 className="mb-10 text-4xl font-bold">
        Gestión de Productos
      </h1>

      <ProductForm
        onSave={saveProduct}
        editingProduct={editingProduct}
        onCancelEdit={cancelEdit}
      />

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <h2 className="mb-6 mt-12 text-3xl font-bold">
        Productos
      </h2>

      <ProductList
        products={filteredProducts}
        onEdit={setEditingProduct}
        onDelete={deleteProduct}
      />
    </>
  );
}