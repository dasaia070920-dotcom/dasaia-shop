export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm md:p-12">
        <h1 className="text-4xl font-bold">
          Política de Privacidad
        </h1>

        <p className="mt-4 text-gray-500">
          Última actualización: septiembre de 2026
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            1. Responsable del tratamiento
          </h2>

          <p>
            El responsable del tratamiento de los datos personales
            recogidos a través de esta página web es:
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
            2. Datos que podemos recoger
          </h2>

          <p>
            Dependiendo de las acciones realizadas en la web, podemos
            tratar datos como nombre y apellidos, dirección de entrega,
            ciudad, código postal, teléfono y correo electrónico.
          </p>

          <p>
            También pueden tratarse los datos necesarios para gestionar
            pedidos, pagos, devoluciones y consultas realizadas por el
            cliente.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            3. Finalidades
          </h2>

          <p>
            Los datos personales se utilizan principalmente para:
          </p>

          <ul className="list-disc space-y-2 pl-6">
            <li>Gestionar pedidos y compras realizadas en DASAIA.</li>
            <li>Gestionar pagos y procesos relacionados con los pedidos.</li>
            <li>Preparar y realizar los envíos.</li>
            <li>Gestionar devoluciones y solicitudes de los clientes.</li>
            <li>Responder consultas y solicitudes de contacto.</li>
            <li>Cumplir las obligaciones legales aplicables.</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            4. Base jurídica
          </h2>

          <p>
            El tratamiento de los datos puede basarse en la ejecución
            de un contrato cuando el usuario realiza una compra, en el
            cumplimiento de obligaciones legales y, cuando corresponda,
            en el consentimiento del usuario.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            5. Conservación de los datos
          </h2>

          <p>
            Los datos se conservarán durante el tiempo necesario para
            cumplir las finalidades para las que fueron recogidos y,
            posteriormente, durante los plazos exigidos por la
            legislación aplicable.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            6. Proveedores y terceros
          </h2>

          <p>
            Para prestar determinados servicios, DASAIA puede utilizar
            proveedores tecnológicos que actúen como encargados del
            tratamiento o prestadores de servicios.
          </p>

          <p>
            Entre estos servicios pueden encontrarse plataformas de
            alojamiento, gestión de bases de datos, pagos electrónicos
            y servicios técnicos necesarios para el funcionamiento de
            la tienda online.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            7. Derechos de los usuarios
          </h2>

          <p>
            El usuario puede solicitar el acceso a sus datos personales,
            su rectificación, supresión, limitación u oposición al
            tratamiento cuando legalmente corresponda.
          </p>

          <p>
            Para ejercer estos derechos puede enviar una solicitud al
            correo:
          </p>

          <p>
            <a
              href="mailto:dasaia070920@gmail.com"
              className="font-medium underline"
            >
              dasaia070920@gmail.com
            </a>
          </p>

          <p>
            Si el usuario considera que sus derechos no han sido
            atendidos correctamente, puede presentar una reclamación
            ante la Agencia Española de Protección de Datos.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            8. Seguridad
          </h2>

          <p>
            DASAIA aplica medidas técnicas y organizativas razonables
            destinadas a proteger los datos personales frente a accesos
            no autorizados, pérdida, alteración o tratamiento indebido.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">
            9. Cambios en la política de privacidad
          </h2>

          <p>
            Esta política podrá actualizarse cuando sea necesario para
            adaptarla a cambios legales, técnicos o en el funcionamiento
            de DASAIA.
          </p>
        </section>
      </div>
    </main>
  );
}