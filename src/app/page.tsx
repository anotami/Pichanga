'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import PlayerCard from '@/components/PlayerCard'
import MatchCard from '@/components/MatchCard'
import { JugadorPerfil, Partido } from '@/types'
import { POSICIONES } from '@/lib/constants'

export default function Home() {
  const [jugadores, setJugadores] = useState<JugadorPerfil[]>([])
  const [partidos, setPartidos] = useState<Partido[]>([])

  useEffect(() => {
    api.get<JugadorPerfil[]>('/jugadores').then(d => setJugadores(d.slice(0, 4))).catch(() => {})
    api.get<Partido[]>('/partidos').then(d => setPartidos(d.slice(0, 3))).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">⚽</div>
          <div className="absolute bottom-10 right-20 text-8xl">🥅</div>
          <div className="absolute top-20 right-40 text-7xl">🏆</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-red-800/50 rounded-full px-4 py-1.5 text-sm mb-6">
            <span>🇵🇪</span> La plataforma de fútbol N°1 en Perú
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Completa tu partido,<br />
            <span className="text-red-200">encuentra jugadores</span>
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto mb-8">
            ¿Te faltan jugadores para la pichanga? Encuentra arqueros, defensas, mediocampistas y delanteros disponibles en tu distrito.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/jugadores" className="bg-white text-red-600 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-red-50 transition shadow-lg">
              Buscar jugadores
            </Link>
            <Link href="/partidos" className="bg-red-800/60 text-white border border-red-400 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-red-800 transition">
              Ver partidos
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 md:grid-cols-3 gap-6 text-center">
          {[
            { n: '1,200+', label: 'Jugadores registrados', emoji: '👟' },
            { n: '500+', label: 'Partidos organizados', emoji: '⚽' },
            { n: '50+', label: 'Clubes asociados', emoji: '🏟️' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-2xl font-extrabold text-red-600">{s.n}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Posiciones */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title mb-2">Busca por posición</h2>
          <p className="text-gray-500">Filtra jugadores según lo que necesita tu equipo</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {POSICIONES.map(pos => (
            <Link key={pos.value} href={`/jugadores?posicion=${pos.value}`}
              className={`card text-center hover:shadow-md transition cursor-pointer border-2 hover:border-red-200 group`}>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">{pos.emoji}</div>
              <h3 className="font-bold text-gray-900">{pos.label}</h3>
              <p className="text-xs text-gray-500 mt-1">Ver disponibles</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-title mb-2">¿Cómo funciona?</h2>
            <p className="text-gray-500">Simple, rápido y confiable</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', emoji: '📋', title: 'Publica tu partido', desc: 'Indica las posiciones que necesitas, el distrito, horario y presupuesto.' },
              { step: '02', emoji: '⚡', title: 'Recibe ofertas', desc: 'Los jugadores te envían sus propuestas con sus precios y disponibilidad.' },
              { step: '03', emoji: '🎉', title: 'Juega', desc: 'Elige al jugador ideal, confirma el pago y a jugar la pichanga.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">
                  {item.emoji}
                </div>
                <div className="text-xs font-bold text-red-500 mb-1">PASO {item.step}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jugadores destacados */}
      {jugadores.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title mb-1">Jugadores destacados</h2>
              <p className="text-gray-500">Los mejor valorados de la plataforma</p>
            </div>
            <Link href="/jugadores" className="text-red-600 font-semibold hover:text-red-700 transition text-sm">Ver todos →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {jugadores.map(j => <PlayerCard key={j.id} perfil={j} />)}
          </div>
        </section>
      )}

      {/* Partidos recientes */}
      {partidos.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title mb-1">Partidos buscando jugadores</h2>
                <p className="text-gray-500">Aplica y empieza a ganar</p>
              </div>
              <Link href="/partidos" className="text-red-600 font-semibold hover:text-red-700 transition text-sm">Ver todos →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {partidos.map(p => <MatchCard key={p.id} partido={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title mb-2">¿Por qué Pichanga?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { emoji: '🏆', title: 'Sistema de puntos', desc: 'Gana puntos con cada reseña positiva y sube de rango: Rookie → Amateur → Profesional → Elite.' },
            { emoji: '🔒', title: 'Jugadores verificados', desc: 'Verificamos la identidad de los jugadores para que juegues con confianza.' },
            { emoji: '💰', title: 'Tú pones el precio', desc: 'Sistema de subasta: cada jugador propone su precio por partido. Sin tarifas fijas.' },
            { emoji: '🏟️', title: 'Clubes asociados', desc: 'Los clubes pueden organizarse en la plataforma y publicar partidos regulares.' },
            { emoji: '⭐', title: 'Reseñas reales', desc: 'Lee las reseñas de otros organizadores antes de contratar a un jugador.' },
            { emoji: '📍', title: 'Todo Lima y Perú', desc: 'Disponible en todos los distritos de Lima y principales ciudades del Perú.' },
          ].map(f => (
            <div key={f.title} className="card hover:shadow-md transition">
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">¿Listo para jugar más?</h2>
          <p className="text-red-100 mb-8">Regístrate gratis y empieza a encontrar jugadores o partidos hoy mismo.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/registro?tipo=JUGADOR" className="bg-white text-red-600 font-bold px-8 py-4 rounded-2xl hover:bg-red-50 transition">
              Soy jugador
            </Link>
            <Link href="/registro?tipo=ORGANIZADOR" className="bg-red-800/60 border border-red-300 text-white font-bold px-8 py-4 rounded-2xl hover:bg-red-800 transition">
              Organizar partido
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
