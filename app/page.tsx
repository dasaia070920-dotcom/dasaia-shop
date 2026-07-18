export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">

      <header className="flex items-center justify-between px-10 py-6 border-b">
        <h1 className="text-4xl font-bold tracking-widest">
          DASAIA
        </h1>

        <nav className="flex gap-8 text-lg">
          <a href="#">Mujer</a>
          <a href="#">Hombre</a>
          <a href="#">Perfumes</a>
          <a href="#">Belleza</a>
          <a href="#">Ofertas</a>
        </nav>
      </header>

      <section className="flex flex-col items-center justify-center py-32 bg-gray-100">

        <h2 className="text-6xl font-bold mb-6">
          Elegancia para cada día
        </h2>

        <p className="text-xl text-gray-600 mb-10">
          Moda · Complementos · Perfumes · Belleza
        </p>

        <button className="bg-black text-white px-10 py-4 rounded-full hover:bg-gray-800 transition">
          Comprar ahora
        </button>

      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 p-12">

        <div className="bg-gray-100 rounded-2xl p-10 text-center">
          👗
          <h3 className="mt-4 text-xl font-semibold">Moda</h3>
        </div>

        <div className="bg-gray-100 rounded-2xl p-10 text-center">
          💍
          <h3 className="mt-4 text-xl font-semibold">Bisutería</h3>
        </div>

        <div className="bg-gray-100 rounded-2xl p-10 text-center">
          🌸
          <h3 className="mt-4 text-xl font-semibold">Perfumes</h3>
        </div>

        <div className="bg-gray-100 rounded-2xl p-10 text-center">
          🧴
          <h3 className="mt-4 text-xl font-semibold">Belleza</h3>
        </div>

      </section>

    </main>
  );
}