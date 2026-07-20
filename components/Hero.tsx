export default function Hero() {
  return (
    <section className="relative flex h-[700px] items-center justify-center overflow-hidden bg-neutral-100">
      <img
        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600"
        alt="Moda de lujo"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 max-w-3xl text-center text-white">
        <p className="mb-4 text-lg uppercase tracking-[0.4em]">
          Nueva colección
        </p>

        <h1 className="text-6xl font-bold">
          Elegancia que inspira
        </h1>

        <p className="mt-6 text-xl text-gray-200">
          Moda, perfumes y belleza para quienes buscan un estilo único.
        </p>

        <button className="mt-10 rounded-full bg-white px-10 py-4 font-semibold text-black transition hover:scale-105">
          Comprar ahora
        </button>
      </div>
    </section>
  );
}