import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// --- GET: list leads (optional filters & paging) ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const propertyId = searchParams.get('propertyId') ?? undefined
    const take = Math.min(Number(searchParams.get('take') ?? '50'), 200) // limit
    const skip = Number(searchParams.get('skip') ?? '0')

    const where: any = {}
    if (propertyId) where.propertyId = propertyId

    const items = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      select: {
        id: true,
        propertyId: true,
        source: true,
        checkin: true,
        checkout: true,
        guests: true,
        status: true,
        amount: true,
        createdAt: true,
      },
    })

    return NextResponse.json(items)
  } catch (err: any) {
    console.error('[GET /api/leads] error', err)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

// --- POST: bikin lead ---
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const lead = await prisma.lead.create({
      data: {
        propertyId: body.propertyId,
        source: body.source,
        checkin: new Date(body.checkin),
        checkout: new Date(body.checkout),
        guests: body.guests,
      },
    })

    return NextResponse.json({ ok: true, id: lead.id })
  } catch (err: any) {
    console.error('[POST /api/leads] error', err)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
