'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { DISTRITOS, formatPrecio } from '@/lib/constants'
import { JugadorPerfil } from '@/types'
import { POSICIONES_PADEL } from '@/lib/constants'

interface Cancha {
  id: string; nombre: string; deporte: string; distrito: string; direccion: string
  telefono?: string; precio?: number; superficie?: string; tamano?: string
  techada: boolean; iluminacion: boolean; vestuarios: boolean; estacionamiento: boolean
  disponible: boolean; descripcion?: string
}

function JugadoresCercaPadel({ distrito }: { distrito: string }) {
  const [jugadores, setJugadores] = useState<JugadorPerfil[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/jugadores?deporte=PADEL&distrito=${encodeURIComponent(distrito)}&limit=6`)
      .then(r => r.json())
      .then(j => setJugadores(j.data ?? []))
      .finally(() => setLoading(false))
  }, [distrito])

  if (loading) return <p className="text-gray-400 text-xs animate-pulse">Buscando jugadores...</p>
  if (!jugadores.length) return <p className="text-gray-400 text-xs">Sin jugadores de pádel en este distrito</p>

  return (
    <div className="space-y-2">
      {jugadores.map(j => {
        const pos = POSICIONES_PADEL.find(p => p.value === j.posicion)
        return (
          <Link key={j.id} href={`/jugadores/${j.usuarioId}`}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">
              {(j.usuario?.nombre ?? 'J').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{j.usuario?.nombre}</p>
              <p className="text-xs text-gray-500">{pos?.emoji} {pos?.label} · ★{j.rating.toFixed(1)}</p>
            </div>
            <span className="text-xs font-semibold text-green-700">{formatPrecio(j.precio)}</span>
          </Link>
        )
      })}
    </div>
  )
}

function CanchaPadelCard({ cancha }: { cancha: Cancha }) {
  const [verJugadores, setVerJugadores] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{cancha.nombre}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{cancha.distrito}</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 flex-shrink-0">Indoor</span>
        </div>

        <div className="space-y-1.5 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1.5"><span>📍</span><span>{cancha.direccion}</span></div>
          {cancha.precio && <div className="flex items-center gap-1.5"><span>💵</span><span>{formatPrecio(cancha.precio)}/hora por pareja</span></div>}
          {cancha.telefono && <div className="flex items-center gap-1.5"><span>📞</span><span>{cancha.telefono}</span></div>}
        </div>

        {cancha.descripcion && <p className="text-xs text-gray-500 mb-3 italic">{cancha.descripcion}</p>}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {cancha.techada     && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">🏠 Techada</span>}
          {cancha.iluminacion  && <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full">💡 Iluminación</span>}
          {cancha.vestuarios   && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">🚿 Vestuarios</span>}
          {cancha.estacionamiento && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">🅿️ Estacionamiento</span>}
        </div>

        <button
          onClick={() => setVerJugadores(v => !v)}
          className="w-full flex items-center justify-between text-xs font-medium text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded-xl px-3 py-2 transition"
        >
          <span>🏓 Ver jugadores de pádel en {cancha.distrito}</span>
          <span>{verJugadores ? '▲' : '▼'}</span>
        </button>

        {verJugadores && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <JugadoresCercaPadel distrito={cancha.distrito} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function CanchasPadelPage() {
  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [loading, setLoading] = useState(true)
  const [distrito, setDistrito] = useState('')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ deporte: 'PADEL' })
    if (distrito) params.set('distrito', distrito)
    fetch(`/api/canchas?${params}`)
      .then(r => r.json())
      .then(j => setCanchas(j.data ?? []))
      .finally(() => setLoading(false))
  }, [distrito])

  const filtradas = canchas.filter(c =>
    !busqueda || c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || c.direccion.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="relative rounded-2xl overflow-hidden mb-10 h-44 md:h-56">
        <Image src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1400&q=80"
          alt="Canchas de pádel Lima" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/60 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div className="text-white">
            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">🏓 DejadaPeru</p>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Canchas de pádel</h1>
            <p className="text-gray-300 text-sm">Encuentra tu cancha y los jugadores cerca</p>
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Buscar</label>
            <input className="input" placeholder="Nombre o dirección..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          </div>
          <div>
            <label className="label">Distrito</label>
            <select className="input" value={distrito} onChange={e => setDistrito(e.target.value)}>
              <option value="">Todos</option>
              {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        {(distrito || busqueda) && (
          <button onClick={() => { setDistrito(''); setBusqueda('') }}
            className="mt-3 text-sm text-green-700 hover:text-green-800 font-medium">Limpiar filtros ×</button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400"><div className="text-4xl mb-3 animate-pulse">🏓</div><p>Buscando canchas...</p></div>
      ) : filtradas.length === 0 ? (
        <div className="text-center py-20"><div className="text-5xl mb-4">🎾</div><h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron canchas</h3></div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtradas.length} cancha{filtradas.length !== 1 ? 's' : ''} encontrada{filtradas.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtradas.map(c => <CanchaPadelCard key={c.id} cancha={c} />)}
          </div>
        </>
      )}
    </div>
  )
}
