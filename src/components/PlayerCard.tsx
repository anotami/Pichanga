import Link from 'next/link'
import { JugadorPerfil } from '@/types'
import { getPosicion, getNivel, formatPrecio, getRango } from '@/lib/constants'

interface Props { perfil: JugadorPerfil; showActions?: boolean }

export default function PlayerCard({ perfil, showActions = true }: Props) {
  const pos = getPosicion(perfil.posicion)
  const niv = getNivel((perfil as unknown as { nivel: string }).nivel ?? 'AMATEUR')
  const rango = getRango(perfil.puntos)
  const esBaneado = (perfil as unknown as { usuario?: { baneoHasta?: string } }).usuario?.baneoHasta
    && new Date((perfil as unknown as { usuario: { baneoHasta: string } }).usuario.baneoHasta) > new Date()

  if (esBaneado) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 pt-6 pb-4 text-center relative">
        {(perfil as unknown as { destacado?: boolean }).destacado && (
          <div className="absolute top-2 right-2 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">⭐ Destacado</div>
        )}
        <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center text-3xl mx-auto mb-3">
          {pos?.emoji ?? '⚽'}
        </div>
        <h3 className="font-bold text-gray-900 text-lg leading-tight">{perfil.usuario?.nombre ?? 'Jugador'}</h3>
        {perfil.verificado && (
          <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium mt-1">✓ Verificado</span>
        )}
      </div>

      <div className="px-6 py-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${pos?.bg} ${pos?.text} ${pos?.border}`}>
            {pos?.emoji} {pos?.label}
          </span>
          {niv && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {niv.emoji} {niv.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {perfil.distrito}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className={`w-4 h-4 ${i <= Math.round(perfil.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
            <span className="text-sm text-gray-500 ml-1">({perfil.totalResenas})</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rango.bg} ${rango.color}`}>{rango.nombre}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs text-gray-400">desde</span>
            <p className="text-lg font-bold text-red-600">{formatPrecio(perfil.precio)}</p>
          </div>
          {showActions && (
            <Link href={`/jugadores/${perfil.usuarioId}`}
              className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-700 transition">
              Ver perfil
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
