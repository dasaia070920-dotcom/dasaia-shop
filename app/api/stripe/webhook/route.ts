import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Falta la firma de Stripe." },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Falta STRIPE_WEBHOOK_SECRET." },
        { status: 500 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log("EVENTO STRIPE:", event.type);

    /*
     * PAGO COMPLETADO
     */
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log(
        "PAGO COMPLETADO:",
        session.id,
        session.payment_status
      );

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error(
          "El pago no tiene orderId en los metadatos."
        );

        return NextResponse.json({
          received: true,
        });
      }

      /*
       * Buscamos el pedido.
       */
      const { data: order, error: orderError } =
        await supabaseAdmin
          .from("orders")
          .select(
            "id, status, payment_status, customer_name, customer_lastname, email, total, address, city, postal_code"
          )
          .eq("id", orderId)
          .single();

      if (orderError || !order) {
        console.error(
          "No se ha encontrado el pedido:",
          orderError
        );

        return NextResponse.json(
          { error: "No se ha encontrado el pedido." },
          { status: 500 }
        );
      }

      /*
       * Si ya está procesado, no volvemos a descontar stock
       * ni volvemos a enviar el correo.
       */
      if (
        order.status === "Procesando" ||
        order.payment_status === "paid"
      ) {
        console.log(
          "El pedido ya estaba procesado:",
          orderId
        );

        return NextResponse.json({
          received: true,
        });
      }

      /*
       * Buscamos los productos del pedido.
       */
      const { data: orderItems, error: itemsError } =
        await supabaseAdmin
          .from("order_items")
          .select(
            "product_id, product_name, quantity, price"
          )
          .eq("order_id", orderId);

      if (itemsError || !orderItems) {
        console.error(
          "Error obteniendo los productos del pedido:",
          itemsError
        );

        return NextResponse.json(
          {
            error:
              "No se han podido obtener los productos del pedido.",
          },
          { status: 500 }
        );
      }

      /*
       * Descontamos el stock de cada producto.
       */
      for (const item of orderItems) {
        const { data: product, error: productError } =
          await supabaseAdmin
            .from("products")
            .select("id, name, stock")
            .eq("id", item.product_id)
            .single();

        if (productError || !product) {
          console.error(
            "No se ha encontrado el producto:",
            item.product_name
          );

          return NextResponse.json(
            {
              error: `No se ha encontrado el producto "${item.product_name}".`,
            },
            { status: 500 }
          );
        }

        const currentStock = Number(product.stock) || 0;
        const quantity = Number(item.quantity) || 0;

        const newStock = Math.max(
          0,
          currentStock - quantity
        );

        const { error: stockError } =
          await supabaseAdmin
            .from("products")
            .update({
              stock: newStock,
            })
            .eq("id", item.product_id);

        if (stockError) {
          console.error(
            "Error actualizando stock:",
            stockError
          );

          return NextResponse.json(
            {
              error:
                "No se ha podido actualizar el stock.",
            },
            { status: 500 }
          );
        }

        console.log(
          `Stock actualizado: ${item.product_name} → ${newStock}`
        );
      }

      /*
       * Marcamos el pedido como pagado y procesando.
       */
      const { error: updateError } =
        await supabaseAdmin
          .from("orders")
          .update({
            status: "Procesando",
            payment_status: "paid",
          })
          .eq("id", orderId);

      if (updateError) {
        console.error(
          "Error actualizando el pedido:",
          updateError
        );

        return NextResponse.json(
          {
            error:
              "No se ha podido actualizar el pedido.",
          },
          { status: 500 }
        );
      }

      console.log(
        "PEDIDO PAGADO Y PROCESADO CORRECTAMENTE:",
        orderId
      );

      /*
       * ENVIAMOS EL EMAIL DE CONFIRMACIÓN
       */
      const resendApiKey = process.env.RESEND_API_KEY;

      if (!resendApiKey) {
        console.error(
          "Falta RESEND_API_KEY. El pedido se ha procesado, pero no se ha enviado el email."
        );
      } else if (!order.email) {
        console.error(
          "El pedido no tiene email. No se puede enviar la confirmación."
        );
      } else {
        const customerName = escapeHtml(
          order.customer_name || "cliente"
        );

        const customerLastname = escapeHtml(
          order.customer_lastname || ""
        );

        const customerFullName =
          `${customerName} ${customerLastname}`.trim();

        const itemsHtml = orderItems
          .map(
            (item: any) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eee;">
                  ${escapeHtml(item.product_name)}
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:center;">
                  ${Number(item.quantity)}
                </td>
                <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;">
                  ${(Number(item.price) * Number(item.quantity)).toFixed(2)} €
                </td>
              </tr>
            `
          )
          .join("");

        const emailHtml = `
          <div style="font-family:Arial,Helvetica,sans-serif;background:#faf9f7;padding:30px 15px;">
            <div style="max-width:650px;margin:0 auto;background:#ffffff;padding:35px;border:1px solid #e8e8e8;">
              
              <div style="text-align:center;margin-bottom:30px;">
                <h1 style="margin:0;font-size:30px;letter-spacing:3px;color:#111;">
                  DASAIA
                </h1>
              </div>

              <h2 style="font-size:24px;color:#111;margin-bottom:10px;">
                ¡Gracias por tu compra!
              </h2>

              <p style="font-size:16px;color:#444;line-height:1.6;">
                Hola ${customerFullName},
              </p>

              <p style="font-size:16px;color:#444;line-height:1.6;">
                Hemos recibido correctamente tu pedido y el pago se ha confirmado.
                Ya estamos preparando tu pedido.
              </p>

              <div style="background:#faf9f7;padding:20px;margin:25px 0;">
                <p style="margin:0 0 8px;color:#666;">
                  <strong>Número de pedido:</strong> ${order.id}
                </p>

                <p style="margin:0;color:#666;">
                  <strong>Total:</strong> ${Number(order.total).toFixed(2)} €
                </p>
              </div>

              <h3 style="font-size:18px;color:#111;margin-top:30px;">
                Productos
              </h3>

              <table style="width:100%;border-collapse:collapse;color:#444;">
                <thead>
                  <tr>
                    <th style="text-align:left;padding:10px 0;border-bottom:1px solid #ddd;">
                      Producto
                    </th>
                    <th style="text-align:center;padding:10px 0;border-bottom:1px solid #ddd;">
                      Cant.
                    </th>
                    <th style="text-align:right;padding:10px 0;border-bottom:1px solid #ddd;">
                      Precio
                    </th>
                  </tr>
                </thead>

                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <h3 style="font-size:18px;color:#111;margin-top:30px;">
                Dirección de entrega
              </h3>

              <p style="font-size:15px;color:#555;line-height:1.6;">
                ${escapeHtml(order.address || "")}<br />
                ${escapeHtml(order.postal_code || "")}
                ${escapeHtml(order.city || "")}
              </p>

              <p style="font-size:15px;color:#666;line-height:1.6;margin-top:30px;">
                Te avisaremos cuando tu pedido avance en el proceso de preparación y envío.
              </p>

              <div style="border-top:1px solid #eee;margin-top:35px;padding-top:20px;text-align:center;">
                <p style="font-size:13px;color:#999;margin:0;">
                  DASAIA · Moda, belleza y elegancia
                </p>
              </div>

            </div>
          </div>
        `;

        try {
          const resendResponse = await fetch(
            "https://api.resend.com/emails",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${resendApiKey}`,
              },
              body: JSON.stringify({
                from: "DASAIA <pedidos@dasaia.es>",
                to: [order.email],
                subject: `Confirmación de tu pedido DASAIA #${order.id}`,
                html: emailHtml,
              }),
            }
          );

          const resendData = await resendResponse.json();

          if (!resendResponse.ok) {
            console.error(
              "Error enviando email con Resend:",
              resendData
            );
          } else {
            console.log(
              "EMAIL DE CONFIRMACIÓN ENVIADO CORRECTAMENTE:",
              resendData
            );
          }
        } catch (emailError) {
          console.error(
            "Error conectando con Resend:",
            emailError
          );
        }
      }
    }

    /*
     * SESIÓN DE CHECKOUT EXPIRADA
     *
     * Stripe puede enviar este evento cuando
     * una sesión de pago caduca.
     */
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log(
        "PAGO EXPIRADO:",
        session.id
      );

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error(
          "La sesión expirada no tiene orderId."
        );

        return NextResponse.json({
          received: true,
        });
      }

      /*
       * Solo cancelamos pedidos que todavía
       * estén esperando el pago.
       */
      const { data: order, error: orderError } =
        await supabaseAdmin
          .from("orders")
          .select("id, status, payment_status")
          .eq("id", orderId)
          .single();

      if (orderError || !order) {
        console.error(
          "No se ha encontrado el pedido expirado:",
          orderError
        );

        return NextResponse.json({
          received: true,
        });
      }

      if (order.payment_status === "pending") {
        const { error: cancelError } =
          await supabaseAdmin
            .from("orders")
            .update({
              status: "Cancelado",
              payment_status: "expired",
            })
            .eq("id", orderId);

        if (cancelError) {
          console.error(
            "Error cancelando el pedido expirado:",
            cancelError
          );

          return NextResponse.json(
            {
              error:
                "No se ha podido cancelar el pedido expirado.",
            },
            { status: 500 }
          );
        }

        console.log(
          "PEDIDO CANCELADO POR EXPIRACIÓN:",
          orderId
        );
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("ERROR WEBHOOK STRIPE:", error);

    return NextResponse.json(
      { error: "Webhook no válido." },
      { status: 400 }
    );
  }
}