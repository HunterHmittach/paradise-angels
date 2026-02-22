import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabase-admin";

type CartItemIn = {
  id: number;
  quantity?: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const email = body?.email;
    const cartRaw = body?.cart;

    if (!email || !Array.isArray(cartRaw) || cartRaw.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: missing email or cart" },
        { status: 400 }
      );
    }

    // Normalize cart: only keep valid numeric ids and qty >= 1
    const cart: CartItemIn[] = cartRaw
      .map((x: any) => ({
        id: Number(x?.id),
        quantity: x?.quantity == null ? 1 : Number(x?.quantity),
      }))
      .filter((x: CartItemIn) => Number.isFinite(x.id) && x.id > 0 && Number.isFinite(x.quantity!) && (x.quantity ?? 1) > 0);

    if (cart.length === 0) {
      return NextResponse.json(
        { error: "Invalid cart: no valid items" },
        { status: 400 }
      );
    }

    const productIds = [...new Set(cart.map((i) => i.id))];

    // Fetch products by ids
    const { data: products, error: prodErr } = await supabaseAdmin
      .from("products")
      .select("id, price")
      .in("id", productIds);

    if (prodErr) {
      return NextResponse.json(
        {
          error: "Supabase products query failed",
          details: prodErr,
          productIds,
        },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        {
          error: "No matching products found for cart ids",
          productIds,
        },
        { status: 400 }
      );
    }

    // Check if any ids are missing in DB
    const foundIds = new Set(products.map((p) => p.id));
    const missingIds = productIds.filter((id) => !foundIds.has(id));
    if (missingIds.length > 0) {
      return NextResponse.json(
        {
          error: "Some cart products do not exist in DB",
          missingIds,
          productIds,
        },
        { status: 400 }
      );
    }

    // Build order items + total
    let total = 0;

    const orderItems = cart.map((item) => {
      const product = products.find((p) => p.id === item.id)!;
      const quantity = item.quantity ?? 1;

      // price is numeric in DB; can come as number or string -> force Number
      const price = Number(product.price);
      total += price * quantity;

      return {
        product_id: item.id,
        quantity,
        price, // unit price
      };
    });

    // Create order
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        email,
        total,
        status: "pending",
      })
      .select()
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        { error: "Order creation failed", details: orderErr },
        { status: 500 }
      );
    }

    // Insert order items
    const itemsWithOrderId = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .insert(itemsWithOrderId);

    if (itemsErr) {
      return NextResponse.json(
        { error: "Order items insert failed", details: itemsErr },
        { status: 500 }
      );
    }

    return NextResponse.json({ order_id: order.id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Server error", raw: err },
      { status: 500 }
    );
  }
}
