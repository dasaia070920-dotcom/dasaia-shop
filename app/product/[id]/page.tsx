const products = {
  "perfume-elegance": {
    name: "Perfume Elegance",
    price: "89 €",
    description:
      "Un perfume sofisticado con una esencia elegante y duradera.",
  },

  "bolso-premium": {
    name: "Bolso Premium",
    price: "149 €",
    description:
      "Un bolso exclusivo diseñado para completar cualquier estilo.",
  },

  "crema-luxury": {
    name: "Crema Luxury",
    price: "59 €",
    description:
      "Tratamiento de belleza con una textura suave y una sensación premium.",
  },

  "reloj-classic": {
    name: "Reloj Classic",
    price: "199 €",
    description:
      "Un reloj elegante con diseño clásico y acabado de lujo.",
  },
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = products[id as keyof typeof products];

  if (!product) {
    return <h1>Producto no encontrado</h1>;
  }

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-4xl mx-auto">

        <div className="h-96 rounded-2xl bg-neutral-200"></div>

        <h1 className="mt-8 text-4xl font-bold">
          {product.name}
        </h1>

        <p className="mt-4 text-xl text-gray-500">
          {product.price}
        </p>

        <p className="mt-6 text-gray-600">
          {product.description}
        </p>

        <button className="mt-8 rounded-full bg-black px-8 py-4 text-white">
          Añadir al carrito
        </button>

      </div>
    </main>
  );
}