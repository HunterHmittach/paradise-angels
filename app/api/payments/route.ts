import { NextResponse } from "next/server";
import Stripe from "stripe";
import supabaseAdmin from "@/lib/supabase-admin";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  // Fail fast: dit voorkomt vage errors
  throw new Error("Missing STRIPE_SECRET_KEY in environment");
}

const stripe = new Stripe(secretKey, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    // Order ophalen
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, total, status")
      .eq("id", order_id)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "Order not found", details: error },
        { status: 404 }
      );
    }

    // Als je wilt: voorkom dubbele payments
    if (order.status === "paid") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      );
    }

    // total is numeric -> kan string zijn
    const totalNumber = Number(order.total);
    if (!Number.isFinite(totalNumber) || totalNumber <= 0) {
      return NextResponse.json(
        { error: "Invalid order total", total: order.total },
        { status: 400 }
      );
    }

    // Stripe amount in cents (EUR)
    const amount = Math.round(totalNumber * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: { order_id: String(order.id) },
    });

    return NextResponse.json({ client_secret: paymentIntent.client_secret });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Payment failed",
        message: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
