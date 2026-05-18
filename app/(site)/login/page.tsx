"use client";

import { useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAILS = [
  "hunterhmittach@gmail.com",
  "m.hmittach@gmail.com",
];

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        setError(error.message);
        return;
      }

      if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        router.push("/admin");
      } else {
        router.push("/account");
      }

      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Account created. Check your email to confirm your account.");
  }

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-24 pt-40 pb-28">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <section>
          <p className="text-xs tracking-[0.45em] uppercase text-black/40">
            Paradise Angels
          </p>

          <h1 className="mt-8 font-serif text-5xl md:text-7xl tracking-[0.25em] uppercase leading-tight">
            Account
          </h1>

          <p className="mt-10 max-w-md text-black/60 leading-relaxed">
            Sign in to view your orders, wishlist and Paradise Angels account.
          </p>
        </section>

        <section className="border border-black/10 bg-white/40 p-10">
          <div className="flex gap-8 mb-12 text-xs tracking-[0.35em] uppercase">
            <button
              onClick={() => setMode("login")}
              className={mode === "login" ? "text-black" : "text-black/40"}
            >
              Login
            </button>

            <button
              onClick={() => setMode("signup")}
              className={mode === "signup" ? "text-black" : "text-black/40"}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label className="block text-xs tracking-[0.3em] uppercase mb-4">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-black/30 py-4 outline-none focus:border-black transition"
              />
            </div>

            <div>
              <label className="block text-xs tracking-[0.3em] uppercase mb-4">
                Password
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-black/30 py-4 outline-none focus:border-black transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="text-sm text-black/60">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 uppercase tracking-[0.3em] text-xs hover:bg-black/80 transition disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <Link
            href="/shop"
            className="inline-block mt-10 text-xs tracking-[0.3em] uppercase text-black/40 hover:text-black transition"
          >
            Continue Shopping
          </Link>
        </section>
      </div>
    </main>
  );
}