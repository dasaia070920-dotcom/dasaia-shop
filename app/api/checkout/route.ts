import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
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
     * Comprobamos si el cliente está conectado a su cuenta.
     */
    let userId: string | null = null;

    try {
      const cookieStore = await cookies();

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(
                  ({ name, value, options }) => {
                    cookieStore.set(name, value, options);
                  }
                );
              } catch {
                // No hacemos nada si las cookies no pueden modificarse.
              }
            },
          },
        }
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;
      }
    } catch (authError) {
      console.error(
        "No se pudo comprobar la sesión del usuario:",
        authError
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
     * El pago tiene una duración máxima de 1 hora.
     */
    const paymentExpiresAt = new Date(
      Date.now() + 60 * 60 * 1000
    ).toISOString();

    const stripeExpiresAt = Math.floor(
      new Date(paymentExpiresAt).getTime() / 1000
    );

    /*
     * Creamos el pedido como pago pendiente.
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
            status: "Pago pendiente",
            payment_status: "pending",
            payment_expires_at: paymentExpiresAt,
            stripe_session_id: null,
            user_id: userId,
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

    /*
     * Usamos la dirección real desde la que se está haciendo
     * la petición.
     */
    const baseUrl = new URL(request.url).origin;

    /*
     * Creamos la sesión de Stripe con caducidad de 1 hora.
     */
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: lineItems,

      customer_email: email,

      billing_address_collection: "required",

      expires_at: stripeExpiresAt,

      metadata: {
        orderId: order.id,
      },

      success_url:
        `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${baseUrl}/checkout/cancel`,
    });

    /*
     * Guardamos la sesión de Stripe asociada al pedido.
     */
    const { error: updateOrderError } = await supabaseAdmin
      .from("orders")
      .update({
        stripe_session_id: session.id,
      })
      .eq("id", order.id);

    if (updateOrderError) {
      console.error(
        "ERROR GUARDANDO SESIÓN DE STRIPE:",
        updateOrderError
      );

      return NextResponse.json(
        {
          error:
            "El pedido se creó, pero no se pudo guardar la sesión de pago.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
      orderId: order.id,
      paymentExpiresAt,
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