import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderItem = {
  product_name: string | null;
  product_image: string | null;
  size: string | null;
  quantity: number;
  price: number;
};

export async function POST(req: Request) {
  try {
    const { sessionId, orderId } = await req.json();

    if (!sessionId || !orderId) {
      return NextResponse.json(
        { error: "Missing sessionId or orderId" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const customerEmail =
      session.customer_details?.email ||
      session.customer_email ||
      "guest@paradiseangels.local";

    const customerName =
      session.customer_details?.name || "Paradise Angels Customer";

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({
        email: customerEmail,
        status: "paid",
        payment_intent_id: String(session.payment_intent),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: orderError?.message || "Order update failed" },
        { status: 500 }
      );
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("product_name, product_image, size, quantity, price")
      .eq("order_id", orderId);

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 500 }
      );
    }

    const orderItems = (items || []) as OrderItem[];

    const itemsHtml = orderItems
      .map((item) => {
        const lineTotal = Number(item.price) * Number(item.quantity);

        return `
          <tr>
            <td style="padding: 18px 0; border-bottom: 1px solid #e5e0d8;">
              <strong>${item.product_name || "Product"}</strong><br/>
              ${
                item.size
                  ? `<span style="font-size: 13px; color: #777;">Size: ${item.size}</span><br/>`
                  : ""
              }
              <span style="font-size: 13px; color: #777;">Qty: ${item.quantity}</span>
            </td>
            <td style="padding: 18px 0; border-bottom: 1px solid #e5e0d8; text-align: right;">
              €${lineTotal.toFixed(2)}
            </td>
          </tr>
        `;
      })
      .join("");

    await resend.emails.send({
      from: "Paradise Angels <orders@paradiseangels.nl>",
      to: process.env.ORDER_EMAIL || "hunterhmittach@gmail.com",
      subject: `New paid order #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 40px; color: #111;">
          <h1>New Paid Order</h1>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Total:</strong> €${Number(order.total).toFixed(2)}</p>
          <p><strong>Status:</strong> paid</p>

          <h2 style="margin-top: 30px;">Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
          </table>
        </div>
      `,
    });

    await resend.emails.send({
      from: "Paradise Angels <orders@paradiseangels.nl>",
      to: customerEmail,
      subject: `Paradise Angels — Order Confirmation #${order.id}`,
      html: `
        <div style="font-family: Georgia, serif; background: #f4f3ef; padding: 48px; color: #111;">
          <div style="max-width: 620px; margin: 0 auto; background: #fff; padding: 42px;">
            <p style="letter-spacing: 6px; font-size: 12px; text-transform: uppercase; color: #777;">
              Paradise Angels
            </p>

            <h1 style="font-size: 34px; letter-spacing: 6px; font-weight: 400; text-transform: uppercase;">
              Order Confirmed
            </h1>

            <p style="font-family: Arial, sans-serif; line-height: 1.7; color: #555;">
              Thank you for your order, ${customerName}. Your payment has been confirmed.
            </p>

            <table style="width: 100%; margin-top: 34px; border-collapse: collapse; font-family: Arial, sans-serif;">
              ${itemsHtml}
            </table>

            <div style="margin-top: 30px; padding-top: 24px; border-top: 1px solid #e5e0d8; font-family: Arial, sans-serif;">
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Total:</strong> €${Number(order.total).toFixed(2)}</p>
              <p><strong>Status:</strong> Paid</p>
            </div>

            <p style="margin-top: 34px; font-family: Arial, sans-serif; color: #555;">
              Paradise Angels will contact you with shipping updates.
            </p>

            <p style="margin-top: 50px; letter-spacing: 4px; font-size: 11px; text-transform: uppercase; color: #777;">
              Amsterdam Based — Worldwide Vision
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Checkout confirmation failed:", error);

    return NextResponse.json(
      { error: "Checkout confirmation failed" },
      { status: 500 }
    );
  }
}