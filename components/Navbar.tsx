export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <h1 className="text-3xl font-bold tracking-[0.3em]">
          DASAIA
        </h1>

        <nav className="hidden gap-8 text-sm font-medium md:flex">
          <a href="#" className="transition hover:text-gray-500">
            Inicio
          </a>

          <a href="#" className="transition hover:text-gray-500">
            Mujer
          </a>

          <a href="#" className="transition hover:text-gray-500">
            Hombre
          </a>

          <a href="#" className="transition hover:text-gray-500">
            Belleza
          </a>

          <a href="#" className="transition hover:text-gray-500">
            Contacto
          </a>
        </nav>

        <div className="flex items-center gap-5 text-2xl">
          <button className="transition hover:scale-110">🔍</button>
          <button className="transition hover:scale-110">♡</button>
          <button className="transition hover:scale-110">🛒</button>
          <button className="transition hover:scale-110">👤</button>
        </div>
      </div>
    </header>
  );
}