export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="mb-12 text-center text-4xl font-bold">
        ¿Por qué elegir DASAIA?
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="rounded-3xl border p-8 text-center shadow-sm">
          <div className="text-5xl">🚚</div>
          <h3 className="mt-5 text-2xl font-semibold">
            Envío rápido
          </h3>
          <p className="mt-3 text-gray-500">
            Entrega segura en 24-72 horas.
          </p>
        </div>

        <div className="rounded-3xl border p-8 text-center shadow-sm">
          <div className="text-5xl">💎</div>
          <h3 className="mt-5 text-2xl font-semibold">
            Calidad Premium
          </h3>
          <p className="mt-3 text-gray-500">
            Productos seleccionados con los mejores estándares.
          </p>
        </div>

        <div className="rounded-3xl border p-8 text-center shadow-sm">
          <div className="text-5xl">🔒</div>
          <h3 className="mt-5 text-2xl font-semibold">
            Pago seguro
          </h3>
          <p className="mt-3 text-gray-500">
            Compra con total tranquilidad y protección.
          </p>
        </div>
      </div>
    </section>
  );
}