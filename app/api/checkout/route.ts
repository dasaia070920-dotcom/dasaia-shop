import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      cart,
      customer,
      userId,
    } = body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío." },
        { status: 400 }
      );
    }

    if (!customer) {
      return NextResponse.json(
        { error: "Faltan los datos del cliente." },
        { status: 400 }
      );
    }

    const {
      name,
      lastname,
      email,
      phone,
      address,
      city,
      postal_code,
    } = customer;

    const total = cart.reduce(
      (sum: number, item: any) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    );

    const shipping = total >= 60 ? 0 : 4.99;
    const finalTotal = total + shipping;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId || null,
        customer_name: name,
        customer_lastname: lastname,
        email,
        phone,
        address,
        city,
        postal_code,
        total: finalTotal,
        status: "Pendiente",
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
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creando productos del pedido:", itemsError);

      return NextResponse.json(
        { error: "No se pudieron guardar los productos del pedido." },
        { status: 500 }
      );
    }

    const origin = new URL(request.url).origin;

    const lineItems = cart.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity),
    }));

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Gastos de envío",
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
      metadata: {
        order_id: String(order.id),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Error en checkout:", error);

    return NextResponse.json(
      { error: "Ha ocurrido un error al iniciar el pago." },
      { status: 500 }
    );
  }
}