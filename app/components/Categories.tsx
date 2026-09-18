"use client";

export default function Categories() {
  function goToCategory(category: string) {
    window.dispatchEvent(
      new CustomEvent("dasaia-category", {
        detail: category,
      })
    );

    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="categories"
      className="px-8 py-20"
    >
      <h2 className="mb-12 text-center text-3xl font-bold">
        Explora nuestras categorías
      </h2>

      <div className="grid gap-6 md:grid-cols-4">
        <button
          type="button"
          onClick={() => goToCategory("Moda")}
          className="rounded-2xl bg-neutral-100 p-10 text-center transition hover:shadow-lg"
        >
          <span className="text-4xl">👗</span>

          <h3 className="mt-4 font-semibold">
            Moda
          </h3>
        </button>

        <button
          type="button"
          onClick={() => goToCategory("Belleza")}
          className="rounded-2xl bg-neutral-100 p-10 text-center transition hover:shadow-lg"
        >
          <span className="text-4xl">💄</span>

          <h3 className="mt-4 font-semibold">
            Belleza
          </h3>
        </button>

        <button
          type="button"
          onClick={() => goToCategory("Perfumes")}
          className="rounded-2xl bg-neutral-100 p-10 text-center transition hover:shadow-lg"
        >
          <span className="text-4xl">🌸</span>

          <h3 className="mt-4 font-semibold">
            Perfumes
          </h3>
        </button>

        <button
          type="button"
          onClick={() => goToCategory("Complementos")}
          className="rounded-2xl bg-neutral-100 p-10 text-center transition hover:shadow-lg"
        >
          <span className="text-4xl">👜</span>

          <h3 className="mt-4 font-semibold">
            Complementos
          </h3>
        </button>
      </div>
    </section>
  );
}