import Link from "next/link";

export default function Products() {
  const products = [
    {
      name: "Perfume Elegance",
      price: "89 €",
      id: "perfume-elegance",
      image: "perfume.png",
      badge: "Nuevo",
    },
    {
      name: "Bolso Premium",
      price: "149 €",
      id: "bolso-premium",
      image: "bolso.png",
      badge: "Top ventas",
    },
    {
      name: "Crema Luxury",
      price: "59 €",
      id: "crema-luxury",
      image: "crema.jpg",
      badge: "",
    },
    {
      name: "Reloj Classic",
      price: "199 €",
      id: "reloj-classic",
      image: "reloj.jpg.JPG",
      badge: "Exclusivo",
    },
  ];

  return (
    <section className="py-20 px-6">
      <h2 className="mb-12 text-center text-4xl font-bold">
        Productos destacados
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="relative">
              <img
                src={`/images/${product.image}`}
                alt={product.name}
                className="h-72 w-full rounded-2xl object-cover transition duration-500 group-hover:scale-105"
              />

              <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-xl shadow-md transition hover:scale-110">
                ♡
              </button>

              {product.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                  {product.badge}
                </span>
              )}
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              {product.name}
            </h3>

            <p className="mt-2 text-lg font-bold">
              {product.price}
            </p>

            <Link
              href={`/product/${product.id}`}
              className="mt-6 block w-full rounded-full bg-black py-3 text-center font-semibold text-white transition hover:bg-neutral-800"
            >
              Ver producto
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}