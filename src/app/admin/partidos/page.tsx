'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatFecha, formatPrecio } from '@/lib/constants'

interface PartidoAdmin {
  id: string; titulo: string; distrito: string; modalidad: string; nivelRequerido: string
  status: string; fecha: string; destacado: boolean; presupuestoMax?: number
  organizador: { nombre: string; tipo: string }
  club?: { nombre: string }
  _count: { solicitudes: number }
}

const STATUS_COLORS: Record<string, string> = {
  ABIERTO: 'bg-green-900 text-green-300',
  EN_CURSO: 'bg-blue-900 text-blue-300',
  COMPLETADO: 'bg-gray-700 text-gray-300',
  CANCELADO: 'bg-red-900 text-red-300',
}

export default function AdminPartidosPage() {
  const [partidos, setPartidos] = useState<PartidoAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const params = new URLSearchParams()
    if (filtroStatus) params.set('status', filtroStatus)
    fetch(`/api/admin/partidos?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => setPartidos(j.data ?? []))
      .finally(() => setLoading(false))
  }, [filtroStatus])

  const stats = {
    total: partidos.length,
    abiertos: partidos.filter(p => p.status === 'ABIERTO').length,
    completados: partidos.filter(p => p.status === 'COMPLETADO').length,
    destacados: partidos.filter(p => p.destacado).length,
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Partidos</h1>
        <p className="text-gray-400 mt-1">Gestión de todos los partidos</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', n: stats.total, color: 'text-white' },
          { label: 'Abiertos', n: stats.abiertos, color: 'text-green-400' },
          { label: 'Completados', n: stats.completados, color: 'text-blue-400' },
          { label: 'Destacados', n: stats.destacados, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.n}</p>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm">
          <option value="">Todos los estados</option>
          <option value="ABIERTO">Abierto</option>
          <option value="COMPLETADO">Completado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400 animate-pulse">Cargando...</div>
      ) : (
        <div className="space-y-2">
          {partidos.map(p => (
            <div key={p.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-medium">{p.titulo}</span>
                    {p.destacado && <span className="text-xs bg-amber-900 text-amber-300 px-2 py-0.5 rounded-full">⭐ Destacado</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status] ?? 'bg-gray-700 text-gray-300'}`}>{p.status}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {p.distrito} · {p.modalidad} · {p.nivelRequerido} · {formatFecha(p.fecha)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Por: {p.organizador.nombre} ({p.organizador.tipo})
                    {p.club && ` · Club: ${p.club.nombre}`}
                    {p.presupuestoMax && ` · Hasta ${formatPrecio(p.presupuestoMax)}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div className="text-center">
                    <p className="text-white font-bold">{p._count.solicitudes}</p>
                    <p className="text-gray-500 text-xs">solicitudes</p>
                  </div>
                  <Link href={`/partidos/${p.id}`} target="_blank"
                    className="text-xs bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-600 transition">
                    Ver →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
