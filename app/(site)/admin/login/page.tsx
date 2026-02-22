"use client";

import { useState } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return setError(error.message);

    router.push("/admin"); // ga naar admin
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <input
          className="p-3 rounded bg-gray-800 text-white"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="p-3 rounded bg-gray-800 text-white"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400">{error}</p>}

        <button
          type="submit"
          className="bg-white text-black rounded py-3 font-semibold"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
