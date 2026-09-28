"use client";

import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import { Product } from "@/types/product";

type Props = {
  onSave: (product: {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    badge: string;
    stock: number;
  }) => Promise<void>;
  editingProduct: Product | null;
  onCancelEdit: () => void;
};

export default function ProductForm({
  onSave,
  editingProduct,
  onCancelEdit,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [badge, setBadge] = useState("Nuevo");
  const [stock, setStock] = useState("1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || "");
      setDescription(editingProduct.description || "");
      setPrice(editingProduct.price?.toString() || "");
      setImage(editingProduct.image || "");
      setCategory(editingProduct.category || "");
      setBadge(editingProduct.badge || "Nuevo");
      setStock(editingProduct.stock?.toString() || "1");
    } else {
      clearForm();
    }
  }, [editingProduct]);

  function clearForm() {
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setCategory("");
    setBadge("Nuevo");
    setStock("1");
  }

  async function handleSubmit() {
    const cleanName = name.trim();
    const cleanDescription = description.trim();
    const cleanImage = image.trim();
    const cleanCategory = category.trim();

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!cleanName) {
      alert("Falta el nombre del producto.");
      return;
    }

    if (!cleanDescription) {
      alert("Falta la descripción.");
      return;
    }

    if (!price || Number.isNaN(numericPrice) || numericPrice <= 0) {
      alert("Introduce un precio válido.");
      return;
    }

    if (!cleanImage) {
      alert("Falta subir la imagen del producto.");
      return;
    }

    if (!cleanCategory) {
      alert("Selecciona una categoría.");
      return;
    }

    if (
      !stock ||
      Number.isNaN(numericStock) ||
      numericStock < 0
    ) {
      alert("Introduce un stock válido.");
      return;
    }

    setLoading(true);

    try {
      await onSave({
        name: cleanName,
        description: cleanDescription,
        price: numericPrice,
        image: cleanImage,
        category: cleanCategory,
        badge: badge || "Nuevo",
        stock: numericStock,
      });

      clearForm();
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("No se pudo guardar el producto.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    clearForm();
    onCancelEdit();
  }

  return (
    <div className="mb-12 rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">
        {editingProduct ? "Editar producto" : "Nuevo producto"}
      </h2>

      <div className="space-y-5">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border p-3"
        />

        <textarea
          placeholder="Descripción"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border p-3"
        />

        <input
          type="number"
          placeholder="Precio (€)"
          value={price}
          min="0"
          step="0.01"
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-xl border p-3"
        />

        <ImageUploader
          onUpload={(url) => {
            setImage(url);
          }}
        />

        {image && (
          <img
            src={image}
            alt="Vista previa"
            className="h-56 w-full rounded-xl border object-cover"
          />
        )}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border p-3"
        >
          <option value="">Selecciona una categoría</option>
          <option value="Mujer">Mujer</option>
          <option value="Hombre">Hombre</option>
          <option value="Niños">Niños</option>
          <option value="Perfumes">Perfumes</option>
          <option value="Cosmética">Cosmética</option>
          <option value="Joyería">Joyería</option>
          <option value="Accesorios">Accesorios</option>
        </select>

        <select
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          className="w-full rounded-xl border p-3"
        >
          <option value="Nuevo">Nuevo</option>
          <option value="Oferta">Oferta</option>
          <option value="Más vendido">Más vendido</option>
          <option value="Exclusivo">Exclusivo</option>
          <option value="Edición limitada">
            Edición limitada
          </option>
          <option value="Sin etiqueta">Sin etiqueta</option>
        </select>

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          min="0"
          onChange={(e) => setStock(e.target.value)}
          className="w-full rounded-xl border p-3"
        />

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-xl bg-black py-4 text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading
              ? "Guardando..."
              : editingProduct
              ? "Guardar cambios"
              : "Guardar producto"}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-gray-300 px-6 py-4 transition hover:bg-gray-100"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}