'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { JugadorPerfil } from '@/types'
import { POSICIONES_PADEL, NIVELES_PADEL, DISTRITOS, getRango, getProgresoRango, formatPrecio } from '@/lib/constants'

const MEDALLAS = ['🥇', '🥈', '🥉']

function Top20Padel() {
  const [top, setTop] = useState<JugadorPerfil[]>([])
  const [loading, setLoading] = useState(true)
  const [abierto, setAbierto] = useState(true)

  useEffect(() => {
    fetch('/api/jugadores?deporte=PADEL&limit=20')
      .then(r => r.json())
      .then(j => setTop(j.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
      <button
        onClick={() => setAbierto(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <span className="font-bold text-gray-900">Top 20 · Pádel</span>
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Ranking global</span>
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
                  const pos = POSICIONES_PADEL.find(p => p.value === j.posicion)
                  return (
                    <tr key={j.id} className={`hover:bg-gray-50 transition ${i < 3 ? 'bg-amber-50/40' : ''}`}>
                      <td className="px-4 py-3 text-center font-bold text-gray-500">
                        {i < 3 ? MEDALLAS[i] : <span className="text-gray-400">{i + 1}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
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
                      <td className="px-4 py-3 text-center font-semibold text-green-700">{j.puntos}</td>
                      <td className="px-4 py-3 text-center text-gray-500 hidden lg:table-cell">{formatPrecio(j.precio)}</td>
                      <td className="px-4 py-3 text-center">
                        <Link href={`/jugadores/${j.usuarioId}`} className="text-green-600 hover:text-green-800 text-xs font-medium">
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

function JugadoresPadelContent() {
  const searchParams = useSearchParams()
  const [jugadores, setJugadores] = useState<JugadorPerfil[]>([])
  const [loading, setLoading] = useState(true)
  const [posicion, setPosicion] = useState(searchParams.get('posicion') ?? '')
  const [distrito, setDistrito] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [nivel, setNivel] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [soloVerificados, setSoloVerificados] = useState(false)
  const [orden, setOrden] = useState('rating')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ deporte: 'PADEL' })
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
          src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1400&q=80"
          alt="Jugadores de pádel"
          fill className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/60 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div className="text-white">
            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">🏓 DejadaPeru</p>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Buscar jugadores de pádel</h1>
            <p className="text-gray-300 text-sm md:text-base">Encuentra tu compañero de derecha o revés</p>
          </div>
        </div>
      </div>

      <Top20Padel />

      {/* Filtros */}
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
              {POSICIONES_PADEL.map(p => <option key={p.value} value={p.value}>{p.emoji} {p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Nivel</label>
            <select className="input" value={nivel} onChange={e => setNivel(e.target.value)}>
              <option value="">Todos los niveles</option>
              {NIVELES_PADEL.map(n => <option key={n.value} value={n.value}>{n.emoji} {n.label}</option>)}
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
              <input type="checkbox" checked={soloVerificados} onChange={e => setSoloVerificados(e.target.checked)} className="rounded text-green-600" />
              Solo jugadores verificados ✓
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2 flex-wrap">
            {posicion && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{POSICIONES_PADEL.find(p=>p.value===posicion)?.label}</span>}
            {nivel && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{NIVELES_PADEL.find(n=>n.value===nivel)?.label}</span>}
            {distrito && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{distrito}</span>}
            {precioMax && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Hasta S/{precioMax}</span>}
            {soloVerificados && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Verificados</span>}
          </div>
          {hayFiltros && (
            <button onClick={() => { setPosicion(''); setDistrito(''); setPrecioMax(''); setNivel(''); setBusqueda(''); setSoloVerificados(false) }}
              className="text-sm text-green-700 hover:text-green-800 font-medium">
              Limpiar filtros ×
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3 animate-pulse">🏓</div>
          <p>Buscando jugadores...</p>
        </div>
      ) : ordenados.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎾</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron jugadores de pádel</h3>
          <p className="text-gray-500 mb-4">Sé el primero en registrarte como jugador de pádel</p>
          <Link href="/registro?tipo=JUGADOR" className="inline-block bg-green-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-800 transition">
            Registrarse →
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{ordenados.length} jugador{ordenados.length !== 1 ? 'es' : ''} encontrado{ordenados.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {ordenados.map(j => {
              const pos = POSICIONES_PADEL.find(p => p.value === j.posicion)
              const niv = NIVELES_PADEL.find(n => n.value === (j as unknown as { nivel: string }).nivel)
              const rango = getRango(j.puntos)
              const progreso = getProgresoRango(j.puntos)
              return (
                <div key={j.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 px-6 pt-6 pb-4 text-center relative">
                    <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center text-3xl mx-auto mb-3">
                      {pos?.emoji ?? '🏓'}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{j.usuario?.nombre ?? 'Jugador'}</h3>
                    {j.verificado && <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium mt-1">✓ Verificado</span>}
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      {pos && (
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${pos.bg} ${pos.text} ${pos.border}`}>
                          {pos.emoji} {pos.label}
                        </span>
                      )}
                      {niv && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">{niv.emoji} {niv.label}</span>}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <span className="text-green-500">📍</span>{j.distrito}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(i => (
                          <svg key={i} className={`w-4 h-4 ${i <= Math.round(j.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                        <span className="text-sm text-gray-500 ml-1">({j.totalResenas})</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${rango.bg} ${rango.color} ${rango.border}`}>
                        {rango.icon} {rango.nombre}
                      </span>
                    </div>
                    {/* Mini barra de progreso */}
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${rango.gradient}`} style={{ width: `${progreso.porcentaje}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 text-right">{j.puntos} pts</p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-xs text-gray-400">desde</span>
                        <p className="text-lg font-bold text-green-700">{formatPrecio(j.precio)}</p>
                      </div>
                      <Link href={`/jugadores/${j.usuarioId}`}
                        className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-800 transition">
                        Ver perfil
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

export default function JugadoresPadelPage() {
  return <Suspense><JugadoresPadelContent /></Suspense>
}
