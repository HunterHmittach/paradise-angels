import { NextResponse } from "next/server";
import Stripe from "stripe";
import supabaseAdmin from "@/lib/supabase-admin";

export const runtime = "nodejs";

const secretKey = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(secretKey, { apiVersion: "2025-12-15.clover" });

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const payment_intent = searchParams.get("payment_intent");

    if (!payment_intent) {
      return NextResponse.json({ error: "Missing payment_intent" }, { status: 400 });
    }

    // 1) Vraag Stripe op -> metadata.order_id
    const pi = await stripe.paymentIntents.retrieve(payment_intent);
    const orderId = pi.metadata?.order_id;

    if (!orderId) {
      return NextResponse.json(
        { error: "No order_id in payment intent metadata" },
        { status: 404 }
      );
    }

    // 2) Haal order + items op uit Supabase
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .select("id, email, total, status, created_at")
      .eq("id", Number(orderId))
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: "Order not found", details: orderErr }, { status: 404 });
    }

    const { data: items, error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .select("product_id, quantity, price")
      .eq("order_id", order.id);

    if (itemsErr) {
      return NextResponse.json({ error: "Order items not found", details: itemsErr }, { status: 500 });
    }

    // product names ophalen
    const productIds = [...new Set((items ?? []).map((i) => i.product_id))];
    const { data: products } = await supabaseAdmin
      .from("products")
      .select("id, name, image_url")
      .in("id", productIds);

    const nameById = new Map((products ?? []).map((p) => [p.id, p]));

    const itemsWithNames = (items ?? []).map((i) => ({
      ...i,
      product: nameById.get(i.product_id) ?? null,
      line_total: Number(i.price) * Number(i.quantity),
    }));

    return NextResponse.json({ order, items: itemsWithNames });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", message: err?.message ?? "Unknown" },
      { status: 500 }
    );
  }
}
