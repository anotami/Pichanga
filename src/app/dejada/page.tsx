'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { JugadorPerfil, Partido } from '@/types'
import { POSICIONES_PADEL } from '@/lib/constants'

const IMGS = {
  hero:    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1920&q=80',
  court:   'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
  players: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?auto=format&fit=crop&w=1200&q=80',
  action:  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
}

export default function DejadaHome() {
  const [jugadores, setJugadores] = useState<JugadorPerfil[]>([])
  const [partidos, setPartidos] = useState<Partido[]>([])

  useEffect(() => {
    fetch('/api/jugadores?deporte=PADEL')
      .then(r => r.json())
      .then(j => setJugadores((j.data ?? []).slice(0, 4)))
      .catch(() => {})
    fetch('/api/partidos?deporte=PADEL&status=ABIERTO')
      .then(r => r.json())
      .then(j => setPartidos((j.data ?? []).slice(0, 3)))
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative text-white overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <Image src={IMGS.hero} alt="Cancha de pádel" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-700/80 to-green-800/85" />
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <span>🇵🇪</span> La plataforma de pádel N°1 en Perú
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Completa tu pareja,<br />
            <span className="text-green-200">encuentra tu compañero</span>
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-10 drop-shadow">
            ¿Te falta un compañero para tu partido de pádel? Encuentra jugadores de derecha o revés en tu distrito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dejada/jugadores" className="bg-white text-green-700 font-bold px-10 py-4 rounded-2xl text-lg hover:bg-green-50 transition shadow-xl">
              Buscar jugadores
            </Link>
            <Link href="/dejada/partidos" className="bg-white/10 backdrop-blur-sm text-white border border-white/40 font-bold px-10 py-4 rounded-2xl text-lg hover:bg-white/20 transition">
              Ver partidos
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-gray-100 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          {[
            { n: 'Nuevo',  label: 'En Perú',           emoji: '🎾' },
            { n: '2vs2',   label: 'Formato parejas',   emoji: '🏓' },
            { n: 'Lima',   label: 'y todo el Perú',    emoji: '🇵🇪' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-2xl font-extrabold text-green-700">{s.n}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Posiciones ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Busca por posición</h2>
          <p className="text-gray-500">Encuentra el jugador que necesitas para completar tu pareja</p>
        </div>
        <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
          {POSICIONES_PADEL.map(pos => (
            <Link key={pos.value} href={`/dejada/jugadores?posicion=${pos.value}`}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-52">
                <Image
                  src={pos.value === 'DERECHA' ? IMGS.players : IMGS.court}
                  alt={pos.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/85 via-green-800/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="text-4xl mb-1">{pos.emoji}</div>
                <h3 className="font-bold text-xl">{pos.label}</h3>
                <p className="text-xs text-white/70">Ver disponibles →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">¿Cómo funciona?</h2>
            <p className="text-gray-500">Simple y rápido</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Publica tu partido', desc: 'Indica si necesitas derecha o revés, el club, horario y presupuesto.', icon: '📋' },
              { step: '02', title: 'Recibe propuestas', desc: 'Los jugadores disponibles te contactan con sus precios y nivel.', icon: '⚡' },
              { step: '03', title: '¡A la cancha!', desc: 'Elige tu compañero ideal y a jugar el partido de pádel.', icon: '🏆' },
            ].map(item => (
              <div key={item.step} className="card group hover:shadow-md transition">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow mb-4">
                  {item.step}
                </div>
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
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
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Jugadores destacados</h2>
              <p className="text-gray-500">Los mejor valorados de la plataforma</p>
            </div>
            <Link href="/dejada/jugadores" className="text-green-700 font-semibold hover:text-green-800 transition text-sm">Ver todos →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {jugadores.map(j => (
              <div key={j.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden">
                <div className="bg-gradient-to-br from-green-50 to-green-100 px-6 pt-6 pb-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center text-3xl mx-auto mb-3">
                    {j.posicion === 'DERECHA' ? '🎾' : '🏓'}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{j.usuario?.nombre ?? 'Jugador'}</h3>
                </div>
                <div className="px-6 py-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <span className="text-green-500">📍</span>{j.distrito}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-lg font-bold text-green-700">S/ {j.precio}</p>
                    <Link href={`/jugadores/${j.usuarioId}`} className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-800 transition">
                      Ver perfil
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Partidos abiertos ── */}
      {partidos.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Partidos buscando jugadores</h2>
                <p className="text-gray-500">Aplica y empieza a jugar</p>
              </div>
              <Link href="/dejada/partidos" className="text-green-700 font-semibold hover:text-green-800 transition text-sm">Ver todos →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {partidos.map(p => (
                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden p-5">
                  <h3 className="font-bold text-gray-900 mb-2">{p.titulo}</h3>
                  <p className="text-sm text-gray-500 mb-3">📍 {p.distrito}</p>
                  <Link href={`/partidos/${p.id}`} className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-800 transition inline-block">
                    Ver partido
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">¿Por qué DejadaPeru?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { emoji: '🏆', title: 'Sistema de puntos',    desc: 'Gana puntos con cada reseña positiva y sube de rango en el pádel peruano.' },
            { emoji: '🔒', title: 'Jugadores verificados', desc: 'Verificamos identidad y nivel para que juegues con confianza.' },
            { emoji: '💰', title: 'Tú pones el precio',   desc: 'Cada jugador propone su precio. Sin tarifas fijas ni comisiones ocultas.' },
            { emoji: '🎾', title: 'Derecha y Revés',      desc: 'Busca específicamente el lado que necesitas para completar tu pareja.' },
            { emoji: '⭐', title: 'Reseñas reales',       desc: 'Lee opiniones de otros jugadores antes de elegir a tu compañero.' },
            { emoji: '📍', title: 'Lima y el Perú',       desc: 'Todos los clubes y canchas de pádel en Lima y principales ciudades.' },
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
          <Image src={IMGS.action} alt="Pádel" fill className="object-cover" />
          <div className="absolute inset-0 bg-green-800/85" />
        </div>
        <div className="relative text-white py-20 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold mb-4 drop-shadow">¿Listo para jugar pádel?</h2>
            <p className="text-green-100 text-lg mb-10">Regístrate gratis y empieza a encontrar compañeros o partidos hoy mismo.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registro?tipo=JUGADOR" className="bg-white text-green-700 font-bold px-10 py-4 rounded-2xl text-lg hover:bg-green-50 transition shadow-xl">
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
