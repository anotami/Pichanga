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

export default function AdminDashboard() {
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
