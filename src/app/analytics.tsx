'use client'
import { useEffect } from 'react'

export default function Analytics() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GA_ID) return
    // event bus sederhana
    const handler = (e: Event) => {
      const ce = e as CustomEvent
      const { name, props } = ce.detail || {}
      // @ts-ignore
      window.gtag?.('event', name, props || {})
    }
    window.addEventListener('alastay:event', handler)
    return () => window.removeEventListener('alastay:event', handler)
  }, [])

  return null
}
