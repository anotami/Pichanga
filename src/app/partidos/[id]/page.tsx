'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Partido, Solicitud } from '@/types'
import { getPosicion, formatPrecio, formatFecha, formatHora, POSICIONES, COMISION_PLATAFORMA, PRECIO_DESTACADO } from '@/lib/constants'

interface Mensaje { id: string; texto: string; createdAt: string; autor: { id: string; nombre: string } }
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
  const [tab, setTab] = useState<'info' | 'chat' | 'solicitudes'>('info')
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [asistencias, setAsistencias] = useState<Record<string, boolean>>({})
  const [guardandoAsistencia, setGuardandoAsistencia] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  function recargar() {
    fetch(`/api/partidos/${id}`)
      .then(r => r.json())
      .then(j => setPartido(j.data))
  }

  useEffect(() => {
    const u = localStorage.getItem('usuario')
    if (u) setUsuario(JSON.parse(u))
    fetch(`/api/partidos/${id}`)
      .then(r => r.json())
      .then(j => setPartido(j.data))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (tab !== 'chat') return
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`/api/mensajes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => { if (j.data) setMensajes(j.data) })
  }, [tab, id])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [mensajes])

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
    recargar()
  }

  async function handleCompletar() {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/partidos/${id}/completar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    const json = await res.json()
    setMsg(json.data?.mensaje || json.error)
    recargar()
  }

  async function handleCancelar() {
    if (!confirm('¿Seguro que deseas cancelar este partido?')) return
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/partidos/${id}/cancelar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    const json = await res.json()
    setMsg(json.data?.mensaje || json.error)
    recargar()
  }

  async function handleDestacar() {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/alertas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ partidoId: id })
    })
    const json = await res.json()
    setMsg(json.data?.mensaje || json.error)
    if (res.ok) recargar()
  }

  async function handleEnviarMensaje(e: React.FormEvent) {
    e.preventDefault()
    if (!nuevoMensaje.trim()) return
    setEnviando(true)
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/mensajes/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ texto: nuevoMensaje.trim() })
    })
    const json = await res.json()
    if (res.ok) {
      setMensajes(prev => [...prev, json.data])
      setNuevoMensaje('')
    }
    setEnviando(false)
  }

  async function handleGuardarAsistencia() {
    setGuardandoAsistencia(true)
    const token = localStorage.getItem('token')
    const lista = Object.entries(asistencias).map(([solicitudId, asistio]) => ({ solicitudId, asistio }))
    await fetch(`/api/partidos/${id}/asistencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ asistencias: lista })
    })
    setGuardandoAsistencia(false)
    setMsg('Asistencia guardada')
    recargar()
  }

  if (loading) return <div className="text-center py-20 text-4xl animate-pulse">⚽</div>
  if (!partido) return <div className="text-center py-20 text-gray-500">Partido no encontrado</div>

  const posiciones = Array.isArray(partido.posiciones) ? partido.posiciones : []
  const esMio = usuario?.id === partido.organizadorId
  const esJugador = usuario?.tipo === 'JUGADOR'
  const yaAplicó = partido.solicitudes?.some(s => s.jugadorId === usuario?.id)
  const miSolicitud = partido.solicitudes?.find(s => s.jugadorId === usuario?.id)
  const comision = aplicarForm.precio ? parseFloat(aplicarForm.precio) * COMISION_PLATAFORMA : 0
  const neto = aplicarForm.precio ? parseFloat(aplicarForm.precio) - comision : 0
  const puedeChatear = esMio || (partido.solicitudes?.some(s => s.jugadorId === usuario?.id && s.status === 'ACEPTADO'))
  const aceptadas = partido.solicitudes?.filter(s => s.status === 'ACEPTADO') ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {msg && (
        <div className={`rounded-xl px-4 py-3 text-sm mb-4 ${msg.includes('Error') || msg.includes('error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          <div className="card">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {partido.destacado && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⭐ Destacado</span>}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${partido.status === 'ABIERTO' ? 'bg-green-100 text-green-700' : partido.status === 'CANCELADO' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                    {partido.status}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{partido.titulo}</h1>
              </div>
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

            {esMio && partido.status === 'ABIERTO' && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <button onClick={handleCompletar} className="bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 transition">
                  ✓ Marcar completado
                </button>
                {!partido.destacado && (
                  <button onClick={handleDestacar} className="bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-600 transition">
                    ⭐ Destacar ({formatPrecio(PRECIO_DESTACADO)})
                  </button>
                )}
                <button onClick={handleCancelar} className="bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-100 transition">
                  Cancelar partido
                </button>
              </div>
            )}
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

          {/* Tabs */}
          {(esMio || puedeChatear) && (
            <div>
              <div className="flex gap-2 mb-4">
                {(['info', esMio ? 'solicitudes' : null, puedeChatear ? 'chat' : null] as const).filter(Boolean).map(t => (
                  <button key={t!} onClick={() => setTab(t!)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {t === 'info' ? 'Detalles' : t === 'solicitudes' ? `Solicitudes (${partido.solicitudes?.length ?? 0})` : '💬 Chat'}
                  </button>
                ))}
              </div>

              {tab === 'solicitudes' && esMio && (
                <div className="space-y-3">
                  {partido.solicitudes && partido.solicitudes.length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-6">Aún no hay solicitudes</p>
                  )}
                  {partido.solicitudes?.map(s => (
                    <div key={s.id} className={`card ${s.status === 'ACEPTADO' ? 'border-green-200 bg-green-50' : s.status === 'RECHAZADO' ? 'border-red-100 bg-red-50/50' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{s.jugador?.nombre}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 flex-wrap">
                            {(() => { const pos = getPosicion(s.posicion); return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pos?.bg} ${pos?.text}`}>{pos?.emoji} {pos?.label}</span> })()}
                            <span className="font-bold text-gray-900">{formatPrecio(s.precio)}</span>
                            {s.asistio !== null && s.asistio !== undefined && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${s.asistio ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-600'}`}>
                                {s.asistio ? '✓ Asistió' : '✗ No-show'}
                              </span>
                            )}
                          </div>
                          {s.mensaje && <p className="text-sm text-gray-500 mt-2 italic">"{s.mensaje}"</p>}
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          {s.status === 'PENDIENTE' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleSolicitud(s.id, 'ACEPTADO')} className="bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 transition">Aceptar</button>
                              <button onClick={() => handleSolicitud(s.id, 'RECHAZADO')} className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-200 transition">Rechazar</button>
                            </div>
                          )}
                          {s.status !== 'PENDIENTE' && (
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.status === 'ACEPTADO' ? 'bg-green-200 text-green-800' : 'bg-red-100 text-red-700'}`}>{s.status}</span>
                          )}
                          {s.status === 'ACEPTADO' && (
                            <div className="flex gap-1">
                              <button onClick={() => setAsistencias(a => ({ ...a, [s.id]: true }))}
                                className={`text-xs px-2 py-1 rounded ${asistencias[s.id] === true ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>✓</button>
                              <button onClick={() => setAsistencias(a => ({ ...a, [s.id]: false }))}
                                className={`text-xs px-2 py-1 rounded ${asistencias[s.id] === false ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}>✗</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {aceptadas.length > 0 && Object.keys(asistencias).length > 0 && (
                    <button onClick={handleGuardarAsistencia} disabled={guardandoAsistencia}
                      className="btn-primary w-full" >
                      {guardandoAsistencia ? 'Guardando...' : 'Guardar asistencia'}
                    </button>
                  )}
                </div>
              )}

              {tab === 'chat' && puedeChatear && (
                <div className="card">
                  <div ref={chatRef} className="h-64 overflow-y-auto space-y-3 mb-4 pr-1">
                    {mensajes.length === 0 && (
                      <p className="text-gray-400 text-sm text-center pt-10">Sin mensajes aún. ¡Sé el primero!</p>
                    )}
                    {mensajes.map(m => {
                      const esMio = m.autor.id === usuario?.id
                      return (
                        <div key={m.id} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs rounded-2xl px-4 py-2.5 ${esMio ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                            {!esMio && <p className="text-xs font-semibold mb-0.5 opacity-70">{m.autor.nombre}</p>}
                            <p className="text-sm">{m.texto}</p>
                            <p className={`text-xs mt-1 ${esMio ? 'text-red-200' : 'text-gray-400'}`}>
                              {new Date(m.createdAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <form onSubmit={handleEnviarMensaje} className="flex gap-2">
                    <input
                      className="input flex-1"
                      placeholder="Escribe un mensaje..."
                      value={nuevoMensaje}
                      onChange={e => setNuevoMensaje(e.target.value)}
                      disabled={enviando}
                    />
                    <button type="submit" disabled={enviando || !nuevoMensaje.trim()}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-40">
                      Enviar
                    </button>
                  </form>
                </div>
              )}
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

          {/* Estado de mi solicitud */}
          {yaAplicó && miSolicitud && (
            <div className={`card ${miSolicitud.status === 'ACEPTADO' ? 'border-green-200 bg-green-50' : miSolicitud.status === 'RECHAZADO' ? 'border-red-100 bg-red-50' : ''}`}>
              <h3 className="font-semibold text-gray-900 mb-2">Mi solicitud</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${miSolicitud.status === 'ACEPTADO' ? 'bg-green-200 text-green-800' : miSolicitud.status === 'RECHAZADO' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {miSolicitud.status === 'ACEPTADO' ? '✓ Aceptado' : miSolicitud.status === 'RECHAZADO' ? '✗ Rechazado' : '⏳ Pendiente'}
                </span>
                <span className="text-gray-700 text-sm font-semibold">{formatPrecio(miSolicitud.precio)}</span>
              </div>
              {miSolicitud.status === 'ACEPTADO' && (
                <p className="text-green-600 text-xs mt-2">
                  Recibirás {formatPrecio(miSolicitud.precio * (1 - COMISION_PLATAFORMA))} al completarse el partido
                </p>
              )}
            </div>
          )}

          {/* Formulario de aplicación */}
          {esJugador && !esMio && partido.status === 'ABIERTO' && !yaAplicó && (
            <div className="card">
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
            </div>
          )}

          {!usuario && (
            <div className="card text-center">
              <p className="text-sm text-gray-600 mb-3">Inicia sesión como jugador para aplicar</p>
              <button onClick={() => router.push('/login')} className="btn-primary w-full">Ingresar</button>
            </div>
          )}

          {/* Calificar jugadores */}
          {esMio && partido.status === 'COMPLETADO' && aceptadas.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Calificar jugadores</h3>
              <div className="space-y-2">
                {aceptadas.map(s => (
                  <a key={s.id} href={`/jugadores/${s.jugadorId}`}
                    className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition">
                    <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs font-bold">
                      {s.jugador?.nombre?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">{s.jugador?.nombre}</span>
                    <span className="ml-auto text-xs text-red-500">Calificar →</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
