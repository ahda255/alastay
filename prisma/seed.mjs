// prisma/seed.mjs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Gunakan ID deterministik supaya upsert idempotent
  const items = [
    { id: "seed-1", name: "Homestay AlaStay Padang", address: "Padang, Sumbar",     price: 250000 },
    { id: "seed-2", name: "Guesthouse Minang",       address: "Bukittinggi, Sumbar", price: 300000 },
    { id: "seed-3", name: "Vila Danau Maninjau",     address: "Agam, Sumbar",        price: 450000 },
  ];

  for (const it of items) {
    await prisma.accommodation.upsert({
      where: { id: it.id },       // ✅ pakai field unik
      create: it,                 // buat jika belum ada
      update: {                   // update jika sudah ada
        name: it.name,
        address: it.address,
        price: it.price,
      },
    });
  }

  console.log("✅ Seed OK");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
