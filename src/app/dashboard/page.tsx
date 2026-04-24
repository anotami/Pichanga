'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrecio, formatFecha, getPosicion, getRango } from '@/lib/constants'
import GamificationCard from '@/components/GamificationCard'

interface Solicitud {
  id: string
  status: string
  precio: number
  posicion: string
  puedeCalificar: boolean
  yaCalificado: boolean
  canceladoA?: string
  penalizado?: boolean
  partido: {
    id: string
    titulo: string
    fecha: string
    distrito: string
    organizadorId: string
    organizador: { id: string; nombre: string }
    posiciones: string[]
  }
}

interface DashboardData {
  tipo: string
  perfil?: { id: string; puntos: number; rating: number; posicion: string; distrito: string; precio: number; totalPartidos: number; totalResenas: number; verificado: boolean }
  stats: Record<string, number>
  solicitudes?: Solicitud[]
  transacciones?: Array<{ id: string; monto: number; neto: number; comision: number; status: string; createdAt: string }>
  resenas?: Array<{ id: string; rating: number; comentario?: string; autor: { nombre: string } }>
  partidos?: Array<{ id: string; titulo: string; status: string; fecha: string; distrito: string; _count: { solicitudes: number }; solicitudes: unknown[] }>
  referidos?: { lista: Array<{ id: string; nombre: string; createdAt: string }>; total: number; puntos: number; codigoReferido: string }
}

interface FavPerfil {
  id: string; usuarioId: string; posicion: string; precio: number; rating: number
  puntos: number; distrito: string; verificado: boolean
  usuario: { nombre: string }
}

