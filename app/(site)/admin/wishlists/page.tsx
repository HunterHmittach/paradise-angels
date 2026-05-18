import supabase from "@/lib/supabase";
import Link from "next/link";

type WishlistItem = {
  id: number;
  user_id: string;
  customer_email: string | null;
  product_id: number;
  product_name: string | null;
  product_image: string | null;
  price: number | null;
  created_at: string;
};

export default async function AdminWishlistsPage() {
  const { data: wishlists, error } = await supabase
    .from("wishlists")
    .select(
      "id, user_id, customer_email, product_id, product_name, product_image, price, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white px-10 md:px-20 py-28">
        <p>Error loading wishlists: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-10 md:px-20 py-28">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.45em] uppercase text-white/40">
          Paradise Angels Admin
        </p>

        <h1 className="mt-6 font-serif text-5xl tracking-[0.2em] uppercase">
          Wishlists
        </h1>

        <p className="mt-6 text-white/50">
          See which customers are saving which products.
        </p>

        <div className="mt-14 overflow-x-auto border border-white/10 bg-white/[0.03]">
          <table className="w-full min-w-[1000px]">
            <thead className="border-b border-white/10">
              <tr className="text-left text-xs uppercase tracking-[0.25em] text-white/40">
                <th className="px-6 py-5">Product</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Saved</th>
                <th className="px-6 py-5">Open</th>
              </tr>
            </thead>

            <tbody>
              {wishlists?.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-white/50" colSpan={5}>
                    No wishlist saves yet.
                  </td>
                </tr>
              )}

              {wishlists?.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/10 hover:bg-white/[0.04] transition"
                >
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-5">
                      <img
                        src={item.product_image || "/black-hoodie.png"}
                        alt={item.product_name || "Product"}
                        className="w-16 h-20 object-cover bg-white/10"
                      />

                      <div>
                        <p className="font-serif text-xl tracking-[0.12em] uppercase">
                          {item.product_name || "Product"}
                        </p>
                        <p className="mt-2 text-xs text-white/40">
                          Product ID: {item.product_id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6 text-white/70">
                    {item.customer_email || "Unknown"}
                  </td>

                  <td className="px-6 py-6">
                    €{Number(item.price || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-6 text-white/50 text-sm">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-6">
                    <Link
                      href={`/shop/${item.product_id}`}
                      className="text-xs uppercase tracking-[0.25em] text-yellow-300 hover:text-yellow-200"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link
          href="/admin"
          className="inline-block mt-10 text-xs uppercase tracking-[0.3em] text-white/40 hover:text-white transition"
        >
          ← Back to Admin
        </Link>
      </div>
    </main>
  );
}