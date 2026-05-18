import supabase from "@/lib/supabase";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-20 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-xs tracking-[0.45em] uppercase text-black/40">
            Paradise Angels
          </p>

          <h1 className="mt-6 font-serif text-5xl tracking-[0.2em] uppercase">
            Orders
          </h1>
        </div>

        <div className="overflow-x-auto border border-black/10 bg-white">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-black/10">
              <tr className="text-left text-xs uppercase tracking-[0.25em] text-black/50">
                <th className="px-6 py-5">Order</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Total</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Open</th>
              </tr>
            </thead>

            <tbody>
              {orders?.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-black/5 hover:bg-black/[0.02] transition"
                >
                  <td className="px-6 py-6 font-medium">
                    #{order.id}
                  </td>

                  <td className="px-6 py-6 text-black/70">
                    {order.email}
                  </td>

                  <td className="px-6 py-6">
                    €{Number(order.total).toFixed(2)}
                  </td>

                  <td className="px-6 py-6">
                    <span
                      className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border ${
                        order.status === "paid"
                          ? "border-green-500 text-green-600"
                          : "border-amber-500 text-amber-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-6 text-black/50 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-6">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs uppercase tracking-[0.25em] text-black hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}