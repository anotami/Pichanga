'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PlayerCard from '@/components/PlayerCard'
import { JugadorPerfil } from '@/types'
import { POSICIONES, DISTRITOS, NIVELES, getPosicion, formatPrecio } from '@/lib/constants'

const MEDALLAS = ['🥇', '🥈', '🥉']

function Top20({ deporte }: { deporte: string }) {
  const [top, setTop] = useState<JugadorPerfil[]>([])
  const [loading, setLoading] = useState(true)
  const [abierto, setAbierto] = useState(true)

  useEffect(() => {
    fetch(`/api/jugadores?deporte=${deporte}&limit=20`)
      .then(r => r.json())
      .then(j => setTop(j.data ?? []))
      .finally(() => setLoading(false))
  }, [deporte])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
      <button
        onClick={() => setAbierto(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <span className="font-bold text-gray-900">Top 20 · Fútbol</span>
          <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">Ranking global</span>
        </div>
        <span className="text-gray-400 text-sm">{abierto ? '▲ ocultar' : '▼ ver ranking'}</span>
      </button>

      {abierto && (
        loading ? (
          <div className="px-6 pb-6 text-center text-gray-400 text-sm py-8 animate-pulse">Cargando ranking...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-t border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 text-gray-500 font-semibold w-10">#</th>
                  <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Jugador</th>
                  <th className="text-left px-4 py-2.5 text-gray-500 font-semibold hidden sm:table-cell">Posición</th>
                  <th className="text-left px-4 py-2.5 text-gray-500 font-semibold hidden md:table-cell">Distrito</th>
                  <th className="text-center px-4 py-2.5 text-gray-500 font-semibold">Rating</th>
                  <th className="text-center px-4 py-2.5 text-gray-500 font-semibold hidden sm:table-cell">Partidos</th>
                  <th className="text-center px-4 py-2.5 text-gray-500 font-semibold">Puntos</th>
                  <th className="text-center px-4 py-2.5 text-gray-500 font-semibold hidden lg:table-cell">Precio</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {top.map((j, i) => {
                  const pos = getPosicion(j.posicion)
                  return (
                    <tr key={j.id} className={`hover:bg-gray-50 transition ${i < 3 ? 'bg-amber-50/40' : ''}`}>
                      <td className="px-4 py-3 text-center font-bold text-gray-500">
                        {i < 3 ? MEDALLAS[i] : <span className="text-gray-400">{i + 1}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-sm flex-shrink-0">
                            {(j.usuario?.nombre ?? 'J').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">{j.usuario?.nombre ?? 'Jugador'}</p>
                            {j.verificado && <span className="text-xs text-blue-500">✓ Verificado</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {pos && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pos.bg} ${pos.text}`}>
                            {pos.emoji} {pos.label}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{j.distrito}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-amber-500">★ {j.rating.toFixed(1)}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 hidden sm:table-cell">{j.totalPartidos}</td>
                      <td className="px-4 py-3 text-center font-semibold text-red-600">{j.puntos}</td>
                      <td className="px-4 py-3 text-center text-gray-500 hidden lg:table-cell">{formatPrecio(j.precio)}</td>
                      <td className="px-4 py-3 text-center">
                        <Link href={`/jugadores/${j.usuarioId}`} className="text-red-500 hover:text-red-700 text-xs font-medium">
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}

function JugadoresContent() {
  const searchParams = useSearchParams()
  const [jugadores, setJugadores] = useState<JugadorPerfil[]>([])
  const [loading, setLoading] = useState(true)
  const [posicion, setPosicion] = useState(searchParams.get('posicion') ?? '')
  const [distrito, setDistrito] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [nivel, setNivel] = useState(searchParams.get('nivel') ?? '')
  const [busqueda, setBusqueda] = useState('')
  const [soloVerificados, setSoloVerificados] = useState(false)
  const [orden, setOrden] = useState('rating')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ deporte: 'FUTBOL' })
    if (posicion) params.set('posicion', posicion)
    if (distrito) params.set('distrito', distrito)
    if (precioMax) params.set('precioMax', precioMax)
    if (nivel) params.set('nivel', nivel)
    if (busqueda) params.set('q', busqueda)
    if (soloVerificados) params.set('verificado', 'true')
    fetch(`/api/jugadores?${params}`)
      .then(r => r.json())
      .then(j => setJugadores(j.data ?? []))
      .finally(() => setLoading(false))
  }, [posicion, distrito, precioMax, nivel, busqueda, soloVerificados])

  const ordenados = [...jugadores].sort((a, b) => {
    if (orden === 'rating') return (b.rating ?? 0) - (a.rating ?? 0)
    if (orden === 'precio_asc') return (a.precio ?? 0) - (b.precio ?? 0)
    if (orden === 'precio_desc') return (b.precio ?? 0) - (a.precio ?? 0)
    if (orden === 'puntos') return (b.puntos ?? 0) - (a.puntos ?? 0)
    return 0
  })

  const hayFiltros = posicion || distrito || precioMax || nivel || busqueda || soloVerificados

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-10 h-44 md:h-56">
        <Image
          src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=1400&q=80"
          alt="Jugadores de fútbol"
          fill className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/60 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div className="text-white">
            <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">🇵🇪 Pichanga Peru</p>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Buscar jugadores</h1>
            <p className="text-gray-300 text-sm md:text-base">Encuentra al jugador ideal para completar tu partido</p>
          </div>
        </div>
      </div>

      <Top20 deporte="FUTBOL" />

      <div className="card mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="label">Buscar por nombre</label>
            <input className="input" placeholder="Nombre del jugador..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          </div>
          <div>
            <label className="label">Posición</label>
            <select className="input" value={posicion} onChange={e => setPosicion(e.target.value)}>
              <option value="">Todas</option>
              {POSICIONES.map(p => <option key={p.value} value={p.value}>{p.emoji} {p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Nivel</label>
            <select className="input" value={nivel} onChange={e => setNivel(e.target.value)}>
              <option value="">Todos los niveles</option>
              {NIVELES.map(n => <option key={n.value} value={n.value}>{n.emoji} {n.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Distrito</label>
            <select className="input" value={distrito} onChange={e => setDistrito(e.target.value)}>
              <option value="">Todos</option>
              {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="label">Precio máximo (S/)</label>
            <input type="number" className="input" placeholder="Sin límite" min="0" value={precioMax} onChange={e => setPrecioMax(e.target.value)} />
          </div>
          <div>
            <label className="label">Ordenar por</label>
            <select className="input" value={orden} onChange={e => setOrden(e.target.value)}>
              <option value="rating">Mayor rating</option>
              <option value="puntos">Más puntos</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
            </select>
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-gray-600 text-sm cursor-pointer">
              <input type="checkbox" checked={soloVerificados} onChange={e => setSoloVerificados(e.target.checked)}
                className="rounded text-red-600" />
              Solo jugadores verificados ✓
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2 flex-wrap">
            {posicion && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">{POSICIONES.find(p=>p.value===posicion)?.label}</span>}
            {nivel && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{NIVELES.find(n=>n.value===nivel)?.label}</span>}
            {distrito && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{distrito}</span>}
            {precioMax && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Hasta S/{precioMax}</span>}
            {soloVerificados && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">✓ Verificados</span>}
          </div>
          {hayFiltros && (
            <button onClick={() => { setPosicion(''); setDistrito(''); setPrecioMax(''); setNivel(''); setBusqueda(''); setSoloVerificados(false) }}
              className="text-sm text-red-600 hover:text-red-700 font-medium">
              Limpiar filtros ×
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3 animate-pulse">⚽</div>
          <p>Buscando jugadores...</p>
        </div>
      ) : ordenados.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">😕</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron jugadores</h3>
          <p className="text-gray-500">Prueba cambiando los filtros</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{ordenados.length} jugador{ordenados.length !== 1 ? 'es' : ''} encontrado{ordenados.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {ordenados.map(j => <PlayerCard key={j.id} perfil={j} />)}
          </div>
        </>
      )}
    </div>
  )
}

export default function JugadoresPage() {
  return <Suspense><JugadoresContent /></Suspense>
}
