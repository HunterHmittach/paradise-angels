import supabase from "@/lib/supabase";
import Link from "next/link";
import StatusButtons from "./StatusButtons";
import TrackingForm from "./TrackingForm";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const orderId = Number(id);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (orderError || !order) {
    return (
      <main className="min-h-screen bg-[#f4f3ef] text-black flex items-center justify-center px-10">
        <div>
          <p className="font-serif text-3xl tracking-[0.2em] uppercase">
            Order not found
          </p>

          <p className="mt-4 text-black/50">
            Requested order ID: {id}
          </p>

          <Link
            href="/admin/orders"
            className="inline-block mt-8 text-xs uppercase tracking-[0.3em] text-black/40 hover:text-black transition"
          >
            ← Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-20 py-24">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin/orders"
          className="text-xs uppercase tracking-[0.3em] text-black/40 hover:text-black transition"
        >
          ← Back to Orders
        </Link>

        <div className="mt-10">
          <p className="text-xs tracking-[0.45em] uppercase text-black/40">
            Paradise Angels
          </p>

          <h1 className="mt-6 font-serif text-5xl tracking-[0.2em] uppercase">
            Order #{order.id}
          </h1>
        </div>

        <section className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="border border-black/10 bg-white p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              Customer
            </p>

            <p className="mt-4 text-lg break-words">
              {order.email || "No email"}
            </p>
          </div>

          <div className="border border-black/10 bg-white p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              Status
            </p>

            <p className="mt-4 text-lg uppercase">
              {order.status || "unknown"}
            </p>
          </div>

          <div className="border border-black/10 bg-white p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              Total
            </p>

            <p className="mt-4 text-lg">
              €{Number(order.total || 0).toFixed(2)}
            </p>
          </div>
        </section>

        <StatusButtons orderId={order.id} />

        <TrackingForm
         orderId={order.id}
          currentTracking={order.tracking_code}
         currentCarrier={order.shipping_carrier}
        />

        {itemsError && (
          <div className="mt-10 border border-red-300 bg-red-50 p-6 text-red-700">
            Could not load order items: {itemsError.message}
          </div>
        )}

        <section className="mt-20 border border-black/10 bg-white">
          <div className="border-b border-black/10 px-8 py-6">
            <h2 className="font-serif text-2xl tracking-[0.15em] uppercase">
              Order Items
            </h2>
          </div>

          <div>
            {!items || items.length === 0 ? (
              <p className="p-8 text-black/50">
                No items found for this order.
              </p>
            ) : (
              items.map((item: any) => {
                const quantity = Number(item.quantity || 1);
                const price = Number(item.price || 0);
                const lineTotal = price * quantity;

                return (
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
                        {item.product_name ||
                          `Product #${item.product_id || "unknown"}`}
                      </p>

                      <div className="mt-3 space-y-1 text-sm text-black/50">
                        {item.size && <p>Size: {item.size}</p>}
                        <p>Quantity: {quantity}</p>
                        <p>Product ID: {item.product_id || "unknown"}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-black/50">
                        Line Total
                      </p>

                      <p className="mt-2 tracking-[0.15em]">
                        €{lineTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}