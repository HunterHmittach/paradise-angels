"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StatusButtons({
  orderId,
}: {
  orderId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState("");

  async function updateStatus(status: string) {
    setLoading(status);

    const res = await fetch("/api/admin/orders/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        status,
      }),
    });

    setLoading("");

    if (!res.ok) {
      alert("Status update failed");
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-10 flex flex-wrap gap-4">
      <button
        onClick={() => updateStatus("shipped")}
        disabled={loading !== ""}
        className="border border-black px-6 py-4 uppercase tracking-[0.25em] text-xs hover:bg-black hover:text-white transition disabled:opacity-40"
      >
        {loading === "shipped" ? "Updating..." : "Mark Shipped"}
      </button>

      <button
        onClick={() => updateStatus("fulfilled")}
        disabled={loading !== ""}
        className="border border-black px-6 py-4 uppercase tracking-[0.25em] text-xs hover:bg-black hover:text-white transition disabled:opacity-40"
      >
        {loading === "fulfilled" ? "Updating..." : "Mark Fulfilled"}
      </button>

      <button
        onClick={() => updateStatus("cancelled")}
        disabled={loading !== ""}
        className="border border-red-500 text-red-600 px-6 py-4 uppercase tracking-[0.25em] text-xs hover:bg-red-600 hover:text-white transition disabled:opacity-40"
      >
        {loading === "cancelled" ? "Updating..." : "Cancel Order"}
      </button>
    </div>
  );
}