"use client";

import { FormEvent, useState } from "react";
import supabase from "@/lib/supabase";

export default function NewProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);

  async function uploadImage(file: File) {
    const safeFileName = file.name.replace(/\s+/g, "-").toLowerCase();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}-${safeFileName}`;

    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (error) {
      throw new Error(error.message);
    }

    const publicUrl = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath).data.publicUrl;

    return publicUrl;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!mainImageFile) {
        alert("Upload eerst een main image.");
        setLoading(false);
        return;
      }

      const mainImageUrl = await uploadImage(mainImageFile);

      const galleryUrls: string[] = [];

      for (const file of galleryFiles) {
        const url = await uploadImage(file);
        galleryUrls.push(url);
      }

      const allGalleryImages = galleryUrls.join(",");

      const { error } = await supabase.from("products").insert({
        name,
        description,
        price: Number(price),
        image_url: mainImageUrl,
        gallery_images: allGalleryImages,
      });

      if (error) {
        alert("Database fout: " + error.message);
        setLoading(false);
        return;
      }

      alert("Product toegevoegd!");
      window.location.href = "/admin/products";
    } catch (error) {
      alert(
        "Upload fout: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-10 md:px-20 py-24">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase text-white/40">
          Paradise Angels Admin
        </p>

        <h1 className="mt-6 text-4xl md:text-6xl font-serif tracking-[0.18em] uppercase">
          New Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-14 border border-white/10 bg-white/[0.03] p-8 md:p-10 space-y-8"
        >
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-white/40 mb-3">
              Product Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Black Hoodie"
              className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-white transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-white/40 mb-3">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              placeholder="A refined Paradise Angels piece..."
              className="w-full bg-transparent border border-white/20 p-4 outline-none focus:border-white transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-white/40 mb-3">
              Price
            </label>

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              type="number"
              step="0.01"
              placeholder="89.99"
              className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-white transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-white/40 mb-3">
              Main Image
            </label>

            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) =>
                setMainImageFile(e.target.files ? e.target.files[0] : null)
              }
              className="w-full border border-white/20 p-4 text-sm text-white/60"
            />

            {mainImageFile && (
              <p className="mt-3 text-sm text-white/40">
                Selected: {mainImageFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-white/40 mb-3">
              Gallery Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setGalleryFiles(e.target.files ? Array.from(e.target.files) : [])
              }
              className="w-full border border-white/20 p-4 text-sm text-white/60"
            />

            <p className="mt-3 text-sm text-white/40">
              Je kan meerdere extra foto’s tegelijk selecteren.
            </p>

            {galleryFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {galleryFiles.map((file) => (
                  <p key={file.name} className="text-sm text-white/50">
                    {file.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-5 uppercase tracking-[0.3em] text-xs hover:bg-white/80 transition disabled:opacity-40"
          >
            {loading ? "Saving Product..." : "Save Product"}
          </button>
        </form>
      </div>
    </main>
  );
}