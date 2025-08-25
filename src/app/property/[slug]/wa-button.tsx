'use client'
import { useState } from 'react'

type Props = {
  property: { id: string; title: string; pricePerNight: number }
  whatsappNumber: string
  formId: string // id form di halaman detail
}

export default function WaButton({ property, whatsappNumber, formId }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    try {
      setLoading(true)
      const form = document.getElementById(formId) as HTMLFormElement | null
      const fd = form ? new FormData(form) : new FormData()
      const checkin  = String(fd.get('checkin')  ?? '')
      const checkout = String(fd.get('checkout') ?? '')
      const guests   = Number(fd.get('guests')   ?? 1)

      // 1) simpan lead
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          source: 'web',
          checkin, checkout, guests
        }),
      })

      // 2) buka WhatsApp
      const msg = encodeURIComponent(
        `Halo, saya mau tanya ketersediaan:
- Properti: ${property.title}
- Tgl: ${checkin} s/d ${checkout}
- Tamu: ${guests}
Terima kasih.`
      )
      const wa = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${msg}`
      window.open(wa, '_blank', 'noopener,noreferrer')

      // 3) analytics event (opsional, lihat bagian 2)
      window.dispatchEvent(new CustomEvent('alastay:event', { detail: { name: 'click_wa', props: { propertyId: property.id } } }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      disabled={loading}
      onClick={handleClick}
      className="w-full rounded bg-green-600 disabled:opacity-60 text-white py-3 font-medium"
      aria-label="Chat via WhatsApp"
    >
      {loading ? 'Memproses...' : 'Chat via WhatsApp'}
    </button>
  )
}
