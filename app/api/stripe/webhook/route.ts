import { NextResponse } from "next/server";
import Stripe from "stripe";
import supabaseAdmin from "@/lib/supabase-admin";

export const runtime = "nodejs"; // belangrijk voor Stripe

const secretKey = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(secretKey, {
  apiVersion: "2025-12-15.clover", // match jouw types
});

export async function POST(req: Request) {
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature failed: ${err.message}` }, { status: 400 });
  }

  try {
    // PaymentIntent succesvol
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata?.order_id;

      if (orderId) {
        await supabaseAdmin
          .from("orders")
          .update({ status: "paid" })
          .eq("id", Number(orderId));
      }
    }

    // Payment failed (optioneel)
    if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata?.order_id;

      if (orderId) {
        await supabaseAdmin
          .from("orders")
          .update({ status: "failed" })
          .eq("id", Number(orderId));
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Webhook handler failed" }, { status: 500 });
  }
}
