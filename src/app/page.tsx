import Script from "next/script";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/card";
import Button from "@/components/ui/button";

// (opsional) karena ada akses DB, pastikan tidak ke-cache
export const revalidate = 0;

// Tipe data kartu yang dipakai UI
type PropertyCard = {
  id: string;
  slug: string;
  title: string;
  locationText: string;
  pricePerNight: number;
  images: string[] | null;
};

// helper number dari query
function toNumber(v: unknown): number | undefined {
  const s = Array.isArray(v) ? v[0] : (v as string | undefined);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

// formatter ribuan
const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(n);

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const location =
    typeof sp.location === "string"
      ? sp.location
      : Array.isArray(sp.location)
      ? sp.location[0] ?? ""
      : "";

  const min = toNumber(sp.min);
  const max = toNumber(sp.max);

  // where Prisma
  const where: Record<string, any> = {};
  if (location) where.locationText = { contains: location, mode: "insensitive" };
  if (min != null || max != null) {
    where.pricePerNight = {};
    if (min != null) where.pricePerNight.gte = min;
    if (max != null) where.pricePerNight.lte = max;
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
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="py-6 space-y-6">
      {/* CTA ke daftar penginapan */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Jelajahi Penginapan</h1>
        <Button href="/penginapan">Lihat Daftar</Button>
      </div>

      {/* Script analytics */}
      <Script id="alastay-list-events" strategy="afterInteractive">
        {`
          (function () {
            function send(name, props) {
              window.dispatchEvent(new CustomEvent('alastay:event', { detail: { name, props } }));
            }
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
              send('view_list');
            } else {
              document.addEventListener('DOMContentLoaded', function(){ send('view_list'); });
            }
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
            document.addEventListener('click', function (e) {
              var el = e.target;
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
      <form
        id="filter-form"
        className="grid grid-cols-2 gap-2"
        role="search"
        aria-label="Filter penginapan"
      >
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
          defaultValue={min ?? ""}
          placeholder="Min Harga"
          className="border p-2 rounded"
          aria-label="Harga minimum"
        />
        <input
          name="max"
          type="number"
          defaultValue={max ?? ""}
          placeholder="Max Harga"
          className="border p-2 rounded"
          aria-label="Harga maksimum"
        />
        <button className="border p-2 rounded col-span-2">Terapkan</button>
      </form>

      {/* List kartu */}
      <section
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-live="polite"
      >
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/property/${p.slug}`}
            className="block focus:outline-none focus:ring-2 focus:ring-blue-500/40 rounded-xl"
            data-prop-id={p.id}
            data-prop-slug={p.slug}
            aria-label={`Lihat detail ${p.title}`}
          >
            <Card>
              <img
                src={p.images?.[0] ?? "/placeholder.jpg"}
                alt={`Foto ${p.title}`}
                className="h-40 w-full rounded-t-xl object-cover"
              />
              <CardBody>
                <h2 className="line-clamp-1 text-base font-semibold">
                  {p.title}
                </h2>
                <p className="text-sm text-gray-600">{p.locationText}</p>
                <p className="mt-1 font-medium">
                  Rp {fmt(p.pricePerNight)}/malam
                </p>
              </CardBody>
            </Card>
          </Link>
        ))}

        {items.length === 0 && (
          <Card>
            <CardBody className="text-sm text-gray-600">
              Tidak ada hasil sesuai filter
            </CardBody>
          </Card>
        )}
      </section>
    </main>
  );
}
