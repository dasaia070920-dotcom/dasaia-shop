"use client";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-90px)] overflow-hidden">
      <img
        src="/images/hero.jpg"
        alt="DASAIA"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-[1600px] items-center px-16 py-20">
        <div className="max-w-2xl text-white">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.35em] text-gray-200">
            NUEVA COLECCIÓN 2026
          </p>

          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            Elegancia para
            <br />
            cada día
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-gray-200">
            Descubre moda, accesorios, perfumes y belleza con un estilo
            exclusivo pensado para mujeres que buscan calidad y elegancia.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/#products"
              className="rounded-full bg-white px-8 py-4 font-semibold text-black"
            >
              Comprar ahora
            </a>

            <a
              href="/#categories"
              className="rounded-full border border-white px-8 py-4 font-semibold text-white"
            >
              Ver colección
            </a>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold">
                🚚 Envío gratuito
              </h3>

              <p className="mt-2 text-sm text-gray-300">
                En pedidos superiores a 60 €.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                🔒 Pago seguro
              </h3>

              <p className="mt-2 text-sm text-gray-300">
                Compra protegida y cifrada.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                ↩️ Devoluciones
              </h3>

              <p className="mt-2 text-sm text-gray-300">
                Hasta 30 días para devolver.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}