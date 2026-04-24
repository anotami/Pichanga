'use client'
import { useState, useEffect } from 'react'
import { JugadorPerfil, Resena } from '@/types'
import { getPosicion, formatPrecio, formatFecha, DIAS_SEMANA } from '@/lib/constants'
import GamificationCard from '@/components/GamificationCard'
import FavoritoButton from '@/components/FavoritoButton'

interface PerfilConResenas extends JugadorPerfil { resenas: Resena[] }

export default function JugadorDetalleClient({ id }: { id: string }) {
  const [perfil, setPerfil] = useState<PerfilConResenas | null>(null)
  const [loading, setLoading] = useState(true)
  const [reseñaForm, setReseñaForm] = useState({ rating: 5, comentario: '' })
  const [enviandoResena, setEnviandoResena] = useState(false)
  const [msgResena, setMsgResena] = useState('')
  const [usuarioId, setUsuarioId] = useState<string | null>(null)

  useEffect(() => {
    const u = localStorage.getItem('usuario')
    if (u) setUsuarioId(JSON.parse(u).id)
    fetch(`/api/jugadores/${id}`)
      .then(r => r.json())
      .then(j => setPerfil(j.data))
      .finally(() => setLoading(false))
  }, [id])

  async function enviarResena(e: React.FormEvent) {
    e.preventDefault()
    setEnviandoResena(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ jugadorId: id, ...reseñaForm })
      })
      const json = await res.json()
      if (!res.ok) { setMsgResena(json.error); return }
      setMsgResena('¡Reseña enviada! El jugador ganó puntos.')
      setTimeout(() => window.location.reload(), 1500)
    } catch { setMsgResena('Error al enviar') }
    finally { setEnviandoResena(false) }
  }

  if (loading) return <div className="text-center py-20 text-4xl animate-pulse">⚽</div>
  if (!perfil) return <div className="text-center py-20 text-gray-500">Jugador no encontrado</div>

  const pos = getPosicion(perfil.posicion)
  const disponibilidad = Array.isArray(perfil.disponibilidad) ? perfil.disponibilidad : []

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-5">
          <div className="card text-center relative">
            <FavoritoButton perfilId={perfil.id} className="absolute top-4 right-4" />
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-4xl mx-auto mb-3">
              {pos?.emoji}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{perfil.usuario?.nombre}</h1>
            {perfil.verificado && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">✓ Verificado</span>
            )}
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full border ${pos?.bg} ${pos?.text} ${pos?.border}`}>
                {pos?.emoji} {pos?.label}
              </span>
            </div>
          </div>

          <GamificationCard
            puntos={perfil.puntos}
            totalPartidos={perfil.totalPartidos}
            rating={perfil.rating}
            totalResenas={perfil.totalResenas}
            verificado={perfil.verificado}
          />

          <div className="card space-y-3">
            <h3 className="font-semibold text-gray-900">Información</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600"><span>📍</span> {perfil.distrito}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><span>⚽</span> {perfil.totalPartidos} partidos jugados</div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📅</span> Desde {formatFecha(((perfil as unknown) as { createdAt: string }).createdAt ?? '')}
            </div>
            <hr className="border-gray-100" />
            <div>
              <p className="text-xs text-gray-400 mb-1">Precio por partido</p>
              <p className="text-2xl font-bold text-red-600">{formatPrecio(perfil.precio)}</p>
            </div>
            {(perfil.usuario as unknown as { telefono?: string })?.telefono && (
              <a
                href={`https://wa.me/51${((perfil.usuario as unknown as { telefono: string }).telefono).replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${perfil.usuario?.nombre}, vi tu perfil en Pichanga y me interesa contratarte`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.559 4.14 1.535 5.874L0 24l6.29-1.513A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.032-1.39l-.36-.214-3.733.898.933-3.641-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                Contactar por WhatsApp
              </a>
            )}
          </div>

          {disponibilidad.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Disponibilidad</h3>
              <div className="space-y-1.5">
                {DIAS_SEMANA.map(dia => {
                  const disp = disponibilidad.find((d: { dia: string }) => d.dia === dia)
                  return (
                    <div key={dia} className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${disp ? 'text-gray-900' : 'text-gray-300'}`}>{dia.slice(0, 3)}</span>
                      {disp ? <span className="text-green-600 text-xs">{disp.inicio}–{disp.fin}</span> : <span className="text-gray-200 text-xs">No disponible</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Main */}
        <div className="md:col-span-2 space-y-5">
          {perfil.descripcion && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">Sobre el jugador</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{perfil.descripcion}</p>
            </div>
          )}

          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{perfil.rating.toFixed(1)}</div>
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className={`w-5 h-5 ${i <= Math.round(perfil.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">{perfil.totalResenas} reseñas</div>
              </div>
            </div>
            <div className="space-y-3">
              {perfil.resenas?.length > 0 ? perfil.resenas.map(r => (
                <div key={r.id} className="border-t border-gray-50 pt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900">{r.autor?.nombre}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  {r.comentario && <p className="text-sm text-gray-500">{r.comentario}</p>}
                </div>
              )) : (
                <p className="text-sm text-gray-400">Aún no tiene reseñas</p>
              )}
            </div>
          </div>

          {usuarioId && usuarioId !== id && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Dejar una reseña</h3>
              {msgResena ? (
                <p className="text-green-600 font-medium">{msgResena}</p>
              ) : (
                <form onSubmit={enviarResena} className="space-y-3">
                  <div>
                    <label className="label">Calificación</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(i => (
                        <button key={i} type="button" onClick={() => setReseñaForm(f => ({ ...f, rating: i }))}>
                          <svg className={`w-8 h-8 transition ${i <= reseñaForm.rating ? 'text-amber-400' : 'text-gray-200'} hover:text-amber-300`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">Comentario (opcional)</label>
                    <textarea className="input" rows={3} placeholder="¿Cómo fue la experiencia?" value={reseñaForm.comentario} onChange={e => setReseñaForm(f => ({ ...f, comentario: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn-primary" disabled={enviandoResena}>
                    {enviandoResena ? 'Enviando...' : 'Enviar reseña'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
