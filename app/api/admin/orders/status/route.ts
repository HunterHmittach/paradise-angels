import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

const ALLOWED_STATUSES = ["pending", "paid", "shipped", "fulfilled", "cancelled"];

export async function POST(req: Request) {
  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Missing orderId or status" },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", Number(orderId));

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order status update error:", error);

    return NextResponse.json(
      { error: "Status update failed" },
      { status: 500 }
    );
  }
}