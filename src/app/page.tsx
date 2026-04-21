'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function PortadaPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col md:flex-row">
      {/* Pichanga – Fútbol */}
      <Link
        href="/pichanga"
        className="group relative flex-1 min-h-[50vh] flex items-center justify-center overflow-hidden"
      >
        <Image
          src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1400&q=80"
          alt="Cancha de fútbol"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/80 via-red-800/75 to-red-950/85 group-hover:from-red-900/70 transition-colors duration-300" />
        <div className="relative z-10 text-white text-center px-8 py-12">
          <div className="text-7xl mb-4 drop-shadow-lg">⚽</div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg tracking-tight">
            Pichanga
          </h2>
          <p className="text-red-200 text-lg font-semibold mb-1">Fútbol peruano</p>
          <p className="text-white/70 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
            Fulbito 5vs5, Fútbol 7vs7 y 11vs11. Completa tu equipo y a jugar.
          </p>
          <span className="inline-block bg-white text-red-600 font-bold px-8 py-3.5 rounded-2xl text-lg group-hover:bg-red-50 transition shadow-2xl">
            Jugar fútbol →
          </span>
          <div className="mt-8 flex justify-center gap-6 text-center text-white/80 text-xs">
            <div><p className="text-xl font-extrabold text-white">1,200+</p><p>Jugadores</p></div>
            <div><p className="text-xl font-extrabold text-white">500+</p><p>Partidos</p></div>
            <div><p className="text-xl font-extrabold text-white">50+</p><p>Clubes</p></div>
          </div>
        </div>
      </Link>

      {/* Divisor vertical */}
      <div className="hidden md:flex relative items-center justify-center w-1 bg-white/20 z-20">
        <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-400 text-xs font-bold">
          vs
        </div>
      </div>

      {/* DejadaPeru – Pádel */}
      <Link
        href="/dejada"
        className="group relative flex-1 min-h-[50vh] flex items-center justify-center overflow-hidden"
      >
        <Image
          src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1400&q=80"
          alt="Cancha de pádel"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-800/75 to-green-950/85 group-hover:from-green-900/70 transition-colors duration-300" />
        <div className="relative z-10 text-white text-center px-8 py-12">
          <div className="text-7xl mb-4 drop-shadow-lg">🏓</div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg tracking-tight">
            DejadaPeru
          </h2>
          <p className="text-green-200 text-lg font-semibold mb-1">Pádel peruano</p>
          <p className="text-white/70 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
            Pádel 2vs2. Encuentra compañeros de derecha o revés para tu partido.
          </p>
          <span className="inline-block bg-white text-green-700 font-bold px-8 py-3.5 rounded-2xl text-lg group-hover:bg-green-50 transition shadow-2xl">
            Jugar pádel →
          </span>
          <div className="mt-8 flex justify-center gap-6 text-center text-white/80 text-xs">
            <div><p className="text-xl font-extrabold text-white">Nuevo</p><p>en Perú</p></div>
            <div><p className="text-xl font-extrabold text-white">2vs2</p><p>Parejas</p></div>
            <div><p className="text-xl font-extrabold text-white">🇵🇪</p><p>Lima</p></div>
          </div>
        </div>
      </Link>
    </div>
  )
}
