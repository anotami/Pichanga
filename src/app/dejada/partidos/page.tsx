'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Partido } from '@/types'
import { POSICIONES_PADEL, DISTRITOS, formatFecha, formatHora, formatPrecio } from '@/lib/constants'

function PartidosPadelContent() {
  const searchParams = useSearchParams()
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [loading, setLoading] = useState(true)
  const [posicion, setPosicion] = useState(searchParams.get('posicion') ?? '')
  const [distrito, setDistrito] = useState('')
  const [usuarioId, setUsuarioId] = useState<string | null>(null)

  useEffect(() => {
    const u = localStorage.getItem('usuario')
    if (u) setUsuarioId(JSON.parse(u).id)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ status: 'ABIERTO', deporte: 'PADEL' })
    if (posicion) params.set('posicion', posicion)
    if (distrito) params.set('distrito', distrito)
    fetch(`/api/partidos?${params}`)
      .then(r => r.json())
      .then(j => setPartidos(j.data ?? []))
      .finally(() => setLoading(false))
  }, [posicion, distrito])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-10 h-44 md:h-56">
        <Image
          src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1400&q=80"
          alt="Cancha de pádel"
          fill className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-between px-8">
          <div className="text-white">
            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">🏓 Encuentra tu partido</p>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Partidos de pádel</h1>
            <p className="text-gray-300 text-sm md:text-base">Aplica, negocia tu precio y juega</p>
          </div>
          {usuarioId && (
            <Link href="/dejada/partidos/crear" className="bg-green-600 text-white font-bold px-5 py-3 rounded-xl hover:bg-green-700 transition shadow-lg hidden sm:block whitespace-nowrap">
              + Publicar partido
            </Link>
          )}
        </div>
      </div>
      {usuarioId && (
        <div className="sm:hidden mb-4">
          <Link href="/dejada/partidos/crear" className="bg-green-700 text-white font-bold px-5 py-3 rounded-xl w-full text-center block">
            + Publicar partido
          </Link>
        </div>
      )}

      {/* Filtros */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Posición buscada</label>
            <select className="input" value={posicion} onChange={e => setPosicion(e.target.value)}>
              <option value="">Todas las posiciones</option>
              {POSICIONES_PADEL.map(p => <option key={p.value} value={p.value}>{p.emoji} {p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Distrito</label>
            <select className="input" value={distrito} onChange={e => setDistrito(e.target.value)}>
              <option value="">Todos los distritos</option>
              {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        {(posicion || distrito) && (
          <button onClick={() => { setPosicion(''); setDistrito('') }}
            className="mt-3 text-sm text-green-700 hover:text-green-800 font-medium">
            Limpiar filtros ×
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3 animate-pulse">🏓</div>
          <p>Buscando partidos...</p>
        </div>
      ) : partidos.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎾</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay partidos de pádel disponibles</h3>
          <p className="text-gray-500 mb-4">Sé el primero en publicar un partido</p>
          {usuarioId && (
            <Link href="/dejada/partidos/crear" className="inline-block bg-green-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-800 transition">
              Publicar partido
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{partidos.length} partido{partidos.length !== 1 ? 's' : ''} disponible{partidos.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {partidos.map(p => {
              const posiciones = Array.isArray(p.posiciones) ? p.posiciones : []
              return (
                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-bold text-gray-900 text-base leading-tight">{p.titulo}</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 bg-green-100 text-green-700">
                        Abierto
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-green-500">📅</span>
                        <span>{formatFecha(p.fecha)} · {formatHora(p.fecha)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-green-500">📍</span>
                        <span>{p.distrito}{p.direccion ? ` · ${p.direccion}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-green-500">🏓</span>
                        <span>Pádel 2vs2 · {p.duracion} min</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {posiciones.map((pos: { posicion: string; cantidad: number }, i: number) => {
                        const posData = POSICIONES_PADEL.find(pp => pp.value === pos.posicion)
                        return (
                          <span key={i} className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${posData?.bg ?? 'bg-gray-100'} ${posData?.text ?? 'text-gray-700'} ${posData?.border ?? 'border-gray-200'}`}>
                            {posData?.emoji} {pos.cantidad}x {posData?.label ?? pos.posicion}
                          </span>
                        )
                      })}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div>
                        {p.presupuestoMax ? (
                          <p className="text-sm font-semibold text-gray-700">Hasta {formatPrecio(p.presupuestoMax)}</p>
                        ) : (
                          <p className="text-xs text-gray-400">Precio libre</p>
                        )}
                      </div>
                      <Link href={`/partidos/${p.id}`}
                        className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-800 transition">
                        Ver partido
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default function PartidosPadelPage() {
  return <Suspense><PartidosPadelContent /></Suspense>
}
