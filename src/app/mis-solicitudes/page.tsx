'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrecio, formatFecha, getPosicion, COMISION_PLATAFORMA } from '@/lib/constants'

interface SolicitudFull {
  id: string; posicion: string; precio: number; mensaje?: string; status: string; asistio?: boolean; createdAt: string
  partido: { id: string; titulo: string; distrito: string; fecha: string; modalidad: string; status: string; organizador: { nombre: string } }
}

const STATUS_STYLE: Record<string, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  ACEPTADO: 'bg-green-100 text-green-700',
  RECHAZADO: 'bg-red-100 text-red-600',
  CANCELADO: 'bg-gray-100 text-gray-500',
}

export default function MisSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudFull[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('')
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/login'; return }
    fetch('/api/solicitudes', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => setSolicitudes(j.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function cancelarSolicitud(id: string) {
    setCancelLoading(true)
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/solicitudes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'CANCELADO' })
    })
    if (res.ok) {
      setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, status: 'CANCELADO' } : s))
    }
    setCancelConfirm(null)
    setCancelLoading(false)
  }

  const filtradas = filtro ? solicitudes.filter(s => s.status === filtro) : solicitudes
  const counts = {
    total: solicitudes.length,
    pendientes: solicitudes.filter(s => s.status === 'PENDIENTE').length,
    aceptadas: solicitudes.filter(s => s.status === 'ACEPTADO').length,
    rechazadas: solicitudes.filter(s => s.status === 'RECHAZADO').length,
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">¿Cancelar participación?</h2>
            <p className="text-sm text-gray-500 mb-2">Si el partido es en menos de 24 horas, perderás <strong>20 puntos</strong>.</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium">Volver</button>
              <button onClick={() => cancelarSolicitud(cancelConfirm)} disabled={cancelLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold disabled:opacity-50">
                {cancelLoading ? 'Cancelando...' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis solicitudes</h1>
        <p className="text-gray-500">Historial de todas tus postulaciones a partidos</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', n: counts.total, color: 'text-gray-900', filtro: '' },
          { label: 'Pendientes', n: counts.pendientes, color: 'text-amber-600', filtro: 'PENDIENTE' },
          { label: 'Aceptadas', n: counts.aceptadas, color: 'text-green-600', filtro: 'ACEPTADO' },
          { label: 'Rechazadas', n: counts.rechazadas, color: 'text-red-500', filtro: 'RECHAZADO' },
        ].map(s => (
          <button key={s.label} onClick={() => setFiltro(s.filtro)}
            className={`card text-center transition ${filtro === s.filtro ? 'ring-2 ring-red-500' : 'hover:shadow-md'}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.n}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse text-4xl">⚽</div>
      ) : filtradas.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin solicitudes</h3>
          <p className="text-gray-500 mb-4">Aplica a partidos para aparecer aquí</p>
          <Link href="/partidos" className="btn-primary">Ver partidos disponibles</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtradas.map(s => {
            const pos = getPosicion(s.posicion)
            const comision = s.precio * COMISION_PLATAFORMA
            const neto = s.precio - comision
            return (
              <div key={s.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pos?.bg} ${pos?.text}`}>
                        {pos?.emoji} {pos?.label}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[s.status]}`}>
                        {s.status}
                      </span>
                      {s.asistio === true && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">✓ Asistí</span>}
                      {s.asistio === false && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">✗ No-show</span>}
                    </div>
                    <Link href={`/partidos/${s.partido.id}`} className="font-semibold text-gray-900 hover:text-red-600 transition">
                      {s.partido.titulo}
                    </Link>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {s.partido.distrito} · {formatFecha(s.partido.fecha)} · {s.partido.organizador.nombre}
                    </p>
                    {s.mensaje && <p className="text-gray-400 text-xs mt-1 italic">"{s.mensaje}"</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900">{formatPrecio(s.precio)}</p>
                    {s.status === 'ACEPTADO' && (
                      <p className="text-green-600 text-xs">Recibes {formatPrecio(neto)}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">{new Date(s.createdAt).toLocaleDateString('es-PE')}</p>
                    {s.status === 'ACEPTADO' && new Date(s.partido.fecha) > new Date() && (
                      <button onClick={() => setCancelConfirm(s.id)}
                        className="mt-2 text-xs text-red-400 hover:text-red-600 underline">
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
