"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  onUpload: (url: string) => void;
};

export default function ImageUploader({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  async function uploadImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Selecciona una imagen válida.");
      return;
    }

    setUploading(true);

    try {
      const extension = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${extension}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      setPreview(data.publicUrl);
      onUpload(data.publicUrl);
    } catch (error) {
      console.error(error);
      alert("No se ha podido subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block font-medium">
          Imagen del producto
        </span>

        <input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          className="w-full rounded-xl border p-3"
        />
      </label>

      {uploading && (
        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
          Subiendo imagen...
        </div>
      )}

      {preview && (
        <div>
          <p className="mb-2 font-medium">
            Vista previa
          </p>

          <img
            src={preview}
            alt="Vista previa"
            className="h-56 w-full rounded-xl border object-cover"
          />
        </div>
      )}
    </div>
  );
}