import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

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

    if (!user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const { data: order, error: orderError } =
      await supabaseAdmin
        .from("orders")
        .select(
          "id, user_id, email, status, payment_status, payment_expires_at, stripe_session_id"
        )
        .eq("id", id)
        .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "No se ha encontrado el pedido." },
        { status: 404 }
      );
    }

    /*
     * Comprobamos que el pedido pertenece a la cuenta.
     */
    if (order.user_id !== user.id) {
      return NextResponse.json(
        { error: "No tienes permiso para acceder a este pedido." },
        { status: 403 }
      );
    }

    if (
      order.payment_status !== "pending" ||
      order.status !== "Pago pendiente"
    ) {
      return NextResponse.json(
        { error: "Este pedido ya no tiene un pago pendiente." },
        { status: 400 }
      );
    }

    if (!order.stripe_session_id) {
      return NextResponse.json(
        { error: "No se ha encontrado la sesión de pago." },
        { status: 400 }
      );
    }

    /*
     * Comprobamos que todavía queda tiempo.
     */
    if (order.payment_expires_at) {
      const expiresAt = new Date(
        order.payment_expires_at
      ).getTime();

      if (Date.now() >= expiresAt) {
        await supabaseAdmin
          .from("orders")
          .update({
            status: "Cancelado",
            payment_status: "expired",
          })
          .eq("id", order.id)
          .eq("payment_status", "pending");

        return NextResponse.json(
          {
            error:
              "El tiempo para completar el pago ha terminado.",
          },
          { status: 400 }
        );
      }
    }

    /*
     * Recuperamos la sesión existente de Stripe.
     */
    const session = await stripe.checkout.sessions.retrieve(
      order.stripe_session_id
    );

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe ya no permite continuar con este pago." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "ERROR CONTINUANDO EL PAGO:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se ha podido continuar con el pago.",
      },
      { status: 500 }
    );
  }
}