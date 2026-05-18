"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TrackingForm({
  orderId,
  currentTracking,
  currentCarrier,
}: {
  orderId: number;
  currentTracking?: string | null;
  currentCarrier?: string | null;
}) {
  const router = useRouter();

  const [trackingCode, setTrackingCode] = useState(currentTracking || "");
  const [carrier, setCarrier] = useState(currentCarrier || "");
  const [loading, setLoading] = useState(false);

  async function saveTracking(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/orders/tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        trackingCode,
        carrier,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Tracking update failed");
      return;
    }

    router.refresh();
  }

  return (
    <form
      onSubmit={saveTracking}
      className="mt-10 border border-black/10 bg-white p-8"
    >
      <h2 className="font-serif text-2xl tracking-[0.15em] uppercase">
        Shipping Tracking
      </h2>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-black/40 mb-3">
            Carrier
          </label>
          <input
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            placeholder="PostNL / DHL"
            className="w-full border-b border-black/20 bg-transparent py-3 outline-none focus:border-black transition"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-black/40 mb-3">
            Tracking Code
          </label>
          <input
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="Tracking code"
            className="w-full border-b border-black/20 bg-transparent py-3 outline-none focus:border-black transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 border border-black px-8 py-4 uppercase tracking-[0.25em] text-xs hover:bg-black hover:text-white transition disabled:opacity-40"
      >
        {loading ? "Saving..." : "Save Tracking"}
      </button>
    </form>
  );
}