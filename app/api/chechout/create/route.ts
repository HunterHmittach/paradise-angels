import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { items, email } = await req.json();

    if (!items || !email) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    // 1. Haal echte producten + prijzen op
    const ids = items.map((i: any) => i.id);

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, price")
      .in("id", ids);

    if (productsError || !products) {
      return NextResponse.json(
        { error: "Products not found" },
        { status: 500 }
      );
    }

    // 2. Bereken totaal SERVER-SIDE
    let total = 0;

    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      if (!product) continue;
      total += product.price * item.quantity;
    }

    // 3. Maak order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        email,
        total,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { error: "Order creation failed" },
        { status: 500 }
      );
    }

    // 4. Order items opslaan
    const orderItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.id);
      return {
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: product?.price,
      };
    });

    await supabase.from("order_items").insert(orderItems);

    return NextResponse.json({
      success: true,
      order_id: order.id,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
