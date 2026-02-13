"use client";

import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-24 px-6 opacity-80">Payment verwerken…</div>}>
      <SuccessClient />
    </Suspense>
  );
}
