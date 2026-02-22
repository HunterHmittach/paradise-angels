"use client";

import { useState } from "react";
import supabase from "@/lib/supabase";

export default function NewProductPage() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function handleSubmit(e: any) {
    e.preventDefault();

    let image_url = "";

    // ---- IMAGE UPLOAD ----
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;

// Upload naar map "uploads/"
const { data: storageData, error: storageError } =
  await supabase.storage
    .from("product-images")
    .upload(`uploads/${fileName}`, imageFile);

if (storageError) {
  alert("Upload error: " + storageError.message);
  return;
}

// Public URL ophalen
image_url = supabase.storage
  .from("product-images")
  .getPublicUrl(`uploads/${fileName}`).data.publicUrl;

    }

    // ---- SAVE PRODUCT ----
const { data, error } = await supabase.from("products").insert({
  name,
  description: desc,
  price: Number(price),
  image_url,
});

console.log("INSERT RESULT =", data, error);

if (error) {
  alert("Database fout: " + error.message);
  return;
}

alert("Product toegevoegd!");
window.location.href = "/admin/products";


    if (!error) {
      alert("Product toegevoegd!");
      window.location.href = "/admin/products";
    }
  }

  return (
    <main className="p-10 max-w-xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Nieuw product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* NAME */}
        <div>
          <label className="block mb-1">Naam</label>
          <input
            className="w-full p-2 rounded bg-white text-black"
            placeholder="Naam"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-1">Beschrijving</label>
          <textarea
            className="w-full p-2 rounded bg-white text-black"
            placeholder="Beschrijving"
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="block mb-1">Prijs</label>
          <input
            className="w-full p-2 rounded bg-white text-black"
            type="number"
            step="0.01"
            placeholder="Prijs"
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* IMAGE */}
        <div>
          <label className="block mb-1">Afbeelding uploaden</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 rounded bg-gray-200 text-black"
            onChange={(e: any) => setImageFile(e.target.files[0])}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded"
        >
          Opslaan
        </button>
      </form>
    </main>
  );
}
