'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PlayerCard from '@/components/PlayerCard'
import { JugadorPerfil } from '@/types'
import { POSICIONES, DISTRITOS, NIVELES } from '@/lib/constants'

function JugadoresContent() {
  const searchParams = useSearchParams()
  const [jugadores, setJugadores] = useState<JugadorPerfil[]>([])
  const [loading, setLoading] = useState(true)
  const [posicion, setPosicion] = useState(searchParams.get('posicion') ?? '')
  const [distrito, setDistrito] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [nivel, setNivel] = useState(searchParams.get('nivel') ?? '')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (posicion) params.set('posicion', posicion)
    if (distrito) params.set('distrito', distrito)
    if (precioMax) params.set('precioMax', precioMax)
    if (nivel) params.set('nivel', nivel)
    if (busqueda) params.set('q', busqueda)
    fetch(`/api/jugadores?${params}`)
      .then(r => r.json())
      .then(j => setJugadores(j.data ?? []))
      .finally(() => setLoading(false))
  }, [posicion, distrito, precioMax, nivel, busqueda])

  const hayFiltros = posicion || distrito || precioMax || nivel || busqueda

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscar jugadores</h1>
        <p className="text-gray-500">Encuentra al jugador ideal para completar tu partido</p>
      </div>

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
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2 flex-wrap">
            {posicion && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">{POSICIONES.find(p=>p.value===posicion)?.label}</span>}
            {nivel && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{NIVELES.find(n=>n.value===nivel)?.label}</span>}
            {distrito && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{distrito}</span>}
          </div>
          {hayFiltros && (
            <button onClick={() => { setPosicion(''); setDistrito(''); setPrecioMax(''); setNivel(''); setBusqueda('') }}
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
      ) : jugadores.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">😕</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron jugadores</h3>
          <p className="text-gray-500">Prueba cambiando los filtros</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{jugadores.length} jugador{jugadores.length !== 1 ? 'es' : ''} encontrado{jugadores.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {jugadores.map(j => <PlayerCard key={j.id} perfil={j} />)}
          </div>
        </>
      )}
    </div>
  )
}

export default function JugadoresPage() {
  return <Suspense><JugadoresContent /></Suspense>
}
