'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Partido, Solicitud } from '@/types'
import { getPosicion, formatPrecio, formatFecha, formatHora, POSICIONES, COMISION_PLATAFORMA } from '@/lib/constants'

interface PartidoDetalle extends Partido { solicitudes: Solicitud[] }

export default function PartidoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [partido, setPartido] = useState<PartidoDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [usuario, setUsuario] = useState<{ id: string; tipo: string } | null>(null)
  const [aplicarForm, setAplicarForm] = useState({ posicion: '', precio: '', mensaje: '' })
  const [aplicando, setAplicando] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('usuario')
    if (u) setUsuario(JSON.parse(u))
    fetch(`/api/partidos/${id}`)
      .then(r => r.json())
      .then(j => setPartido(j.data))
      .finally(() => setLoading(false))
  }, [id])

  async function handleAplicar(e: React.FormEvent) {
    e.preventDefault()
    setAplicando(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/partidos/${id}/solicitar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(aplicarForm)
      })
      const json = await res.json()
      if (!res.ok) { setMsg(json.error); return }
      setMsg('¡Solicitud enviada! El organizador revisará tu oferta.')
      setTimeout(() => window.location.reload(), 2000)
    } catch { setMsg('Error de conexión') }
    finally { setAplicando(false) }
  }

  async function handleSolicitud(solicitudId: string, status: 'ACEPTADO' | 'RECHAZADO') {
    const token = localStorage.getItem('token')
    await fetch(`/api/solicitudes/${solicitudId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    })
    window.location.reload()
  }

  if (loading) return <div className="text-center py-20 text-4xl animate-pulse">⚽</div>
  if (!partido) return <div className="text-center py-20 text-gray-500">Partido no encontrado</div>

  const posiciones = Array.isArray(partido.posiciones) ? partido.posiciones : []
  const esMio = usuario?.id === partido.organizadorId
  const esJugador = usuario?.tipo === 'JUGADOR'
  const yaAplicó = partido.solicitudes?.some(s => s.jugadorId === usuario?.id)
  const comision = aplicarForm.precio ? parseFloat(aplicarForm.precio) * COMISION_PLATAFORMA : 0
  const neto = aplicarForm.precio ? parseFloat(aplicarForm.precio) - comision : 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          <div className="card">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{partido.titulo}</h1>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${partido.status === 'ABIERTO' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {partido.status}
              </span>
            </div>
            {partido.club && <p className="text-sm text-red-500 font-medium mb-3">🏟️ {partido.club.nombre}</p>}
            {partido.descripcion && <p className="text-gray-600 text-sm mb-4">{partido.descripcion}</p>}

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2"><span>📅</span>{formatFecha(partido.fecha)}</div>
              <div className="flex items-center gap-2"><span>🕐</span>{formatHora(partido.fecha)} · {partido.duracion} min</div>
              <div className="flex items-center gap-2"><span>📍</span>{partido.distrito}</div>
              <div className="flex items-center gap-2"><span>⚽</span>{partido.modalidad.replace('VS', 'vs ')}</div>
              {partido.direccion && <div className="flex items-center gap-2 col-span-2"><span>🗺️</span>{partido.direccion}</div>}
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Posiciones necesarias</h2>
            <div className="flex flex-wrap gap-2">
              {posiciones.map((p: { posicion: string; cantidad: number }, i: number) => {
                const pos = getPosicion(p.posicion)
                return (
                  <span key={i} className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border ${pos?.bg} ${pos?.text} ${pos?.border}`}>
                    {pos?.emoji} {p.cantidad}× {pos?.label}
                  </span>
                )
              })}
            </div>
            {partido.presupuestoMax && (
              <p className="text-sm text-gray-500 mt-3">Presupuesto máximo: <strong className="text-gray-900">{formatPrecio(partido.presupuestoMax)}</strong> por jugador</p>
            )}
          </div>

          {/* Solicitudes (solo organizador) */}
          {esMio && partido.solicitudes && partido.solicitudes.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Solicitudes recibidas ({partido.solicitudes.length})</h2>
              <div className="space-y-4">
                {partido.solicitudes.map(s => (
                  <div key={s.id} className={`border rounded-xl p-4 ${s.status === 'ACEPTADO' ? 'border-green-200 bg-green-50' : s.status === 'RECHAZADO' ? 'border-red-100 bg-red-50/50' : 'border-gray-100'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{s.jugador?.nombre}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          {(() => { const pos = getPosicion(s.posicion); return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pos?.bg} ${pos?.text}`}>{pos?.emoji} {pos?.label}</span> })()}
                          <span className="font-bold text-gray-900">{formatPrecio(s.precio)}</span>
                        </div>
                        {s.mensaje && <p className="text-sm text-gray-500 mt-2 italic">"{s.mensaje}"</p>}
                      </div>
                      {s.status === 'PENDIENTE' && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => handleSolicitud(s.id, 'ACEPTADO')} className="bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 transition">Aceptar</button>
                          <button onClick={() => handleSolicitud(s.id, 'RECHAZADO')} className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition">Rechazar</button>
                        </div>
                      )}
                      {s.status !== 'PENDIENTE' && (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.status === 'ACEPTADO' ? 'bg-green-200 text-green-800' : 'bg-red-100 text-red-700'}`}>{s.status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Organizador</h3>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                {partido.organizador?.nombre?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-900">{partido.organizador?.nombre}</span>
            </div>
            {partido.organizador?.telefono && (
              <p className="text-sm text-gray-500 mt-2">📞 {partido.organizador.telefono}</p>
            )}
          </div>

          {/* Formulario de aplicación */}
          {esJugador && !esMio && partido.status === 'ABIERTO' && (
            <div className="card">
              {yaAplicó ? (
                <div className="text-center py-2">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="font-semibold text-gray-900">Ya aplicaste</p>
                  <p className="text-sm text-gray-500">Espera la respuesta del organizador</p>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-gray-900 mb-4">Aplicar al partido</h3>
                  {msg ? (
                    <p className="text-green-600 text-sm font-medium">{msg}</p>
                  ) : (
                    <form onSubmit={handleAplicar} className="space-y-3">
                      <div>
                        <label className="label">Posición</label>
                        <select className="input" value={aplicarForm.posicion} onChange={e => setAplicarForm(f => ({ ...f, posicion: e.target.value }))} required>
                          <option value="">Selecciona posición</option>
                          {POSICIONES.map(p => <option key={p.value} value={p.value}>{p.emoji} {p.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">Tu precio (S/)</label>
                        <input type="number" className="input" placeholder="50" min="1" value={aplicarForm.precio} onChange={e => setAplicarForm(f => ({ ...f, precio: e.target.value }))} required />
                        {aplicarForm.precio && (
                          <div className="mt-1.5 text-xs text-gray-400 space-y-0.5">
                            <p>Comisión plataforma (10%): <span className="text-red-500">-{formatPrecio(comision)}</span></p>
                            <p>Recibes: <span className="text-green-600 font-semibold">{formatPrecio(neto)}</span></p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="label">Mensaje (opcional)</label>
                        <textarea className="input" rows={2} placeholder="Preséntate brevemente..." value={aplicarForm.mensaje} onChange={e => setAplicarForm(f => ({ ...f, mensaje: e.target.value }))} />
                      </div>
                      <button type="submit" className="btn-primary w-full" disabled={aplicando}>
                        {aplicando ? 'Enviando...' : 'Enviar solicitud'}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          )}

          {!usuario && (
            <div className="card text-center">
              <p className="text-sm text-gray-600 mb-3">Inicia sesión como jugador para aplicar</p>
              <button onClick={() => router.push('/login')} className="btn-primary w-full">Ingresar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
