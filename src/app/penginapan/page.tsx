// src/app/penginapan/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/card";
import Button from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function PenginapanListPage() {
  const items = await prisma.property.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      locationText: true,
      pricePerNight: true,
      images: true,
      description: true,
    },
    orderBy: { createdAt: "desc" }, // hapus kalau schema tidak ada createdAt
    take: 100,
  });

  const rupiah = (n: number) => new Intl.NumberFormat("id-ID").format(n);

  return (
    <main className="py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Daftar Penginapan</h1>
        <Button href="/">Kembali</Button>
      </div>

      {items.length === 0 && (
        <Card>
          <CardBody className="text-sm text-gray-600">
            Belum ada data penginapan.
          </CardBody>
        </Card>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const cover =
            (Array.isArray(p.images) && p.images[0]) || "/placeholder.jpg";
          return (
            <li key={p.id}>
              <Link
                href={`/property/${p.slug}`}
                className="block focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <Card>
                  <img
                    src={cover}
                    alt={`Foto ${p.title}`}
                    className="h-40 w-full rounded-t-xl object-cover"
                  />
                  <CardBody>
                    <h2 className="line-clamp-1 text-base font-semibold">
                      {p.title}
                    </h2>
                    {p.locationText ? (
                      <p className="text-sm text-gray-600">{p.locationText}</p>
                    ) : null}
                    {p.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                        {p.description}
                      </p>
                    ) : null}
                    <p className="mt-2 font-medium">
                      Rp {rupiah(Number(p.pricePerNight ?? 0))}{" "}
                      <span className="text-sm text-gray-500">/malam</span>
                    </p>
                  </CardBody>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
