import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type OrderItem = {
  product_name: string;
  quantity: number;
  price: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = body.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "Falta el ID del pedido" },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(
        "id, status, customer_name, customer_lastname, email, total, address, city, postal_code"
      )
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          error: "No se encontró el pedido",
          details: orderError?.message || "Pedido inexistente",
        },
        { status: 404 }
      );
    }

    if (order.status !== "Enviado") {
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "El pedido todavía no está marcado como enviado.",
      });
    }

    if (!order.email) {
      return NextResponse.json(
        { error: "El pedido no tiene email del cliente" },
        { status: 400 }
      );
    }

    const { data: items, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("product_name, quantity, price")
      .eq("order_id", order.id);

    if (itemsError) {
      return NextResponse.json(
        {
          error: "Error obteniendo los productos del pedido",
          details: itemsError.message,
        },
        { status: 500 }
      );
    }

    const orderItems = (items || []) as OrderItem[];

    const productsHtml = orderItems
      .map(
        (item) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eeeeee;">
              ${escapeHtml(String(item.product_name))}
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #eeeeee;text-align:center;">
              ${Number(item.quantity)}
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #eeeeee;text-align:right;">
              ${(Number(item.price) * Number(item.quantity)).toFixed(2)} €
            </td>
          </tr>
        `
      )
      .join("");

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "RESEND_API_KEY no está disponible",
        },
        { status: 500 }
      );
    }

    const emailHtml = `
      <div style="background:#faf9f7;padding:40px 20px;font-family:Arial,sans-serif;color:#111111;">
        <div style="max-width:650px;margin:0 auto;background:white;padding:40px;border-radius:20px;">

          <h1 style="margin:0 0 10px;font-size:28px;">
            DASAIA
          </h1>

          <p style="font-size:16px;color:#666666;">
            Tu pedido ha sido enviado 📦
          </p>

          <div style="margin:30px 0;padding:20px;background:#faf9f7;border-radius:12px;">
            <p>
              Hola <strong>${escapeHtml(
                `${order.customer_name || ""} ${order.customer_lastname || ""}`
              )}</strong>,
            </p>

            <p style="line-height:1.6;">
              Tu pedido
              <strong>#${escapeHtml(String(order.id))}</strong>
              ya ha sido enviado y está en camino.
            </p>
          </div>

          <h2>Resumen del pedido</h2>

          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>
                <th style="text-align:left;padding:10px 0;">
                  Producto
                </th>

                <th style="text-align:center;padding:10px 0;">
                  Cantidad
                </th>

                <th style="text-align:right;padding:10px 0;">
                  Precio
                </th>
              </tr>
            </thead>

            <tbody>
              ${productsHtml}
            </tbody>
          </table>

          <div style="margin-top:25px;padding-top:20px;border-top:2px solid #111111;">
            <strong>
              Total: ${Number(order.total).toFixed(2)} €
            </strong>
          </div>

          <div style="margin-top:30px;">
            <h2>Dirección de entrega</h2>

            <p style="line-height:1.6;color:#555555;">
              ${escapeHtml(String(order.address || ""))}<br>
              ${escapeHtml(String(order.postal_code || ""))}
              ${escapeHtml(String(order.city || ""))}
            </p>
          </div>

          <p style="margin-top:35px;color:#777777;">
            Gracias por confiar en DASAIA.
          </p>

        </div>
      </div>
    `;

    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "DASAIA <pedidos@dasaia.es>",
          to: [order.email],
          subject: `Tu pedido DASAIA #${order.id} ha sido enviado 📦`,
          html: emailHtml,
        }),
      }
    );

    const resendText = await resendResponse.text();

    let resendData: unknown;

    try {
      resendData = JSON.parse(resendText);
    } catch {
      resendData = resendText;
    }

    if (!resendResponse.ok) {
      console.error(
        "RESEND ERROR:",
        resendResponse.status,
        resendData
      );

      return NextResponse.json(
        {
          error: "Resend rechazó el correo",
          resendStatus: resendResponse.status,
          resendResponse: resendData,
        },
        { status: 500 }
      );
    }

    console.log(
      "RESEND OK:",
      resendResponse.status,
      resendData
    );

    return NextResponse.json({
      success: true,
      emailSent: true,
      resendResponse: resendData,
    });
  } catch (error) {
    console.error("STATUS EMAIL ERROR:", error);

    return NextResponse.json(
      {
        error: "Error interno",
        details: String(error),
      },
      { status: 500 }
    );
  }
}