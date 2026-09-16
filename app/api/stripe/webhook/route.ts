import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
          .select("id, status")
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
       * Si ya está procesado, no volvemos a descontar stock.
       */
      if (order.status === "Procesando") {
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
          .select("product_id, product_name, quantity")
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
       * Una vez descontado el stock,
       * marcamos el pedido como Procesando.
       */
      const { error: updateError } =
        await supabaseAdmin
          .from("orders")
          .update({
            status: "Procesando",
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
        "PEDIDO PROCESADO CORRECTAMENTE:",
        orderId
      );
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