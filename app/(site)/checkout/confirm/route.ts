import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const { data: order, error } = await supabase
      .from("orders")
      .update({
        email: customerEmail,
        status: "paid",
        payment_intent_id: String(session.payment_intent),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: error?.message || "Order update failed" },
        { status: 500 }
      );
    }

    await resend.emails.send({
      from: "Paradise Angels <onboarding@resend.dev>",
      to: process.env.ORDER_EMAIL || "hunterhmittach@gmail.com",
      subject: `New paid order #${order.id}`,
      html: `
        <h2>New Paid Order</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Total:</strong> €${Number(order.total).toFixed(2)}</p>
        <p><strong>Status:</strong> paid</p>
      `,
    });

    if (customerEmail !== "guest@paradiseangels.local") {
      await resend.emails.send({
        from: "Paradise Angels <onboarding@resend.dev>",
        to: customerEmail,
        subject: `Paradise Angels order confirmation #${order.id}`,
        html: `
          <h2>Order Confirmed</h2>
          <p>Thank you for your order, ${customerName}.</p>
          <p>Your payment has been confirmed.</p>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Total:</strong> €${Number(order.total).toFixed(2)}</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Checkout confirmation failed:", error);

    return NextResponse.json(
      { error: "Checkout confirmation failed" },
      { status: 500 }
    );
  }
}