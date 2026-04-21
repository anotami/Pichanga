'use client'
import { useState, useEffect } from 'react'
import { formatPrecio } from '@/lib/constants'
import Link from 'next/link'

interface Stats {
  usuarios: { total: number; jugadores: number; organizadores: number; clubes: number; baneados: number }
  partidos: { total: number; abiertos: number; completados: number }
  solicitudes: { total: number; aceptadas: number }
  ingresos: { comisiones: number; volumen: number }
  strikes: { total: number }
  jugadoresPorPosicion: Array<{ posicion: string; _count: number; _avg: { rating: number; precio: number } }>
  partidosPorDistrito: Array<{ distrito: string; _count: number }>
  registrosRecientes: Array<{ id: string; nombre: string; tipo: string; createdAt: string }>
}

function NPCPanel() {
  const [npcCount, setNpcCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgColor, setMsgColor] = useState('text-green-300')

  function getToken() { return localStorage.getItem('adminToken') }

  async function fetchCount() {
    const r = await fetch('/api/admin/seed-npcs', { headers: { Authorization: `Bearer ${getToken()}` } })
    const j = await r.json()
    if (j.data) setNpcCount(j.data.npcCount)
  }

  useEffect(() => { fetchCount() }, [])

  async function poblar() {
    if (!confirm('¿Crear 532 jugadores de fútbol + 87 de pádel? Esto puede tardar ~30 segundos.')) return
    setLoading(true)
    setMsg('')
    try {
      const r = await fetch('/api/admin/seed-npcs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      const j = await r.json()
      if (r.ok) {
        setMsg(`✅ Creados ${j.data.created} NPCs — ${j.data.futbol} fútbol + ${j.data.padel} pádel`)
        setMsgColor('text-green-300')
        fetchCount()
      } else {
        setMsg(`❌ ${j.error}`)
        setMsgColor('text-red-300')
      }
    } finally { setLoading(false) }
  }

  async function eliminar() {
    if (!confirm(`¿Eliminar los ${npcCount} jugadores NPC? Esta acción es irreversible.`)) return
    setLoading(true)
    setMsg('')
    try {
      const r = await fetch('/api/admin/seed-npcs', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      const j = await r.json()
      if (r.ok) {
        setMsg(`🗑️ Eliminados ${j.data.deleted} NPCs`)
        setMsgColor('text-amber-300')
        setNpcCount(0)
      } else {
        setMsg(`❌ ${j.error}`)
        setMsgColor('text-red-300')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-5 border border-purple-800/50 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">🤖 Jugadores NPC (solo admin)</h3>
          <p className="text-gray-400 text-xs mt-0.5">Jugadores ficticios para poblar la plataforma. Invisibles como NPC para usuarios.</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-purple-400">{npcCount ?? '...'}</p>
          <p className="text-gray-500 text-xs">activos</p>
        </div>
      </div>
      {msg && <p className={`text-sm mb-3 ${msgColor}`}>{msg}</p>}
      <div className="flex gap-3">
        <button onClick={poblar} disabled={loading || (npcCount !== null && npcCount > 0)}
          className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-600 transition disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? 'Generando...' : '⚡ Poblar 619 NPCs'}
        </button>
        {npcCount !== null && npcCount > 0 && (
          <button onClick={eliminar} disabled={loading}
            className="bg-gray-700 text-red-400 border border-red-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition disabled:opacity-40">
            🗑️ Eliminar NPCs
          </button>
        )}
      </div>
    </div>
  )
}

function PartidosPanel() {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgColor, setMsgColor] = useState('text-green-300')

  function getToken() { return localStorage.getItem('adminToken') }

  async function fetchCount() {
    const r = await fetch('/api/admin/seed-partidos', { headers: { Authorization: `Bearer ${getToken()}` } })
    const j = await r.json()
    if (j.data) setCount(j.data.partidosCount)
  }

  useEffect(() => { fetchCount() }, [])

  async function poblar() {
    if (!confirm('¿Crear 25 partidos de fútbol + 10 de pádel de ejemplo?')) return
    setLoading(true); setMsg('')
    try {
      const r = await fetch('/api/admin/seed-partidos', { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` } })
      const j = await r.json()
      if (r.ok) { setMsg(`✅ Creados ${j.data.created} partidos — ${j.data.futbol} fútbol + ${j.data.padel} pádel`); setMsgColor('text-green-300'); fetchCount() }
      else { setMsg(`❌ ${j.error}`); setMsgColor('text-red-300') }
    } finally { setLoading(false) }
  }

  async function eliminar() {
    if (!confirm(`¿Eliminar los ${count} partidos de ejemplo?`)) return
    setLoading(true); setMsg('')
    try {
      const r = await fetch('/api/admin/seed-partidos', { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } })
      const j = await r.json()
      if (r.ok) { setMsg(`🗑️ Eliminados ${j.data.deleted} partidos`); setMsgColor('text-amber-300'); setCount(0) }
      else { setMsg(`❌ ${j.error}`); setMsgColor('text-red-300') }
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-5 border border-blue-800/50 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold">⚽ Partidos de ejemplo</h3>
          <p className="text-gray-400 text-xs mt-0.5">25 partidos de fútbol + 10 de pádel con fechas futuras.</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-400">{count ?? '...'}</p>
          <p className="text-gray-500 text-xs">activos</p>
        </div>
      </div>
      {msg && <p className={`text-sm mb-3 ${msgColor}`}>{msg}</p>}
      <div className="flex gap-3">
        <button onClick={poblar} disabled={loading || (count !== null && count > 0)}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? 'Creando...' : '⚡ Poblar 35 partidos'}
        </button>
        {count !== null && count > 0 && (
          <button onClick={eliminar} disabled={loading}
            className="bg-gray-700 text-red-400 border border-red-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition disabled:opacity-40">
            🗑️ Eliminar partidos
          </button>
        )}
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => setStats(j.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-white text-center py-20 text-2xl animate-pulse">⚽ Cargando...</div>
  if (!stats) return null

  const tasa = stats.solicitudes.total > 0
    ? ((stats.solicitudes.aceptadas / stats.solicitudes.total) * 100).toFixed(1)
    : '0'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard General</h1>
        <p className="text-gray-400 mt-1">Resumen de la plataforma Pichanga</p>
      </div>
      <NPCPanel />
      <PartidosPanel />

      {/* KPIs principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total usuarios', value: stats.usuarios.total, sub: `${stats.usuarios.jugadores} jugadores`, color: 'text-blue-400' },
          { label: 'Partidos abiertos', value: stats.partidos.abiertos, sub: `${stats.partidos.total} totales`, color: 'text-green-400' },
          { label: 'Comisiones cobradas', value: formatPrecio(stats.ingresos.comisiones), sub: `Vol. ${formatPrecio(stats.ingresos.volumen)}`, color: 'text-red-400' },
          { label: 'Usuarios baneados', value: stats.usuarios.baneados, sub: `${stats.strikes.total} strikes totales`, color: 'text-amber-400' },
        ].map(k => (
          <div key={k.label} className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{k.label}</p>
            <p className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</p>
            <p className="text-gray-500 text-xs mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Usuarios por tipo */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Usuarios por tipo</h3>
          <div className="space-y-3">
            {[
              { label: 'Jugadores', n: stats.usuarios.jugadores, color: 'bg-red-500', emoji: '👟' },
              { label: 'Organizadores', n: stats.usuarios.organizadores, color: 'bg-blue-500', emoji: '📋' },
              { label: 'Clubes', n: stats.usuarios.clubes, color: 'bg-green-500', emoji: '🏟️' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{item.emoji} {item.label}</span>
                  <span className="text-white font-semibold">{item.n}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${stats.usuarios.total > 0 ? (item.n / stats.usuarios.total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jugadores por posición */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Jugadores por posición</h3>
          <div className="space-y-2">
            {stats.jugadoresPorPosicion.map(p => (
              <div key={p.posicion} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{p.posicion}</span>
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 text-xs">★ {p._avg.rating?.toFixed(1) ?? '0.0'}</span>
                  <span className="text-gray-400 text-xs">{formatPrecio(p._avg.precio ?? 0)}</span>
                  <span className="text-white font-semibold bg-gray-700 px-2 py-0.5 rounded">{p._count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas de matchmaking */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Matchmaking</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">Tasa de aceptación</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-green-400">{tasa}%</span>
                <span className="text-gray-500 text-sm mb-0.5">{stats.solicitudes.aceptadas}/{stats.solicitudes.total}</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${tasa}%` }} />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Partidos completados</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-blue-400">{stats.partidos.completados}</span>
                <span className="text-gray-500 text-sm mb-0.5">de {stats.partidos.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top distritos */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Distritos con más partidos</h3>
          <div className="space-y-2">
            {stats.partidosPorDistrito.map((d, i) => (
              <div key={d.distrito} className="flex items-center gap-3 text-sm">
                <span className="text-gray-500 w-5 text-center">{i + 1}</span>
                <span className="text-gray-300 flex-1">{d.distrito}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 bg-red-500 rounded-full" style={{ width: `${(d._count / stats.partidosPorDistrito[0]._count) * 80}px` }} />
                  <span className="text-white font-semibold">{d._count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registros recientes */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Registros recientes</h3>
            <Link href="/admin/jugadores" className="text-red-400 text-xs hover:text-red-300">Ver todos →</Link>
          </div>
          <div className="space-y-3">
            {stats.registrosRecientes.map(u => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {u.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{u.nombre}</p>
                  <p className="text-gray-500 text-xs">{u.tipo}</p>
                </div>
                <p className="text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString('es-PE')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
