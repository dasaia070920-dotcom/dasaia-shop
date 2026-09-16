import Link from "next/link";
import {
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">

        <div>
          <h2 className="mb-5 text-3xl font-semibold tracking-[0.35em]">
            DASAIA
          </h2>

          <p className="leading-7 text-gray-600">
            Moda, accesorios, perfumes y belleza para mujeres que buscan elegancia en cada detalle.
          </p>

          <div className="mt-8 flex gap-4">
            <a href="#">
              <Instagram className="transition hover:scale-110" />
            </a>

            <a href="#">
              <Facebook className="transition hover:scale-110" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-semibold uppercase tracking-widest">
            Comprar
          </h3>

          <div className="space-y-3 text-gray-600">
            <Link href="/">Inicio</Link><br />
            <Link href="/#products">Productos</Link><br />
            <Link href="/favorites">Favoritos</Link><br />
            <Link href="/cart">Carrito</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-semibold uppercase tracking-widest">
            Ayuda
          </h3>

          <div className="space-y-3 text-gray-600">
            <p>Envíos</p>
            <p>Devoluciones</p>
            <p>Preguntas frecuentes</p>
            <p>Política de privacidad</p>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-semibold uppercase tracking-widest">
            Contacto
          </h3>

          <div className="space-y-4 text-gray-600">

            <div className="flex items-center gap-3">
              <Mail size={18} />
              contacto@dasaia.com
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} />
              +34 600 000 000
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} />
              España
            </div>

          </div>
        </div>

      </div>

      <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © 2026 DASAIA · Todos los derechos reservados.
      </div>
    </footer>
  );
}