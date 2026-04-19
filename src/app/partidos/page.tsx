'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import MatchCard from '@/components/MatchCard'
import { Partido } from '@/types'
import { POSICIONES, DISTRITOS, MODALIDADES } from '@/lib/constants'

function PartidosContent() {
  const searchParams = useSearchParams()
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [loading, setLoading] = useState(true)
  const [posicion, setPosicion] = useState(searchParams.get('posicion') ?? '')
  const [distrito, setDistrito] = useState('')
  const [modalidad, setModalidad] = useState('')
  const [usuarioId, setUsuarioId] = useState<string | null>(null)

  useEffect(() => {
    const u = localStorage.getItem('usuario')
    if (u) setUsuarioId(JSON.parse(u).id)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ status: 'ABIERTO' })
    if (posicion) params.set('posicion', posicion)
    if (distrito) params.set('distrito', distrito)
    if (modalidad) params.set('modalidad', modalidad)
    fetch(`/api/partidos?${params}`)
      .then(r => r.json())
      .then(j => setPartidos(j.data ?? []))
      .finally(() => setLoading(false))
  }, [posicion, distrito, modalidad])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partidos buscando jugadores</h1>
          <p className="text-gray-500">Aplica, negocia tu precio y juega</p>
        </div>
        {usuarioId && (
          <Link href="/partidos/crear" className="btn-primary hidden sm:block">+ Publicar partido</Link>
        )}
      </div>

      <div className="card mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Posición buscada</label>
            <select className="input" value={posicion} onChange={e => setPosicion(e.target.value)}>
              <option value="">Todas las posiciones</option>
              {POSICIONES.map(p => <option key={p.value} value={p.value}>{p.emoji} {p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Distrito</label>
            <select className="input" value={distrito} onChange={e => setDistrito(e.target.value)}>
              <option value="">Todos los distritos</option>
              {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Modalidad</label>
            <select className="input" value={modalidad} onChange={e => setModalidad(e.target.value)}>
              <option value="">Todas las modalidades</option>
              {MODALIDADES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>
        {(posicion || distrito || modalidad) && (
          <button onClick={() => { setPosicion(''); setDistrito(''); setModalidad('') }}
            className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium">
            Limpiar filtros ×
          </button>
        )}
      </div>

      {usuarioId && (
        <div className="sm:hidden mb-4">
          <Link href="/partidos/crear" className="btn-primary w-full text-center block">+ Publicar partido</Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3 animate-pulse">⚽</div>
          <p>Buscando partidos...</p>
        </div>
      ) : partidos.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🥅</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay partidos disponibles</h3>
          <p className="text-gray-500 mb-4">Sé el primero en publicar un partido</p>
          {usuarioId && <Link href="/partidos/crear" className="btn-primary">Publicar partido</Link>}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{partidos.length} partido{partidos.length !== 1 ? 's' : ''} disponible{partidos.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {partidos.map(p => <MatchCard key={p.id} partido={p} />)}
          </div>
        </>
      )}
    </div>
  )
}

export default function PartidosPage() {
  return <Suspense><PartidosContent /></Suspense>
}
