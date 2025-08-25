// src/app/property/[slug]/page.tsx
import { prisma } from '@/lib/db'
import type { Metadata } from 'next'
import WaButton from './wa-button'

type PageProps = { params: { slug: string } }

// (Opsional) SEO dinamis
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await prisma.property.findUnique({ where: { slug: params.slug } })
  if (!p) return { title: 'Properti tidak ditemukan - AlaStay' }

  const title = `${p.title} – Rp ${new Intl.NumberFormat('id-ID').format(p.pricePerNight)}/malam`
  const desc = p.description ?? `${p.title} di ${p.locationText}`
  const image = p.images?.[0] ?? '/placeholder.jpg'

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: [image] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [image] },
  }
}

export default async function PropertyPage({ params }: PageProps) {
  const p = await prisma.property.findUnique({ where: { slug: params.slug } })
  if (!p) return <main className="p-4">Properti tidak ditemukan.</main>

  const wa = process.env.WHATSAPP_NUMBER ?? '' // contoh: 62812xxxxxxxx
  const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n)

  // ✅ deklarasikan di luar JSX agar tidak error
  const facilities: string[] = Array.isArray(p.facilities) ? (p.facilities as string[]) : []

  return (
    <main className="p-4 space-y-4">
      <img
        src={p.images?.[0] ?? '/placeholder.jpg'}
        alt={`Foto ${p.title}`}
        className="w-full h-56 object-cover rounded"
      />

      <header>
        <h1 className="text-2xl font-bold">{p.title}</h1>
        <p className="text-sm">{p.locationText}</p>
        <p className="mt-1 font-medium">Rp {fmt(p.pricePerNight)}/malam</p>
      </header>

      {p.description && <p className="text-sm leading-relaxed">{p.description}</p>}

      {facilities.length ? (
        <ul className="flex flex-wrap gap-2 text-xs">
          {facilities.map((f: string, i: number) => (
            <li key={i} className="border rounded px-2 py-1">
              {f}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Form untuk menyusun pesan & simpan lead */}
      <form id="book-form" className="grid grid-cols-2 gap-2 max-w-md" aria-label="Form booking">
        <label className="col-span-2 text-sm">
          Tanggal check-in
          <input name="checkin" type="date" className="border p-2 rounded w-full" />
        </label>
        <label className="col-span-2 text-sm">
          Tanggal check-out
          <input name="checkout" type="date" className="border p-2 rounded w-full" />
        </label>
        <label className="col-span-2 text-sm">
          Jumlah tamu
          <input name="guests" type="number" min={1} defaultValue={1} className="border p-2 rounded w-full" />
        </label>
      </form>

      <WaButton
        property={{ id: p.id, title: p.title, pricePerNight: p.pricePerNight }}
        whatsappNumber={wa}
        formId="book-form"
      />
    </main>
  )
}
