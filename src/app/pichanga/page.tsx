'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import PlayerCard from '@/components/PlayerCard'
import MatchCard from '@/components/MatchCard'
import { JugadorPerfil, Partido } from '@/types'
import { POSICIONES } from '@/lib/constants'

const IMGS = {
  hero:      'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?auto=format&fit=crop&w=1920&q=80',
  campo:     'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80',
  jugadores: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=1200&q=80',
  balon:     'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  estadio:   'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?auto=format&fit=crop&w=1200&q=80',
  arquero:   'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=600&q=80',
  partido:   'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
  lima:      'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&w=1200&q=80',
}

const POS_IMGS: Record<string, string> = {
  ARQUERO:       'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=400&q=80',
  DEFENSA:       'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=400&q=80',
  MEDIOCAMPISTA: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
  DELANTERO:     'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80',
}

export default function PichangaHome() {
  const [jugadores, setJugadores] = useState<JugadorPerfil[]>([])
  const [partidos, setPartidos] = useState<Partido[]>([])

  useEffect(() => {
    api.get<JugadorPerfil[]>('/jugadores?deporte=FUTBOL').then(d => setJugadores(d.slice(0, 4))).catch(() => {})
    api.get<Partido[]>('/partidos?deporte=FUTBOL').then(d => setPartidos(d.slice(0, 3))).catch(() => {})
  }, [])

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative text-white overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <Image src={IMGS.hero} alt="Estadio de fútbol" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-red-700/80 to-red-800/85" />
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <span>🇵🇪</span> La plataforma de fútbol N°1 en Perú
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Completa tu partido,<br />
            <span className="text-red-200">encuentra jugadores</span>
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto mb-10 drop-shadow">
            ¿Te faltan jugadores para la pichanga? Encuentra arqueros, defensas, mediocampistas y delanteros en tu distrito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jugadores" className="bg-white text-red-600 font-bold px-10 py-4 rounded-2xl text-lg hover:bg-red-50 transition shadow-xl">
              Buscar jugadores
            </Link>
            <Link href="/partidos" className="bg-white/10 backdrop-blur-sm text-white border border-white/40 font-bold px-10 py-4 rounded-2xl text-lg hover:bg-white/20 transition">
              Ver partidos
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-gray-100 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          {[
            { n: '1,200+', label: 'Jugadores registrados', emoji: '👟' },
            { n: '500+',   label: 'Partidos organizados',  emoji: '⚽' },
            { n: '50+',    label: 'Clubes asociados',      emoji: '🏟️' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-2xl font-extrabold text-red-600">{s.n}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Posiciones con imagen ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title mb-2">Busca por posición</h2>
          <p className="text-gray-500">Filtra jugadores según lo que necesita tu equipo</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {POSICIONES.map(pos => (
            <Link key={pos.value} href={`/jugadores?posicion=${pos.value}`}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-48">
                <Image src={POS_IMGS[pos.value]} alt={pos.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="text-3xl mb-1">{pos.emoji}</div>
                <h3 className="font-bold text-lg">{pos.label}</h3>
                <p className="text-xs text-white/70">Ver disponibles →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Fútbol peruano banner ── */}
      <section className="relative overflow-hidden my-4">
        <div className="relative h-72 md:h-96">
          <Image src={IMGS.campo} alt="Campo de fútbol en Lima" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 md:px-20">
            <div className="text-white max-w-lg">
              <div className="text-sm font-semibold text-red-400 mb-2 tracking-widest uppercase">🇵🇪 Fútbol peruano</div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                De Miraflores a San Juan de Lurigancho
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Conectamos jugadores en todos los distritos de Lima y las principales ciudades del Perú.
              </p>
              <Link href="/registro" className="inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition shadow-lg">
                Únete gratis →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-2">¿Cómo funciona?</h2>
            <p className="text-gray-500">Simple, rápido y confiable</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Publica tu partido', desc: 'Indica las posiciones que necesitas, el distrito, horario y presupuesto.', img: IMGS.estadio, icon: '📋' },
              { step: '02', title: 'Recibe ofertas', desc: 'Los jugadores te envían sus propuestas con sus precios y disponibilidad.', img: IMGS.jugadores, icon: '⚡' },
              { step: '03', title: '¡A jugar!', desc: 'Elige al jugador ideal, confirma el pago y a jugar la pichanga.', img: IMGS.partido, icon: '🎉' },
            ].map(item => (
              <div key={item.step} className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all">
                <div className="relative h-44">
                  <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-lg">
                    {item.step}
                  </div>
                </div>
                <div className="p-5 bg-white">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jugadores destacados ── */}
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

      {/* ── Partidos recientes ── */}
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

      {/* ── Sube de rango ── */}
      <section className="relative overflow-hidden">
        <div className="relative h-64 md:h-80">
          <Image src={IMGS.arquero} alt="Jugador de fútbol" fill className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-l from-red-900/90 via-red-700/75 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-end px-8 md:px-20">
            <div className="text-white text-right max-w-md">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-2">Sube de rango</h3>
              <p className="text-white/80">Rookie → Amateur → Profesional → <span className="text-yellow-300 font-bold">Elite</span></p>
              <p className="text-white/60 text-sm mt-2">Gana puntos con cada partido y reseña positiva</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title mb-2">¿Por qué Pichanga?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { emoji: '🏆', title: 'Sistema de puntos',     desc: 'Gana puntos con cada reseña positiva y sube de rango: Rookie → Amateur → Profesional → Elite.' },
            { emoji: '🔒', title: 'Jugadores verificados', desc: 'Verificamos la identidad de los jugadores para que juegues con confianza.' },
            { emoji: '💰', title: 'Tú pones el precio',    desc: 'Sistema de subasta: cada jugador propone su precio por partido. Sin tarifas fijas.' },
            { emoji: '🏟️', title: 'Clubes asociados',      desc: 'Los clubes pueden organizarse en la plataforma y publicar partidos regulares.' },
            { emoji: '⭐', title: 'Reseñas reales',        desc: 'Lee las reseñas de otros organizadores antes de contratar a un jugador.' },
            { emoji: '📍', title: 'Todo Lima y Perú',      desc: 'Disponible en todos los distritos de Lima y principales ciudades del Perú.' },
          ].map(f => (
            <div key={f.title} className="card hover:shadow-md transition group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">{f.emoji}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={IMGS.partido} alt="Partido de fútbol" fill className="object-cover" />
          <div className="absolute inset-0 bg-red-700/85" />
        </div>
        <div className="relative text-white py-20 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold mb-4 drop-shadow">¿Listo para jugar más?</h2>
            <p className="text-red-100 text-lg mb-10">Regístrate gratis y empieza a encontrar jugadores o partidos hoy mismo.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registro?tipo=JUGADOR" className="bg-white text-red-600 font-bold px-10 py-4 rounded-2xl text-lg hover:bg-red-50 transition shadow-xl">
                Soy jugador
              </Link>
              <Link href="/registro?tipo=ORGANIZADOR" className="bg-white/10 border border-white/40 text-white font-bold px-10 py-4 rounded-2xl text-lg hover:bg-white/20 transition">
                Organizar partido
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
