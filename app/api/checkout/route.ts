import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerLastname,
      email,
      phone,
      address,
      city,
      postalCode,
      cart,
    } = body;

    if (
      !customerName ||
      !customerLastname ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postalCode
    ) {
      return NextResponse.json(
        { error: "Faltan datos del cliente." },
        { status: 400 }
      );
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío." },
        { status: 400 }
      );
    }

    /*
     * Comprobamos productos y stock.
     */
    for (const item of cart) {
      const { data: product, error: productError } =
        await supabaseAdmin
          .from("products")
          .select("id, name, stock")
          .eq("id", item.id)
          .single();

      if (productError || !product) {
        return NextResponse.json(
          {
            error: `No se ha encontrado el producto "${item.name}".`,
          },
          { status: 400 }
        );
      }

      const stock = Number(product.stock) || 0;
      const quantity = Number(item.quantity) || 0;

      if (quantity <= 0) {
        return NextResponse.json(
          {
            error: `Cantidad no válida para "${item.name}".`,
          },
          { status: 400 }
        );
      }

      if (stock < quantity) {
        return NextResponse.json(
          {
            error: `No hay suficientes unidades de "${item.name}". Stock disponible: ${stock}.`,
          },
          { status: 400 }
        );
      }
    }

    const subtotal = cart.reduce(
      (
        total: number,
        item: {
          price: number;
          quantity: number;
        }
      ) => {
        return total + Number(item.price) * Number(item.quantity);
      },
      0
    );

    const shipping = subtotal >= 60 ? 0 : 4.99;
    const total = subtotal + shipping;

    /*
     * Creamos el pedido usando la conexión privada de Supabase.
     * Esto funciona aunque RLS esté activado.
     */
    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .insert([
          {
            customer_name: customerName,
            customer_lastname: customerLastname,
            email,
            phone,
            address,
            city,
            postal_code: postalCode,
            total,
            status: "Pendiente",
            user_id: null,
          },
        ])
        .select()
        .single();

    if (orderError || !order) {
      console.error("ERROR CREANDO PEDIDO:", orderError);

      return NextResponse.json(
        {
          error:
            orderError?.message ||
            "No se ha podido crear el pedido.",
        },
        { status: 500 }
      );
    }

    /*
     * Guardamos los productos del pedido.
     */
    const orderItems = cart.map(
      (item: {
        id: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
      }) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        image: item.image,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })
    );

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error(
        "ERROR CREANDO PRODUCTOS DEL PEDIDO:",
        itemsError
      );

      await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        {
          error:
            "No se han podido guardar los productos del pedido.",
        },
        { status: 500 }
      );
    }

    /*
     * Creamos los productos que Stripe mostrará.
     */
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cart.map(
        (item: {
          name: string;
          price: number;
          quantity: number;
        }) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(
              Number(item.price) * 100
            ),
          },
          quantity: Number(item.quantity),
        })
      );

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Envío",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        line_items: lineItems,

        customer_email: email,

        billing_address_collection: "required",

        metadata: {
          orderId: order.id,
        },

        success_url:
          `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${baseUrl}/checkout/cancel`,
      });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("ERROR STRIPE:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se ha podido iniciar el pago.",
      },
      { status: 500 }
    );
  }
}