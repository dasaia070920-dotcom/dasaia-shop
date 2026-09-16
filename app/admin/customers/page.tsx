export default function CustomersPage() {
  return (
    <>
      <h1 className="mb-10 text-4xl font-bold">
        Clientes
      </h1>

      <div className="rounded-3xl bg-white p-10 shadow">
        <h2 className="text-2xl font-semibold">
          Gestión de clientes
        </h2>

        <p className="mt-4 text-gray-600">
          Aquí aparecerán todos los clientes registrados en la tienda.
        </p>

        <div className="mt-8 rounded-xl border-2 border-dashed border-gray-300 p-10 text-center text-gray-400">
          Todavía no hay clientes registrados.
        </div>
      </div>
    </>
  );
}