"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        setLoading(false);
        router.push("/login");
        return;
      }

      if (!data.session?.user) {
        setLoading(false);
        router.push("/login");
        return;
      }

      setEmail(data.session.user.email || "");
      setLoading(false);
    }

    loadUser();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-24 pt-40 pb-28">
        <p className="text-xs tracking-[0.45em] uppercase text-black/40">
          Paradise Angels
        </p>

        <h1 className="mt-8 font-serif text-5xl md:text-7xl tracking-[0.25em] uppercase">
          Loading
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-24 pt-40 pb-28">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.45em] uppercase text-black/40">
          Paradise Angels
        </p>

        <h1 className="mt-8 font-serif text-5xl md:text-7xl tracking-[0.25em] uppercase">
          Account
        </h1>

        <p className="mt-10 text-black/60">Signed in as {email}</p>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Link
            href="/account/orders"
            className="border border-black/10 bg-white/40 p-8 hover:bg-white transition"
          >
            <h2 className="font-serif text-2xl tracking-[0.15em] uppercase">
              Orders
            </h2>
            <p className="mt-4 text-black/50">View your order history.</p>
          </Link>

          <Link
            href="/account/wishlist"
            className="border border-black/10 bg-white/40 p-8 hover:bg-white transition"
          >
            <h2 className="font-serif text-2xl tracking-[0.15em] uppercase">
              Wishlist
            </h2>
            <p className="mt-4 text-black/50">Saved pieces.</p>
          </Link>

          <button
            onClick={logout}
            className="border border-black/10 bg-white/40 p-8 text-left hover:bg-white transition"
          >
            <h2 className="font-serif text-2xl tracking-[0.15em] uppercase">
              Logout
            </h2>
            <p className="mt-4 text-black/50">Sign out of your account.</p>
          </button>
        </div>
      </div>
    </main>
  );
}