export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm md:p-12">
        <h1 className="text-4xl font-bold">
          Aviso Legal
        </h1>

        <p className="mt-4 text-gray-500">
          Última actualización: septiembre de 2026
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            1. Datos del titular
          </h2>

          <p>
            En cumplimiento de la normativa aplicable a los servicios de
            la sociedad de la información, se informa de los siguientes
            datos del titular de esta página web:
          </p>

          <p>
            <strong>Titular:</strong> Alfonso Martinez Molina
            <br />
            <strong>NIF:</strong> 40561313P
            <br />
            <strong>Domicilio:</strong> Carrer Major, 7, Puig-Reig,
            Barcelona, 08692
            <br />
            <strong>Email:</strong>{" "}
            <a
              href="mailto:dasaia070920@gmail.com"
              className="underline"
            >
              dasaia070920@gmail.com
            </a>
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            2. Actividad
          </h2>

          <p>
            DASAIA es una tienda online dedicada a la comercialización
            de productos de moda, accesorios, bisutería, perfumes y
            productos de belleza.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            3. Condiciones de uso
          </h2>

          <p>
            El acceso y uso de esta página web implica la aceptación de
            las presentes condiciones. El usuario se compromete a hacer
            un uso adecuado y lícito de la web y de sus contenidos.
          </p>

          <p>
            Queda prohibido utilizar la web de forma que pueda causar
            daños, impedir su funcionamiento normal o vulnerar derechos
            de terceros.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            4. Propiedad intelectual
          </h2>

          <p>
            Los contenidos, textos, imágenes, diseños, logotipos y demás
            elementos de esta web están protegidos por la normativa
            aplicable sobre propiedad intelectual e industrial.
          </p>

          <p>
            No se permite la reproducción, distribución o utilización de
            estos contenidos sin la autorización correspondiente,
            salvo en los casos permitidos legalmente.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            5. Responsabilidad
          </h2>

          <p>
            DASAIA procurará que la información publicada en esta web
            sea correcta y esté actualizada. No obstante, pueden
            producirse errores puntuales o interrupciones técnicas.
          </p>

          <p>
            El titular no será responsable de los daños que puedan
            derivarse de un uso indebido de la página web por parte
            del usuario.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            6. Legislación aplicable
          </h2>

          <p>
            La relación entre el titular de la web y los usuarios se
            regirá por la legislación española, sin perjuicio de los
            derechos que correspondan a los consumidores conforme a la
            normativa aplicable.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            7. Contacto
          </h2>

          <p>
            Para cualquier consulta relacionada con DASAIA, puedes
            contactar a través del correo electrónico:
          </p>

          <p>
            <a
              href="mailto:dasaia070920@gmail.com"
              className="font-medium underline"
            >
              dasaia070920@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}