import { notFound } from "next/navigation";
import ProductDetail from "@/app/components/ProductDetail";
import { supabase } from "@/lib/supabase";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <ProductDetail
      product={{
        id: product.id,
        name: product.name,
        price: Number(product.price),
        description: product.description || "",
        image: product.image,
        stock: Number(product.stock) || 0,
      }}
    />
  );
}