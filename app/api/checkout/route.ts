import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@supabase/supabase-js";

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

    if (!customerName || !email || !address || !city || !postalCode) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios del pedido." },
        { status: 400 }
      );
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío." },
        { status: 400 }
      );
    }

    let userId: string | null = null;

    const authHeader = request.headers.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
      const accessToken = authHeader.substring(7);

      try {
        const supabaseAuth = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const {
          data: { user },
          error: userError,
        } = await supabaseAuth.auth.getUser(accessToken);

        if (userError) {
          console.error("Error identificando usuario:", userError);
        } else if (user) {
          userId = user.id;
          console.log("Usuario identificado:", user.id);
        }
      } catch (authError) {
        console.error("Error comprobando sesión:", authError);
      }
    }

    const subtotal = cart.reduce(
      (total: number, item: any) =>
        total + Number(item.price) * Number(item.quantity || 1),
      0
    );

    const shipping = subtotal >= 60 ? 0 : 4.99;
    const total = subtotal + shipping;

    const paymentExpiresAt = new Date(
      Date.now() + 60 * 60 * 1000
    ).toISOString();

    const stripeExpiresAt = Math.floor(
      Date.now() / 1000 + 60 * 60
    );

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        customer_name: customerName,
        customer_lastname: customerLastname || "",
        email,
        phone: phone || "",
        address,
        city,
        postal_code: postalCode,
        total,
        status: "Pago pendiente",
        payment_status: "pending",
        payment_expires_at: paymentExpiresAt,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creando pedido:", orderError);

      return NextResponse.json(
        { error: "No se pudo crear el pedido." },
        { status: 500 }
      );
    }

    const orderItems = cart.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: Number(item.quantity || 1),
      price: Number(item.price),
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creando productos del pedido:", itemsError);

      await supabaseAdmin
        .from("orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        { error: "No se pudieron guardar los productos del pedido." },
        { status: 500 }
      );
    }

    const baseUrl = new URL(request.url).origin;

    const lineItems = cart.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity || 1),
    }));

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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: email,
      expires_at: stripeExpiresAt,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      metadata: {
        orderId: order.id,
      },
    });

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        stripe_session_id: session.id,
      })
      .eq("id", order.id);

    if (updateError) {
      console.error(
        "Error guardando stripe_session_id:",
        updateError
      );
    }

    return NextResponse.json({
      url: session.url,
      orderId: order.id,
      paymentExpiresAt,
    });
  } catch (error) {
    console.error("Error en checkout:", error);

    return NextResponse.json(
      { error: "Error interno al procesar el pedido." },
      { status: 500 }
    );
  }
}