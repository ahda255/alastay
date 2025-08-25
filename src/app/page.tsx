// src/app/page.tsx
import Link from 'next/link'
import Script from 'next/script'
import { prisma } from '../lib/db' // sesuaikan path jika beda

// (opsional) karena ada akses DB, pastikan tidak ke-cache
export const revalidate = 0
// atau bisa juga: export const dynamic = 'force-dynamic'

// Tipe data kartu yang dipakai UI
type PropertyCard = {
  id: string
  slug: string
  title: string
  locationText: string
  pricePerNight: number
  images: string[] | null
}

// helper number dari query
function toNumber(v: unknown): number | undefined {
  const s = Array.isArray(v) ? v[0] : (v as string | undefined)
  if (!s) return undefined
  const n = Number(s)
  return Number.isFinite(n) ? n : undefined
}

// formatter ribuan
const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n)

export default async function Home({
  // Next.js 15: searchParams adalah Promise -> harus di-await
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams

  const location =
    typeof sp.location === 'string'
      ? sp.location
      : Array.isArray(sp.location)
      ? sp.location[0] ?? ''
      : ''

  const min = toNumber(sp.min)
  const max = toNumber(sp.max)

  // where Prisma
  const where: Record<string, any> = {}
  if (location) where.locationText = { contains: location, mode: 'insensitive' }
  if (min != null || max != null) {
    where.pricePerNight = {}
    if (min != null) where.pricePerNight.gte = min
    if (max != null) where.pricePerNight.lte = max
  }

  // Query data
  const items: PropertyCard[] = await prisma.property.findMany({
    where,
    select: {
      id: true,
      slug: true,
      title: true,
      locationText: true,
      pricePerNight: true,
      images: true,
    },
    // Hapus baris ini kalau skema tidak punya createdAt
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="p-4 space-y-4">
      {/* Script analytics: view_list + filter_applied + click_card */}
      <Script id="alastay-list-events" strategy="afterInteractive">
        {`
          (function () {
            // dispatch helper
            function send(name, props) {
              window.dispatchEvent(new CustomEvent('alastay:event', { detail: { name, props } }));
            }

            // 1) View list saat halaman siap
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
              send('view_list');
            } else {
              document.addEventListener('DOMContentLoaded', function(){ send('view_list'); });
            }

            // 2) Filter applied saat submit form
            var form = document.getElementById('filter-form');
            if (form) {
              form.addEventListener('submit', function () {
                var fd = new FormData(form);
                var data = {
                  location: (fd.get('location') || '').toString(),
                  min: Number(fd.get('min') || '') || null,
                  max: Number(fd.get('max') || '') || null
                };
                send('filter_applied', data);
              });
            }

            // 3) Click card: delegasi klik pada link yang punya data-prop-id
            document.addEventListener('click', function (e) {
              var el = e.target;
              // cari anchor terdekat
              while (el && el !== document) {
                if (el instanceof HTMLAnchorElement && el.dataset && el.dataset.propId) {
                  send('click_card', { propertyId: el.dataset.propId, slug: el.dataset.propSlug });
                  break;
                }
                el = el.parentElement;
              }
            });
          })();
        `}
      </Script>

      {/* Form filter */}
      <form id="filter-form" className="grid grid-cols-2 gap-2" role="search" aria-label="Filter penginapan">
        <input
          name="location"
          defaultValue={location}
          placeholder="Lokasi (teks)"
          className="border p-2 rounded col-span-2 sm:col-span-1"
          aria-label="Lokasi"
        />
        <input
          name="min"
          type="number"
          defaultValue={min ?? ''}
          placeholder="Min Harga"
          className="border p-2 rounded"
          aria-label="Harga minimum"
        />
        <input
          name="max"
          type="number"
          defaultValue={max ?? ''}
          placeholder="Max Harga"
          className="border p-2 rounded"
          aria-label="Harga maksimum"
        />
        <button className="border p-2 rounded col-span-2">Terapkan</button>
      </form>

      {/* List kartu */}
      <section className="grid gap-3" aria-live="polite">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/property/${p.slug}`}
            className="block border rounded p-3 focus:outline-none focus:ring-2"
            data-prop-id={p.id}
            data-prop-slug={p.slug}
            aria-label={`Lihat detail ${p.title}`}
          >
            <img
              src={p.images?.[0] ?? '/placeholder.jpg'}
              alt={`Foto ${p.title}`}
              className="w-full h-40 object-cover rounded"
            />
            <div className="mt-2">
              <h2 className="text-lg font-semibold">{p.title}</h2>
              <p className="text-sm">{p.locationText}</p>
              <p className="font-medium mt-1">Rp {fmt(p.pricePerNight)}/malam</p>
            </div>
          </Link>
        ))}

        {items.length === 0 && (
          <p className="text-sm text-gray-500">Tidak ada hasil sesuai filter</p>
        )}
      </section>
      
    </main>
  )
}
