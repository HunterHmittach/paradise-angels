import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { orderId, trackingCode, carrier } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", Number(orderId))
      .single();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("orders")
      .update({
        tracking_code: trackingCode || null,
        shipping_carrier: carrier || null,
        status: "shipped",
      })
      .eq("id", Number(orderId));

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (order.email) {
      await resend.emails.send({
        from: "Paradise Angels <orders@paradise-angels.com>",
        to: order.email,
        subject: `Your Paradise Angels Order Has Shipped`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 40px; background: #f4f3ef; color: #000;">
            <h1 style="font-size: 28px; letter-spacing: 0.2em; text-transform: uppercase;">
              Paradise Angels
            </h1>

            <p style="margin-top: 30px; font-size: 15px; line-height: 1.8;">
              Your order has been shipped.
            </p>

            <div style="margin-top: 40px; padding: 30px; background: white; border: 1px solid #ddd;">
              <p><strong>Order ID:</strong> #${order.id}</p>
              <p><strong>Carrier:</strong> ${carrier || "Shipping Carrier"}</p>
              <p><strong>Tracking Code:</strong> ${trackingCode || "-"}</p>
            </div>

            <p style="margin-top: 40px; font-size: 14px; color: #666;">
              Thank you for shopping with Paradise Angels.
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking update error:", error);

    return NextResponse.json(
      { error: "Tracking update failed" },
      { status: 500 }
    );
  }
}