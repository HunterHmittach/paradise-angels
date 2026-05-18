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

    const { data: order, error: orderFetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", Number(orderId))
      .single();

    if (orderFetchError || !order) {
      return NextResponse.json(
        { error: orderFetchError?.message || "Order not found" },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        tracking_code: trackingCode || null,
        shipping_carrier: carrier || null,
        status: "shipped",
      })
      .eq("id", Number(orderId));

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    if (!order.email) {
      return NextResponse.json({
        success: true,
        warning: "Tracking saved, but order has no customer email.",
      });
    }

    const emailResult = await resend.emails.send({
      from: "Paradise Angels <orders@paradiseangels.nl>",
      to: order.email,
      subject: `Your Paradise Angels Order Has Shipped`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 40px; background: #f4f3ef; color: #000;">
          <div style="max-width: 620px; margin: 0 auto; background: #fff; padding: 40px; border: 1px solid #e5e0d8;">
            <p style="font-size: 12px; letter-spacing: 6px; text-transform: uppercase; color: #777;">
              Paradise Angels
            </p>

            <h1 style="font-family: Georgia, serif; font-size: 32px; letter-spacing: 5px; font-weight: 400; text-transform: uppercase; margin-top: 24px;">
              Order Shipped
            </h1>

            <p style="margin-top: 30px; font-size: 15px; line-height: 1.8; color: #555;">
              Your Paradise Angels order has been shipped.
            </p>

            <div style="margin-top: 36px; padding: 28px; background: #f4f3ef; border: 1px solid #e5e0d8; line-height: 1.9;">
              <p><strong>Order ID:</strong> #${order.id}</p>
              <p><strong>Carrier:</strong> ${carrier || "Shipping Carrier"}</p>
              <p><strong>Tracking Code:</strong> ${trackingCode || "-"}</p>
            </div>

            <p style="margin-top: 36px; font-size: 14px; color: #555;">
              Thank you for shopping with Paradise Angels.
            </p>

            <p style="margin-top: 50px; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #777;">
              Amsterdam Based — Worldwide Vision
            </p>
          </div>
        </div>
      `,
    });

    if (emailResult.error) {
      return NextResponse.json(
        { error: emailResult.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: emailResult.data?.id,
    });
  } catch (error) {
    console.error("Tracking update error:", error);

    return NextResponse.json(
      { error: "Tracking update failed" },
      { status: 500 }
    );
  }
}