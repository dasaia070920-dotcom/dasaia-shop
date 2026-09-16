import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-32">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
          ×
        </div>

        <h1 className="mt-8 text-4xl font-bold">
          Pago cancelado
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-600">
          No se ha realizado ningún cargo.
        </p>

        <p className="mt-3 text-gray-500">
          Puedes volver al carrito y continuar con tu compra cuando quieras.
        </p>

        <Link
          href="/cart"
          className="mt-10 inline-block rounded-full bg-black px-8 py-4 font-semibold text-white transition hover:bg-neutral-800"
        >
          Volver al carrito
        </Link>
      </div>
    </main>
  );
}