'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitaTracker() {
  const pathname = usePathname()
  useEffect(() => {
    fetch('/api/visitas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pagina: pathname }),
    }).catch(() => {})
  }, [pathname])
  return null
}
