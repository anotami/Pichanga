'use client'
import { useState, useEffect } from 'react'

interface Props {
  perfilId: string
  className?: string
}

export default function FavoritoButton({ perfilId, className = '' }: Props) {
  const [esFavorito, setEsFavorito] = useState(false)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    setVisible(true)
    fetch('/api/favoritos', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => {
        const ids: string[] = (j.data ?? []).map((p: { id: string }) => p.id)
        setEsFavorito(ids.includes(perfilId))
      })
      .catch(() => {})
  }, [perfilId])

  if (!visible) return null

  async function toggle() {
    const token = localStorage.getItem('token')
    if (!token || loading) return
    setLoading(true)
    const siguiente = !esFavorito
    setEsFavorito(siguiente)
    try {
      if (siguiente) {
        await fetch('/api/favoritos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ perfilId }),
        })
      } else {
        await fetch(`/api/favoritos/${perfilId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch { setEsFavorito(!siguiente) }
    finally { setLoading(false) }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={esFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      className={`transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 ${className}`}
    >
      {esFavorito ? (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ) : (
        <svg className="w-6 h-6 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      )}
    </button>
  )
}
