"use client";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-90px)] overflow-hidden pointer-events-none">
      {/* IMAGEN */}
      <img
        src="/images/hero.jpg"
        alt="DASAIA"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* OSCURECER IMAGEN */}
      <div className="absolute inset-0 bg-black/50" />

      {/* CONTENIDO */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-[1600px] items-center px-6 py-16 sm:px-8 sm:py-20 md:px-16 md:py-20">
        <div className="max-w-2xl text-white">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-gray-200 sm:mb-6 sm:text-sm sm:tracking-[0.35em]">
            NUEVA COLECCIÓN 2026
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
            Elegancia para
            <br />
            cada día
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-200 sm:mt-8 sm:text-lg">
            Descubre moda, accesorios, perfumes y belleza con un estilo
            exclusivo pensado para mujeres que buscan calidad y elegancia.
          </p>

          {/* BOTONES */}
          <div className="pointer-events-auto mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="/#products"
              className="rounded-full bg-white px-8 py-4 text-center font-semibold text-black"
            >
              Comprar ahora
            </a>

            <a
              href="/#categories"
              className="rounded-full border border-white px-8 py-4 text-center font-semibold text-white"
            >
              Ver colección
            </a>
          </div>

          {/* VENTAJAS */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-3 sm:gap-8">
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