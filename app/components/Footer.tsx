import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#e8e8e8] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold tracking-[0.2em]">
              DASAIA
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
              Moda, accesorios, perfumes y belleza con un estilo
              elegante pensado para cada día.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              Tienda
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
              <Link
                href="/"
                className="transition hover:text-black"
              >
                Inicio
              </Link>

              <a
                href="/#products"
                className="transition hover:text-black"
              >
                Productos
              </a>

              <Link
                href="/cart"
                className="transition hover:text-black"
              >
                Carrito
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">
              Información
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
              <Link
                href="/legal"
                className="transition hover:text-black"
              >
                Aviso legal
              </Link>

              <Link
                href="/privacy"
                className="transition hover:text-black"
              >
                Política de privacidad
              </Link>

              <Link
                href="/cookies"
                className="transition hover:text-black"
              >
                Política de cookies
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-black"
              >
                Condiciones de compra y devoluciones
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">
              Contacto
            </h3>

            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>
                DASAIA
              </p>

              <p>
                Puig-Reig, Barcelona
              </p>

              <a
                href="mailto:dasaia070920@gmail.com"
                className="block transition hover:text-black"
              >
                dasaia070920@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#e8e8e8] pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DASAIA. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}