interface RatingModal { solicitudId: string; partidoId: string; organizadorNombre: string }

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [favoritos, setFavoritos] = useState<FavPerfil[]>([])
  const [loading, setLoading] = useState(true)
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [ratingModal, setRatingModal] = useState<RatingModal | null>(null)
  const [ratingValue, setRatingValue] = useState(5)
  const [ratingComentario, setRatingComentario] = useState('')
  const [ratingLoading, setRatingLoading] = useState(false)
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [copiadoRef, setCopiadoRef] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('usuario')
    if (!token) { router.push('/login'); return }
    if (u) setNombreUsuario(JSON.parse(u).nombre)
    Promise.all([
      fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/favoritos', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([dashJ, favJ]) => {
      setData(dashJ.data)
      setFavoritos(favJ.data ?? [])
    }).finally(() => setLoading(false))
  }, [router])

  async function enviarCalificacion() {
    if (!ratingModal) return
    setRatingLoading(true)
    const token = localStorage.getItem('token')
    const res = await fetch('/api/resenas/organizador', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ partidoId: ratingModal.partidoId, rating: ratingValue, comentario: ratingComentario })
    })
    if (res.ok) {
      setData(prev => prev ? {
        ...prev,
        solicitudes: prev.solicitudes?.map(s =>
          s.partido.id === ratingModal.partidoId ? { ...s, yaCalificado: true, puedeCalificar: false } : s
        )
      } : prev)
      setRatingModal(null)
      setRatingValue(5)
      setRatingComentario('')
    }
    setRatingLoading(false)
  }

  async function cancelarSolicitud(solicitudId: string) {
    setCancelLoading(true)
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/solicitudes/${solicitudId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'CANCELADO' })
    })
    if (res.ok) {
      const j = await res.json()
      setData(prev => prev ? {
        ...prev,
        solicitudes: prev.solicitudes?.map(s =>
          s.id === solicitudId ? { ...s, status: 'CANCELADO', penalizado: j.penalizado } : s
        )
      } : prev)
    }
    setCancelConfirm(null)
    setCancelLoading(false)
  }

  if (loading) return <div className="text-center py-20 text-4xl animate-pulse">⚽</div>
  if (!data) return null

  const proximos = (data.solicitudes ?? []).filter(s =>
    s.status === 'ACEPTADO' && new Date(s.partido.fecha) > new Date()
  )
  const paraCaloficar = (data.solicitudes ?? []).filter(s => s.puedeCalificar)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Rating modal */}
      {ratingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Calificar organizador</h2>
            <p className="text-sm text-gray-500 mb-5">{ratingModal.organizadorNombre}</p>
            <div className="flex items-center justify-center gap-2 mb-5">
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setRatingValue(i)}
                  className={`text-3xl transition-transform hover:scale-110 ${i <= ratingValue ? 'text-amber-400' : 'text-gray-200'}`}>
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={ratingComentario}
              onChange={e => setRatingComentario(e.target.value)}
              placeholder="Comentario opcional..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setRatingModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium">Cancelar</button>
              <button onClick={enviarCalificacion} disabled={ratingLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold disabled:opacity-50">
                {ratingLoading ? 'Enviando...' : 'Enviar calificación'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirm modal */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">¿Cancelar participación?</h2>
            <p className="text-sm text-gray-500 mb-2">
              Si el partido es en menos de 24 horas, perderás <strong>20 puntos</strong> como penalidad.
            </p>
            <p className="text-xs text-gray-400 mb-5">Esta acción no se puede deshacer.</p>
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

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hola, {nombreUsuario.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 mt-1">Resumen de tu actividad en Pichanga</p>
        </div>
        <div className="flex gap-2">
          {data.tipo === 'JUGADOR' && (
            <Link href="/partidos" className="btn-secondary">Ver partidos disponibles</Link>
          )}
          {(data.tipo === 'ORGANIZADOR' || data.tipo === 'CLUB') && (
            <Link href="/partidos/crear" className="btn-primary">+ Publicar partido</Link>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {data.tipo === 'JUGADOR' ? (
          <>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600">{formatPrecio(data.stats.totalGanado)}</div>
              <div className="text-sm text-gray-500 mt-1">Total ganado</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-amber-500">{formatPrecio(data.stats.totalPendiente)}</div>
              <div className="text-sm text-gray-500 mt-1">Pendiente de cobro</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600">{data.stats.totalPartidos}</div>
              <div className="text-sm text-gray-500 mt-1">Partidos jugados</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-red-600">{data.stats.rating?.toFixed(1)}</div>
              <div className="text-sm text-gray-500 mt-1">Calificación promedio</div>
            </div>
          </>
        ) : (
          <>
            <div className="card text-center">
              <div className="text-3xl font-bold text-red-600">{data.stats.totalPartidos}</div>
              <div className="text-sm text-gray-500 mt-1">Partidos publicados</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600">{data.stats.partidosAbiertos}</div>
              <div className="text-sm text-gray-500 mt-1">Partidos abiertos</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-amber-500">{data.stats.solicitudesPendientes}</div>
              <div className="text-sm text-gray-500 mt-1">Solicitudes pendientes</div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: perfil + gamification + referidos */}
        {data.tipo === 'JUGADOR' && data.perfil && (
          <div className="space-y-5">
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Mi perfil</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
                  {getPosicion(data.perfil.posicion)?.emoji}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{getPosicion(data.perfil.posicion)?.label}</p>
                  <p className="text-sm text-gray-500">{data.perfil.distrito}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="font-bold text-gray-900">{data.perfil.rating.toFixed(1)}</div>
                  <div className="text-gray-400 text-xs">Rating</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="font-bold text-gray-900">{formatPrecio(data.perfil.precio)}</div>
                  <div className="text-gray-400 text-xs">Mi precio</div>
                </div>
              </div>
              <Link href="/mi-perfil" className="btn-secondary w-full text-center block text-sm py-2">Editar perfil</Link>
            </div>

            <GamificationCard
              puntos={data.perfil.puntos}
              totalPartidos={data.perfil.totalPartidos}
              rating={data.perfil.rating}
              totalResenas={data.perfil.totalResenas}
              verificado={data.perfil.verificado ?? false}
            />

            {/* Referidos mini card */}
            {data.referidos && (
              <div className="card border border-amber-100 bg-amber-50/30">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">🎁 Referidos</h2>
                  <Link href="/referidos" className="text-xs text-red-600 font-medium">Ver todo →</Link>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{data.referidos.total}</div>
                    <div className="text-xs text-gray-500">Referidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-500">{data.referidos.puntos}</div>
                    <div className="text-xs text-gray-500">Puntos</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex-1 font-mono text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 truncate text-gray-600">
                    {data.referidos.codigoReferido}
                  </span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(data.referidos!.codigoReferido); setCopiadoRef(true); setTimeout(() => setCopiadoRef(false), 1500) }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${copiadoRef ? 'bg-green-100 text-green-700' : 'bg-red-600 text-white'}`}
                  >
                    {copiadoRef ? '✓' : 'Copiar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Columna derecha: solicitudes + próximos + calificaciones pendientes */}
        {data.tipo === 'JUGADOR' && data.solicitudes && (
          <div className="lg:col-span-2 space-y-5">
            {/* Pendientes de calificación */}
            {paraCaloficar.length > 0 && (
              <div className="card border-l-4 border-amber-400">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block"></span>
                  Calificá al organizador
                </h2>
                <div className="space-y-2">
                  {paraCaloficar.map(s => (
                    <div key={s.id} className="flex items-center justify-between bg-amber-50 rounded-xl px-4 py-3">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{s.partido.titulo}</p>
                        <p className="text-xs text-gray-500">por {s.partido.organizador.nombre} · {formatFecha(s.partido.fecha)}</p>
                      </div>
                      <button
                        onClick={() => setRatingModal({ solicitudId: s.id, partidoId: s.partido.id, organizadorNombre: s.partido.organizador.nombre })}
                        className="px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition"
                      >
                        ★ Calificar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Próximos partidos aceptados */}
            {proximos.length > 0 && (
              <div className="card border-l-4 border-green-500">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
                  Próximos partidos confirmados
                </h2>
                <div className="space-y-2">
                  {proximos.map(s => {
                    const pos = getPosicion(s.posicion)
                    return (
                      <div key={s.id} className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{s.partido.titulo}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{s.partido.distrito} · {formatFecha(s.partido.fecha)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {pos && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pos.bg} ${pos.text}`}>{pos.emoji}</span>}
                          <span className="text-sm font-bold text-green-700">{formatPrecio(s.precio)}</span>
                          <button
                            onClick={() => setCancelConfirm(s.id)}
                            className="text-xs text-red-400 hover:text-red-600 underline transition"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Todas las solicitudes */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Mis solicitudes recientes</h2>
              {data.solicitudes.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">Aún no has aplicado a ningún partido</p>
                  <Link href="/partidos" className="btn-primary text-sm mt-3 inline-block">Buscar partidos</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.solicitudes.map(s => (
                    <div key={s.id} className="flex items-center justify-between border border-gray-50 rounded-xl p-3">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{s.partido.titulo}</p>
                        <p className="text-xs text-gray-400">{s.partido.distrito} · {formatFecha(s.partido.fecha)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {(() => { const pos = getPosicion(s.posicion); return pos ? <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pos.bg} ${pos.text}`}>{pos.label}</span> : null })()}
                          <span className="text-xs font-semibold text-gray-700">{formatPrecio(s.precio)}</span>
                          {s.penalizado && <span className="text-xs text-red-500 font-medium">-20 pts penalidad</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.status === 'ACEPTADO' ? 'bg-green-100 text-green-700' : s.status === 'RECHAZADO' ? 'bg-red-100 text-red-700' : s.status === 'CANCELADO' ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700'}`}>
                          {s.status}
                        </span>
                        {s.yaCalificado && <span className="text-xs text-gray-400">★ Calificado</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Partidos del organizador */}
        {(data.tipo === 'ORGANIZADOR' || data.tipo === 'CLUB') && data.partidos && (
          <div className="card lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Mis partidos</h2>
              <Link href="/partidos/crear" className="text-sm text-red-600 font-medium">+ Nuevo</Link>
            </div>
            {data.partidos.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400 text-sm mb-3">Aún no has publicado ningún partido</p>
                <Link href="/partidos/crear" className="btn-primary text-sm">Publicar primer partido</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.partidos.map(p => (
                  <Link key={p.id} href={`/partidos/${p.id}`}
                    className="border border-gray-100 rounded-xl p-4 hover:border-red-200 hover:bg-red-50/30 transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{p.titulo}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.distrito} · {formatFecha(p.fecha)}</p>
                        <p className="text-xs text-blue-600 font-medium mt-1">{p._count.solicitudes} solicitud{p._count.solicitudes !== 1 ? 'es' : ''}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === 'ABIERTO' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reseñas recientes */}
        {data.tipo === 'JUGADOR' && data.resenas && data.resenas.length > 0 && (
          <div className="card lg:col-span-3">
            <h2 className="font-semibold text-gray-900 mb-4">Últimas reseñas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.resenas.map(r => (
                <div key={r.id} className="border border-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} className={`w-4 h-4 ${i <= r.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  {r.comentario && <p className="text-sm text-gray-600 italic">"{r.comentario}"</p>}
                  <p className="text-xs text-gray-400 mt-1">— {r.autor.nombre}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mis favoritos */}
        {favoritos.length > 0 && (
          <div className="card lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Mis jugadores favoritos
              </h2>
              <Link href="/jugadores" className="text-sm text-red-600 font-medium">Ver más →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {favoritos.map(p => {
                const pos = getPosicion(p.posicion)
                const rango = getRango(p.puntos)
                return (
                  <Link key={p.id} href={`/jugadores/${p.usuarioId}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50/30 transition">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl flex-shrink-0">
                      {pos?.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{p.usuario.nombre}</p>
                      <p className="text-xs text-gray-500 truncate">{p.distrito}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-xs font-bold ${rango.color}`}>{rango.icon}</span>
                        <span className="text-xs text-amber-500">★ {p.rating.toFixed(1)}</span>
                        <span className="text-xs font-semibold text-red-600">{formatPrecio(p.precio)}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
