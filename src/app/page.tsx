import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Pichanga – Encontrá jugadores para tu partido en Perú',
  description: 'La plataforma de fútbol y pádel de Perú. Completá tu equipo con jugadores verificados en tu distrito. Arqueros, defensas, mediocampistas y más.',
}

export default async function PortadaPage() {
  const [totalJugadores, partidosAbiertos, totalCanchas] = await Promise.all([
    prisma.jugadorPerfil.count(),
    prisma.partido.count({ where: { status: 'ABIERTO' } }),
    prisma.cancha.count({ where: { disponible: true } }),
  ])

  const pasos = [
    { n: '1', titulo: 'Publicá tu partido', desc: 'Indicá las posiciones que necesitás, cuándo jugás y cuánto pagás. Tarda menos de 2 minutos.', emoji: '📋' },
    { n: '2', titulo: 'Recibí solicitudes', desc: 'Jugadores disponibles en tu distrito se postulan automáticamente. Ves su rating, partidos y precio.', emoji: '📩' },
    { n: '3', titulo: 'Elegí y jugá', desc: 'Aceptás al mejor candidato, coordinan por chat y a la cancha. Así de fácil.', emoji: '⚽' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ef4444 0%, transparent 50%), radial-gradient(circle at 80% 20%, #22c55e 0%, transparent 40%)' }} />
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
            Plataforma activa en Lima, Perú
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight tracking-tight">
            Encontrá el jugador<br className="hidden md:block" /> que necesitás <span className="text-red-400">hoy</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Fútbol y pádel en Lima. Miles de jugadores disponibles por partido, sin contratos ni complicaciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/jugadores" className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition shadow-lg shadow-red-900/40">
              ⚽ Ver jugadores de fútbol
            </Link>
            <Link href="/dejada/jugadores" className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition shadow-lg shadow-green-900/40">
              🏓 Ver jugadores de pádel
            </Link>
          </div>

          {/* Stats en vivo */}
          <div className="flex flex-wrap justify-center gap-6 text-center">
            {[
              { valor: `${totalJugadores.toLocaleString('es-PE')}+`, label: 'Jugadores registrados', emoji: '👟' },
              { valor: String(partidosAbiertos), label: 'Partidos abiertos ahora', emoji: '🏟️' },
              { valor: `${totalCanchas}+`, label: 'Canchas afiliadas', emoji: '📍' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 border border-white/10 rounded-2xl px-6 py-3 min-w-[130px]">
                <p className="text-2xl font-extrabold text-white">{s.valor}</p>
                <p className="text-gray-400 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sport selector */}
      <section className="flex flex-col md:flex-row" style={{ minHeight: '60vh' }}>
        <Link href="/pichanga" className="group relative flex-1 min-h-[40vh] flex items-center justify-center overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1400&q=80"
            alt="Cancha de fútbol" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/80 via-red-800/75 to-red-950/85 group-hover:from-red-900/70 transition-colors duration-300" />
          <div className="relative z-10 text-white text-center px-8 py-10">
            <div className="text-6xl mb-3 drop-shadow-lg">⚽</div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">Pichanga</h2>
            <p className="text-red-200 font-semibold mb-1">Fútbol peruano</p>
            <p className="text-white/70 text-sm max-w-xs mx-auto mb-6">Fulbito 5vs5, Fútbol 7vs7 y 11vs11</p>
            <span className="inline-block bg-white text-red-600 font-bold px-6 py-3 rounded-2xl group-hover:bg-red-50 transition shadow-xl">
              Jugar fútbol →
            </span>
          </div>
        </Link>

        <div className="hidden md:flex relative items-center justify-center w-1 bg-white/20 z-20">
          <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-400 text-xs font-bold">vs</div>
        </div>

        <Link href="/dejada" className="group relative flex-1 min-h-[40vh] flex items-center justify-center overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1400&q=80"
            alt="Cancha de pádel" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-800/75 to-green-950/85 group-hover:from-green-900/70 transition-colors duration-300" />
          <div className="relative z-10 text-white text-center px-8 py-10">
            <div className="text-6xl mb-3 drop-shadow-lg">🏓</div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">DejadaPeru</h2>
            <p className="text-green-200 font-semibold mb-1">Pádel peruano</p>
            <p className="text-white/70 text-sm max-w-xs mx-auto mb-6">Pádel 2vs2 · Derecha y Revés</p>
            <span className="inline-block bg-white text-green-700 font-bold px-6 py-3 rounded-2xl group-hover:bg-green-50 transition shadow-xl">
              Jugar pádel →
            </span>
          </div>
        </Link>
      </section>

      {/* Cómo funciona */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">¿Cómo funciona?</h2>
            <p className="text-gray-500 text-lg">Completá tu equipo en 3 pasos simples</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pasos.map(p => (
              <div key={p.n} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto mb-4">
                  {p.n}
                </div>
                <div className="text-3xl mb-3">{p.emoji}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{p.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/registro" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-2xl text-base transition">
              Registrarse gratis →
            </Link>
            <Link href="/partidos" className="bg-white border border-gray-200 hover:border-red-300 text-gray-700 font-semibold px-8 py-4 rounded-2xl text-base transition">
              Ver partidos disponibles
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
