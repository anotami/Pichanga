'use client'
import { getRango, getProgresoRango, getInsignias } from '@/lib/constants'

interface Props {
  puntos: number
  totalPartidos: number
  rating: number
  totalResenas: number
  verificado: boolean
  accentColor?: 'red' | 'green'
}

export default function GamificationCard({ puntos, totalPartidos, rating, totalResenas, verificado, accentColor = 'red' }: Props) {
  const rango = getRango(puntos)
  const progreso = getProgresoRango(puntos)
  const insignias = getInsignias({ totalPartidos, rating, totalResenas, verificado })
  const ganadasCount = insignias.filter(i => i.ganada).length

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Nivel & Logros</h3>
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${rango.bg} ${rango.color} ${rango.border}`}>
          {rango.icon} {rango.nombre}
        </span>
      </div>

      {/* Puntos + barra de progreso */}
      <div className="mb-5">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-2xl font-bold text-gray-900">{puntos.toLocaleString('es-PE')}</span>
          <span className="text-xs text-gray-400">puntos</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${rango.gradient} transition-all duration-700`}
            style={{ width: `${progreso.porcentaje}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-gray-400">
          <span>{rango.icon} {rango.nombre}</span>
          {progreso.siguiente ? (
            <span>Faltan {progreso.puntosNecesarios} pts → {progreso.siguiente.icon} {progreso.siguiente.nombre}</span>
          ) : (
            <span className="text-purple-600 font-semibold">Nivel máximo 👑</span>
          )}
        </div>
      </div>

      {/* Insignias */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Insignias</p>
          <span className={`text-xs font-bold ${accentColor === 'green' ? 'text-green-600' : 'text-red-600'}`}>{ganadasCount}/{insignias.length}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {insignias.map(ins => (
            <div
              key={ins.id}
              title={`${ins.nombre}: ${ins.descripcion}`}
              className={`flex flex-col items-center p-2 rounded-xl text-center transition-all ${
                ins.ganada
                  ? accentColor === 'green' ? 'bg-green-50 ring-1 ring-green-200' : 'bg-red-50 ring-1 ring-red-200'
                  : 'opacity-25 grayscale bg-gray-50'
              }`}
            >
              <span className="text-xl leading-none">{ins.emoji}</span>
              <span className={`text-[9px] font-medium mt-1 leading-tight ${ins.ganada ? 'text-gray-700' : 'text-gray-400'}`}>
                {ins.nombre}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
