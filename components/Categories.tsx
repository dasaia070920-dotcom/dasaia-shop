export default function Categories() {
  return (
    <section className="py-20 px-8">
      <h2 className="text-3xl font-bold text-center mb-12">
        Explora nuestras categorías
      </h2>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-neutral-100 p-10 text-center hover:shadow-lg transition">
          👗
          <h3 className="mt-4 font-semibold">Moda</h3>
        </div>

        <div className="rounded-2xl bg-neutral-100 p-10 text-center hover:shadow-lg transition">
          💄
          <h3 className="mt-4 font-semibold">Belleza</h3>
        </div>

        <div className="rounded-2xl bg-neutral-100 p-10 text-center hover:shadow-lg transition">
          🌸
          <h3 className="mt-4 font-semibold">Perfumes</h3>
        </div>

        <div className="rounded-2xl bg-neutral-100 p-10 text-center hover:shadow-lg transition">
          👜
          <h3 className="mt-4 font-semibold">Complementos</h3>
        </div>
      </div>
    </section>
  );
}