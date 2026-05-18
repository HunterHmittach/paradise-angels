import supabase from "@/lib/supabase";
import Link from "next/link";

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number(id);

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f4f3ef] text-black flex items-center justify-center px-10">
        <p>Order not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-24 pt-40 pb-28">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/account/orders"
          className="text-xs uppercase tracking-[0.3em] text-black/40 hover:text-black transition"
        >
          ← Back to Orders
        </Link>

        <p className="mt-10 text-xs tracking-[0.45em] uppercase text-black/40">
          Paradise Angels
        </p>

        <h1 className="mt-6 font-serif text-5xl tracking-[0.2em] uppercase">
          Order #{order.id}
        </h1>

        <section className="mt-14 grid md:grid-cols-3 gap-6">
          <div className="border border-black/10 bg-white/40 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              Status
            </p>
            <p className="mt-4 uppercase">{order.status}</p>
          </div>

          <div className="border border-black/10 bg-white/40 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              Total
            </p>
            <p className="mt-4">€{Number(order.total || 0).toFixed(2)}</p>
          </div>

          <div className="border border-black/10 bg-white/40 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              Tracking
            </p>
            <p className="mt-4">
              {order.tracking_code
                ? `${order.shipping_carrier || ""} ${order.tracking_code}`
                : "Not shipped yet"}
            </p>
          </div>
        </section>

        <section className="mt-20 border border-black/10 bg-white/40">
          <div className="border-b border-black/10 px-8 py-6">
            <h2 className="font-serif text-2xl tracking-[0.15em] uppercase">
              Items
            </h2>
          </div>

          {items?.map((item: any) => (
            <div
              key={item.id}
              className="grid md:grid-cols-[100px_1fr_auto] gap-8 items-center px-8 py-7 border-b border-black/5"
            >
              <img
                src={item.product_image || "/black-hoodie.png"}
                alt={item.product_name || "Product"}
                className="w-[100px] h-[125px] object-cover bg-[#e9e7df]"
              />

              <div>
                <p className="font-serif text-xl tracking-[0.15em] uppercase">
                  {item.product_name || `Product #${item.product_id}`}
                </p>

                <div className="mt-3 text-sm text-black/50">
                  {item.size && <p>Size: {item.size}</p>}
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>

              <p>€{Number(item.price || 0).toFixed(2)}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}