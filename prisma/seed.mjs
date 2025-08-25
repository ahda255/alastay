import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const toSlug = s => s.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')

const samples = [
  { title: 'Homestay Danau Kembar', pricePerNight: 180000, locationText: 'Alahan Panjang', facilities: ['Parkir','Air Panas','Sarapan'], images: ['/img/1.jpg'], description: 'Dekat Danau Kembar.' },
  { title: 'Villa Kayu Bukit',     pricePerNight: 350000, locationText: 'Alahan Panjang', facilities: ['Dapur','WiFi','Pemandangan'], images: ['/img/2.jpg'], description: 'Villa kayu dengan view bukit.' },
  { title: 'Guesthouse Sawah',     pricePerNight: 220000, locationText: 'Alahan Panjang', facilities: ['WiFi','Parkir'], images: ['/img/3.jpg'], description: 'Dekat persawahan.' },
]

async function main(){
  await prisma.lead.deleteMany()
  await prisma.property.deleteMany()
  for (const p of samples) {
    await prisma.property.create({ data: { ...p, slug: toSlug(p.title), status: 'PUBLISHED' } })
  }
  console.log('Seed done')
}
main().finally(()=>prisma.$disconnect())
