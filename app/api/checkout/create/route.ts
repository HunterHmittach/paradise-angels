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

function getImageUrl(origin: string, image: string) {
  if (!image) return undefined;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${origin}${image.startsWith("/") ? image : `/${image}`}`;
}

async function getOrCreateStripeCustomer(email: string, userId: string) {
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  return await stripe.customers.create({
    email,
    metadata: {
      user_id: userId,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const cart: CartItem[] = body.cart || [];
    const customerEmail: string = body.customerEmail || "";
    const userId: string = body.userId || "";

    if (!cart.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customerEmail || !userId) {
      return NextResponse.json(
        { error: "Customer must be logged in before checkout." },
        { status: 401 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const total = cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const stripeCustomer = await getOrCreateStripeCustomer(
      customerEmail,
      userId
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        email: customerEmail,
        user_id: userId,
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
      ui_mode: "embedded",
      mode: "payment",

      customer: stripeCustomer.id,

      line_items: cart.map((item) => {
        const imageUrl = getImageUrl(origin, item.image);

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: item.size ? `${item.name} - Size ${item.size}` : item.name,
              ...(imageUrl ? { images: [imageUrl] } : {}),
            },
            unit_amount: Math.round(Number(item.price) * 100),
          },
          quantity: item.quantity,
        };
      }),

      metadata: {
        order_id: String(order.id),
        user_id: userId,
        customer_email: customerEmail,
      },

      redirect_on_completion: "if_required",

      return_url: `${origin}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret) {
      return NextResponse.json(
        { error: "Stripe did not return a client secret." },
        { status: 500 }
      );
    }

    await supabase
      .from("orders")
      .update({
        payment_intent_id: session.id,
      })
      .eq("id", order.id);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      clientSecret: session.client_secret,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      {
        error: "Stripe checkout failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}