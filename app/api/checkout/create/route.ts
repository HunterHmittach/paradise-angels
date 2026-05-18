import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size?: string | null;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cart: CartItem[] = body.cart || [];

    if (!cart.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const total = cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        email: "guest@paradiseangels.local",
        total,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: orderError?.message || "Order creation failed" },
        { status: 500 }
      );
    }

    const orderItems = cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      product_name: item.name,
      product_image: item.image,
      size: item.size || null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "ideal"],

      line_items: cart.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.size ? `${item.name} - Size ${item.size}` : item.name,
            images: [`${origin}${item.image}`],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      })),

      metadata: {
        order_id: String(order.id),
      },

      success_url: `${origin}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    await supabase
      .from("orders")
      .update({
        payment_intent_id: session.id,
      })
      .eq("id", order.id);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    );
  }
}