'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Partido } from '@/types'
import { getPosicion, formatPrecio, formatFecha, formatHora } from '@/lib/constants'

interface Props { partido: Partido; showActions?: boolean }

const MODALIDAD_LABELS: Record<string, string> = { '5VS5': 'Fulbito 5vs5', '7VS7': 'Fútbol 7vs7', '11VS11': 'Fútbol 11vs11' }
const STATUS_STYLES: Record<string, string> = {
  ABIERTO: 'bg-green-100 text-green-700',
  EN_CURSO: 'bg-blue-100 text-blue-700',
  COMPLETADO: 'bg-gray-100 text-gray-600',
  CANCELADO: 'bg-red-100 text-red-600'
}
const STATUS_LABELS: Record<string, string> = { ABIERTO: 'Abierto', EN_CURSO: 'En curso', COMPLETADO: 'Completado', CANCELADO: 'Cancelado' }

export default function MatchCard({ partido, showActions = true }: Props) {
  const [verInscriptos, setVerInscriptos] = useState(false)
  const posiciones = Array.isArray(partido.posiciones) ? partido.posiciones : []
  const inscriptos = partido.solicitudes ?? []
  const totalCupos = posiciones.reduce((s, p) => s + p.cantidad, 0)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{partido.titulo}</h3>
            {partido.club && <p className="text-xs text-red-500 font-medium mt-0.5">{partido.club.nombre}</p>}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[partido.status] ?? 'bg-gray-100 text-gray-600'}`}>
            {STATUS_LABELS[partido.status] ?? partido.status}
          </span>
        </div>

        <div className="space-y-1.5 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatFecha(partido.fecha)} · {formatHora(partido.fecha)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>{partido.distrito}{partido.direccion ? ` · ${partido.direccion}` : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-red-400">⚽</span>
            <span>{MODALIDAD_LABELS[partido.modalidad] ?? partido.modalidad} · {partido.duracion} min</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {posiciones.map((p: { posicion: string; cantidad: number }, i: number) => {
            const pos = getPosicion(p.posicion)
            return (
              <span key={i} className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${pos?.bg} ${pos?.text} ${pos?.border}`}>
                {pos?.emoji} {p.cantidad}x {pos?.label}
              </span>
            )
          })}
        </div>

        {/* Jugadores inscriptos */}
        <div className="mb-3">
          <button
            onClick={e => { e.preventDefault(); setVerInscriptos(v => !v) }}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>
              {inscriptos.length === 0
                ? `Sin inscriptos · ${totalCupos} cupo${totalCupos !== 1 ? 's' : ''}`
                : `${inscriptos.length} de ${totalCupos} inscripto${inscriptos.length !== 1 ? 's' : ''}`}
            </span>
            <span className="text-gray-400">{verInscriptos ? '▲' : '▼'}</span>
          </button>

          {verInscriptos && (
            <div className="mt-2 pl-1 space-y-1.5">
              {inscriptos.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Aún no hay jugadores confirmados</p>
              ) : (
                inscriptos.map((s, i) => {
                  const pos = getPosicion(s.posicion)
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                      <span className={`px-1.5 py-0.5 rounded-full font-semibold ${pos?.bg ?? 'bg-gray-100'} ${pos?.text ?? 'text-gray-600'}`}>
                        {pos?.emoji} {pos?.label ?? s.posicion}
                      </span>
                      <span className="font-medium">{s.jugador?.nombre ?? 'Jugador'}</span>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div>
            {partido.presupuestoMax ? (
              <p className="text-sm font-semibold text-gray-700">Hasta {formatPrecio(partido.presupuestoMax)}</p>
            ) : (
              <p className="text-xs text-gray-400">Precio libre</p>
            )}
          </div>
          {showActions && (
            <Link href={`/partidos/${partido.id}`}
              className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-700 transition">
              Ver partido
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
