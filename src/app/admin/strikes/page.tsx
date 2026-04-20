'use client'
import { useState, useEffect } from 'react'

interface StrikeData {
  strikes: Array<{
    id: string; tipo: string; descripcion?: string; baneoAplicado: number; createdAt: string
    jugador: { id: string; nombre: string; email: string; baneoHasta?: string; totalStrikes: number }
    reportadoPor: { nombre: string }
    partido: { titulo: string; distrito: string }
  }>
  baneados: Array<{
    id: string; nombre: string; email: string; baneoHasta: string; totalStrikes: number
    perfil?: { posicion: string; distrito: string }
  }>
}

export default function AdminStrikesPage() {
  const [data, setData] = useState<StrikeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState<'strikes' | 'baneados'>('baneados')

  function fetchData() {
    const token = localStorage.getItem('adminToken')
    setLoading(true)
    fetch('/api/admin/strikes', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => setData(j.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  async function desbanear(id: string) {
    const token = localStorage.getItem('adminToken')
    const res = await fetch(`/api/admin/usuarios/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ accion: 'desbanear' })
    })
    const json = await res.json()
    setMsg(json.data?.mensaje || json.error)
    fetchData()
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse">Cargando...</div>
  if (!data) return null

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Strikes y Baneos</h1>
        <p className="text-gray-400 mt-1">Gestión de infracciones y sanciones</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-red-400">{data.strikes.length}</p>
          <p className="text-gray-400 text-sm mt-1">Total strikes</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-amber-400">{data.baneados.length}</p>
          <p className="text-gray-400 text-sm mt-1">Usuarios baneados ahora</p>
        </div>
      </div>

      {msg && <div className="bg-green-900/50 border border-green-700 text-green-300 rounded-xl px-4 py-3 text-sm mb-4">{msg}</div>}

      <div className="flex gap-2 mb-4">
        {(['baneados', 'strikes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}>
            {t === 'baneados' ? `🚫 Baneados (${data.baneados.length})` : `⚡ Historial strikes (${data.strikes.length})`}
          </button>
        ))}
      </div>

      {tab === 'baneados' && (
        data.baneados.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">✅</div>
            <p>No hay usuarios baneados actualmente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.baneados.map(u => (
              <div key={u.id} className="bg-gray-800 rounded-xl border border-red-900 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{u.nombre}</p>
                    <p className="text-gray-400 text-sm">{u.email}</p>
                    {u.perfil && <p className="text-gray-500 text-xs mt-1">{u.perfil.posicion} · {u.perfil.distrito}</p>}
                    <p className="text-red-400 text-xs mt-1">
                      Baneado hasta: {new Date(u.baneoHasta).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
                      · {u.totalStrikes} strike{u.totalStrikes > 1 ? 's' : ''}
                    </p>
                  </div>
                  <button onClick={() => desbanear(u.id)}
                    className="bg-green-900/50 border border-green-700 text-green-300 text-xs px-3 py-1.5 rounded-lg hover:bg-green-900 transition">
                    Levantar baneo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'strikes' && (
        <div className="space-y-3">
          {data.strikes.map(s => (
            <div key={s.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.tipo === 'NO_SHOW' ? 'bg-red-900 text-red-300' : 'bg-orange-900 text-orange-300'}`}>
                      {s.tipo === 'NO_SHOW' ? '🚫 No show' : '⚠️ Mal comportamiento'}
                    </span>
                    <span className="text-white font-medium">{s.jugador.nombre}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    Partido: <span className="text-gray-300">{s.partido.titulo}</span> · {s.partido.distrito}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Reportado por: {s.reportadoPor.nombre} · Baneo: {s.baneoAplicado} días
                  </p>
                  {s.descripcion && <p className="text-gray-400 text-xs mt-1 italic">"{s.descripcion}"</p>}
                </div>
                <p className="text-gray-500 text-xs flex-shrink-0">{new Date(s.createdAt).toLocaleDateString('es-PE')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
