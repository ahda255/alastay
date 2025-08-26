// src/app/property/[slug]/page.tsx
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import WaButton from "./wa-button";

// Next 15: params adalah Promise
type PageProps = { params: Promise<{ slug: string }> };

// (Opsional) SEO dinamis
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p =
    (await prisma.property.findUnique({ where: { slug } })) ??
    (await prisma.property.findFirst({ where: { slug } }));

  if (!p) return { title: "Properti tidak ditemukan - AlaStay" };

  const price = Number(p.pricePerNight ?? 0);
  const title = `${p.title} – Rp ${new Intl.NumberFormat("id-ID").format(price)}/malam`;
  const desc = p.description ?? `${p.title}${p.locationText ? ` di ${p.locationText}` : ""}`;
  const image = Array.isArray(p.images) && p.images.length ? p.images[0]! : "/placeholder.jpg";

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: [image] },
    twitter: { card: "summary_large_image", title, description: desc, images: [image] },
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;

  const p =
    (await prisma.property.findUnique({ where: { slug } })) ??
    (await prisma.property.findFirst({ where: { slug } }));

  if (!p) return <main className="p-4">Properti tidak ditemukan.</main>;

  const wa = process.env.WHATSAPP_NUMBER ?? ""; // contoh: 62812xxxxxxxx
  const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(n);

  // images & facilities biasanya JSON[]
  const images: string[] = Array.isArray(p.images) ? (p.images as unknown as string[]) : [];
  const cover = images[0] ?? "/placeholder.jpg";
  const facilities: string[] = Array.isArray(p.facilities)
    ? (p.facilities as unknown as string[])
    : [];

  return (
    <main className="p-4 space-y-4">
      {/* 🔹 Breadcrumb mini */}
      <nav className="text-sm text-gray-500">
        <a href="/penginapan" className="hover:underline">Penginapan</a>
        <span> / </span>
        <span className="text-gray-700">{p.title}</span>
      </nav>

      {/* 🔹 Cover 16:9 */}
      <img
        src={cover}
        alt={`Foto ${p.title}`}
        className="mt-3 w-full rounded-xl border object-cover aspect-[16/9]"
      />

      {/* 🔹 Header rapi */}
      <header className="mt-4">
        <h1 className="text-2xl font-semibold">{p.title}</h1>
        {p.locationText && <p className="mt-1 text-sm text-gray-600">{p.locationText}</p>}
        <p className="mt-2 text-lg font-semibold">
          Rp{fmt(Number(p.pricePerNight ?? 0))}{" "}
          <span className="text-sm font-normal text-gray-500">/malam</span>
        </p>
      </header>

      {p.description && (
        <p className="text-sm leading-relaxed whitespace-pre-line">{p.description}</p>
      )}

      {facilities.length > 0 && (
        <ul className="flex flex-wrap gap-2 text-xs">
          {facilities.map((f, i) => (
            <li key={i} className="rounded border px-2 py-1">
              {f}
            </li>
          ))}
        </ul>
      )}

      {/* Form untuk menyusun pesan & simpan lead */}
      <form id="book-form" className="grid max-w-md grid-cols-2 gap-2" aria-label="Form booking">
        <label className="col-span-2 text-sm">
          Tanggal check-in
          <input name="checkin" type="date" className="w-full rounded border p-2" />
        </label>
        <label className="col-span-2 text-sm">
          Tanggal check-out
          <input name="checkout" type="date" className="w-full rounded border p-2" />
        </label>
        <label className="col-span-2 text-sm">
          Jumlah tamu
          <input name="guests" type="number" min={1} defaultValue={1} className="w-full rounded border p-2" />
        </label>
      </form>

      <WaButton
        property={{ id: p.id, title: p.title, pricePerNight: Number(p.pricePerNight ?? 0) }}
        whatsappNumber={wa}
        formId="book-form"
      />
    </main>
  );
}
