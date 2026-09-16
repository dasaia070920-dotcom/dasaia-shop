export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Opiniones de clientes
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p>
              "Producto increíble y calidad premium."
            </p>
            <span className="block mt-4 font-semibold">
              Laura
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p>
              "La experiencia de compra fue perfecta."
            </p>
            <span className="block mt-4 font-semibold">
              Carlos
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p>
              "DASAIA tiene un diseño espectacular."
            </p>
            <span className="block mt-4 font-semibold">
              Marta
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}