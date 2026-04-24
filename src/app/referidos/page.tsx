'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ReferidosData {
  codigoReferido: string
  referidos: Array<{ id: string; nombre: string; createdAt: string }>
  totalReferidos: number
  puntosReferidos: number
  shareUrl: string
}

export default function ReferidosPage() {
  const router = useRouter()
  const [data, setData] = useState<ReferidosData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    fetch('/api/referidos', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => setData(j.data))
      .finally(() => setLoading(false))
  }, [router])

  function copiar(texto: string) {
    navigator.clipboard.writeText(texto).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  if (loading) return <div className="text-center py-20 text-4xl animate-pulse">⚽</div>
  if (!data) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← Volver al dashboard</Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">🎁 Referidos</h1>
      <p className="text-gray-500 mb-8">Invitá amigos a Pichanga y ganá puntos por cada uno que se registre.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-4xl font-bold text-red-600">{data.totalReferidos}</div>
          <div className="text-sm text-gray-500 mt-1">Amigos referidos</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-amber-500">{data.puntosReferidos}</div>
          <div className="text-sm text-gray-500 mt-1">Puntos ganados</div>
        </div>
      </div>

      {/* Code */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Tu código de referido</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-lg font-bold tracking-widest text-gray-800 select-all">
            {data.codigoReferido}
          </div>
          <button
            onClick={() => copiar(data.codigoReferido)}
            className={`px-4 py-3 rounded-xl font-medium text-sm transition ${copiado ? 'bg-green-100 text-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            {copiado ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Share URL */}
      <div className="card mb-8">
        <h2 className="font-semibold text-gray-900 mb-3">Link de invitación</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 truncate">
            {data.shareUrl}
          </div>
          <button
            onClick={() => copiar(data.shareUrl)}
            className="px-4 py-3 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition whitespace-nowrap"
          >
            Copiar link
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Compartí este link con tus amigos. Al registrarse, ambos ganan puntos.</p>
      </div>

      {/* How it works */}
      <div className="card mb-8 bg-amber-50 border-amber-200">
        <h2 className="font-semibold text-amber-900 mb-3">¿Cómo funciona?</h2>
        <ol className="space-y-2 text-sm text-amber-800">
          <li className="flex gap-3"><span className="font-bold">1.</span>Compartí tu código o link con un amigo</li>
          <li className="flex gap-3"><span className="font-bold">2.</span>Tu amigo se registra usando tu código</li>
          <li className="flex gap-3"><span className="font-bold">3.</span>Ganás <strong>50 puntos</strong> automáticamente</li>
          <li className="flex gap-3"><span className="font-bold">4.</span>Los puntos suben tu nivel en el ranking</li>
        </ol>
      </div>

      {/* List of referidos */}
      {data.referidos.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Amigos que referiste</h2>
          <div className="space-y-2">
            {data.referidos.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-600">
                    {r.nombre.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{r.nombre}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-amber-600">+50 pts</span>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('es-PE')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
