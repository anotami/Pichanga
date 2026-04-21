import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

function isAdmin(request: Request) {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return false
  try {
    const p = jwt.verify(auth.substring(7), process.env.JWT_SECRET || 'pichanga-secret') as { role: string }
    return p.role === 'admin'
  } catch { return false }
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const NOMBRES = [
  'Diego','Carlos','Luis','Juan','José','Miguel','Ángel','Fernando','Eduardo','Roberto',
  'César','Manuel','Jorge','Ricardo','Rodrigo','Daniel','Alejandro','Óscar','Iván','Paulo',
  'Renato','Wilder','Jhon','Kevin','Bryan','Anthony','Jefferson','Cristian','Alex','Marco',
  'Giancarlo','Paolo','Renzo','Piero','Aldo','Bruno','Franco','Sebastián','Nicolás','Andrés',
  'Felipe','Arturo','Gustavo','Henry','Raúl','Edinson','Anderson','Josué','Martín','Víctor',
  'Ernesto','Gerardo','Flavio','Dante','Rafael','Marcos','Pablo','Gabriel','Mateo','Adrián',
  'David','Fabricio','Samuel','André','Mario','Leonardo','Gianfranco','Luca','Jhonatan','Erwin',
  'Willy','Jean','Pierre','Claudio','Thiago','Lionel','Yosmer','Yordan','Álvaro','Rodrigo',
  'Cristopher','Michael','Jonathan','Richard','Steven','Percy','Elvis','Nixon','Segundo','Walter',
]

const APELLIDOS = [
  'García','Rodríguez','López','Martínez','González','Flores','Torres','Ramírez','Pérez','Sánchez',
  'Castro','Díaz','Mendoza','Vargas','Morales','Reyes','Chávez','Cruz','Huanca','Mamani',
  'Quispe','Condori','Villanueva','Palomino','Espinoza','Cárdenas','Rojas','Delgado','Ramos','Guerrero',
  'Medina','Cabrera','Vega','Herrera','Luna','Salinas','Núñez','Ponce','Ruiz','Obregón',
  'Paredes','Ríos','Aguirre','Tapia','Ortega','Campos','Valdivia','Ccopa','Apaza','Coaquira',
  'Catacora','Huaripata','Llanos','Montes','Nieto','Ocampo','Pacheco','Quiñones','Salas','Tito',
  'Ugarte','Valencia','Zárate','Arenas','Benítez','Caballero','Durand','Estrada','Fuentes','Gallardo',
  'Hidalgo','Inga','Jara','Lora','Melgar','Neyra','Orozco','Pinto','Salcedo','Turpo',
  'Vásquez','Wong','Bravo','Cortez','Figueroa','Gutiérrez','Navarro','Polo','Soto','Vilca',
  'Yucra','Zúñiga','Alvarado','Becerra','Cornejo','Flores','Huamán','Izquierdo','Lazo','Meza',
]

const DISTRITOS_PESO = [
  { d:'San Juan de Lurigancho', w:12 },{ d:'San Martín de Porres', w:9 },
  { d:'Los Olivos', w:8 },{ d:'Ate', w:7 },{ d:'Comas', w:7 },
  { d:'Villa El Salvador', w:6 },{ d:'San Juan de Miraflores', w:5 },
  { d:'Villa María del Triunfo', w:5 },{ d:'Chorrillos', w:5 },
  { d:'Santiago de Surco', w:5 },{ d:'San Miguel', w:4 },
  { d:'Independencia', w:3 },{ d:'Rímac', w:3 },{ d:'La Molina', w:3 },
  { d:'San Borja', w:3 },{ d:'Miraflores', w:3 },{ d:'Lince', w:2 },
  { d:'Surquillo', w:2 },{ d:'Pueblo Libre', w:2 },{ d:'Jesús María', w:2 },
  { d:'Barranco', w:2 },{ d:'Carabayllo', w:2 },{ d:'San Isidro', w:1 },
]

const DESC_FUTBOL: Record<string, string[]> = {
  ARQUERO: [
    'Arquero con reflejos rápidos y buen juego con los pies. Disponible fines de semana.',
    'Guardavalla seguro, buena comunicación con la defensa y excelente en salidas.',
    'Portero con experiencia en ligas distritales. Puntual y con equipo propio.',
    'Arquero ágil, sólido en mano a mano y penales. Me adapto a cualquier sistema.',
    'Portero con sólida técnica. He jugado en Copa Lima y ligas barriales de mi distrito.',
    'Guardameta seguro y comunicativo. Buena salida y buena distribución con los pies.',
    'Portero experimentado. Buenas manos y liderazgo en el área. Siempre puntual.',
    'Arquero con buena envergadura. Efectivo en córners y centros. Disponible de noche.',
  ],
  DEFENSA: [
    'Defensa central sólido. Buen juego aéreo y salida limpia desde atrás.',
    'Lateral derecho con llegada al ataque y buena marca. Disponible toda la semana.',
    'Zaguero contundente, buen en el uno a uno. Varios años en ligas del distrito.',
    'Defensa ordenado, buen primer control y pase. Me adapto a 4-4-2 o línea de 3.',
    'Lateral con buen centro y desborde. También puedo jugar de volante defensivo.',
    'Defensa central con buen anticipo y recuperación. Fuerte en el duelo aéreo.',
    'Lateral izquierdo veloz, buen en la marca y el desborde. Disponible fines de semana.',
    'Zaguero luchador y organizador de la defensa. Buena salida de balón.',
  ],
  MEDIOCAMPISTA: [
    'Mediocampista técnico, buena visión de juego y llegada al ataque.',
    'Volante box to box con buena resistencia física. Siempre dejo todo en la cancha.',
    'Enganche con buen pie, asisto y anoto. Creativo y con llegada al área.',
    'Mediocampista defensivo sólido, recupero y distribuyo bien. Equipo propio.',
    'Playmaker con buen pase largo y tiro de lejos. Experiencia en torneos barriales.',
    'Volante dinámico, buena conducción y presión. Me gusta el juego asociado.',
    'Mediocampista completo, trabajo defensivo y ofensivo. Buen pie derecho e izquierdo.',
    'Organizador de juego, buen control y visión. He jugado en varias ligas distritales.',
  ],
  DELANTERO: [
    'Delantero rápido con buen remate. Goleador habitual en ligas barriales.',
    'Centroavante físico, buen juego de espaldas y definición. Disponible fines de semana.',
    'Extremo derecho veloz, buen centro y regate. Juego en varios equipos del cono sur.',
    'Nueve clásico, buen posicionamiento y definición con ambas piernas.',
    'Atacante habilidoso, buena técnica individual y asociación. También juego de mediapunta.',
    'Delantero rápido y habilidoso. Gol y asistencias en cada torneo. Puntual.',
    'Punta de lanza físico con buen cabezazo. Presiono al portero y genero jugadas.',
    'Extremo izquierdo con buen disparo y regate. Velocidad y desborde son mis fuertes.',
  ],
}

const DESC_PADEL: Record<string, string[]> = {
  DERECHA: [
    'Jugador de derecha técnico, buen globo y bandeja. Nivel intermedio consolidado.',
    'Derecha ordenado, fondo de cancha sólido. Busco partidos los fines de semana.',
    'Jugador de derecha con excelente volea y red. Me adapto a cualquier ritmo.',
    'Derecha técnico con buen remate y bajada de pared. Puntual y responsable.',
    'Jugador de derecha con años de experiencia. Agresivo en red y sólido en fondo.',
    'Derecha completo, buen vibora y smash. Me encanta el juego competitivo.',
    'Jugador de derecha consistente, buen globo y contra-ataque. Disponible de noche.',
    'Derecha dinámico, buena colocación y salida de pared derecha. Liga recreativa.',
  ],
  REVES: [
    'Revés dominante, especialista en la pared izquierda. Buen chiquita y víbora.',
    'Jugador de revés sólido, fondo de cancha ordenado. Liga recreativa o competitiva.',
    'Revés con buen globo defensivo y salida de pared. Varios torneos locales.',
    'Revés constante y agresivo. Me encanta el pádel competitivo. Lima Sur.',
    'Jugador de revés técnico, buena colocación y juego de pared. Puntual siempre.',
    'Revés completo, buen globo y contraataque. Me adapto a cualquier compañero.',
    'Jugador de revés con sólido fondo de cancha y buena volea. Busco torneos.',
    'Revés clásico, ordenado y consistente. Globo preciso y buena salida de pared.',
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function rndInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function rndFloat(min: number, max: number) { return parseFloat((Math.random() * (max - min) + min).toFixed(1)) }
function weightedPick<T>(items: { value: T; weight: number }[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = Math.random() * total
  for (const item of items) { r -= item.weight; if (r <= 0) return item.value }
  return items[items.length - 1].value
}
function pickDistrito(): string {
  return weightedPick(DISTRITOS_PESO.map(d => ({ value: d.d, weight: d.w })))
}

function calcPuntos(totalPartidos: number, rating: number): number {
  const ptsPerGame = rating >= 4.8 ? 10 : rating >= 4.5 ? 8 : rating >= 4.0 ? 5 : rating >= 3.5 ? 3 : 1
  const base = totalPartidos * ptsPerGame
  const noise = base * (0.8 + Math.random() * 0.4)
  return Math.round(noise)
}

function genRating(): number {
  const r = Math.random()
  if (r < 0.10) return rndFloat(2.0, 3.2)      // 10% bad
  if (r < 0.30) return rndFloat(3.2, 3.8)      // 20% below average
  if (r < 0.70) return rndFloat(3.8, 4.5)      // 40% good
  if (r < 0.90) return rndFloat(4.5, 4.9)      // 20% very good
  return 5.0                                     // 10% perfect
}

function genDisponibilidad(): string {
  const dias = ['LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO','DOMINGO']
  const shuffled = dias.sort(() => Math.random() - 0.5).slice(0, rndInt(2, 5))
  const slots = [
    { inicio: '07:00', fin: '09:00' }, { inicio: '09:00', fin: '12:00' },
    { inicio: '12:00', fin: '15:00' }, { inicio: '15:00', fin: '18:00' },
    { inicio: '18:00', fin: '21:00' }, { inicio: '19:00', fin: '22:00' },
  ]
  return JSON.stringify(shuffled.map(dia => ({ dia, ...pick(slots) })))
}

// ─── Futbol player factory ─────────────────────────────────────────────────────
function genFutbolPerfil(i: number, hashedPwd: string) {
  const nombre = `${pick(NOMBRES)} ${pick(APELLIDOS)}`
  const posicion = weightedPick([
    { value: 'ARQUERO', weight: 12 }, { value: 'DEFENSA', weight: 28 },
    { value: 'MEDIOCAMPISTA', weight: 35 }, { value: 'DELANTERO', weight: 25 },
  ])
  const nivel = weightedPick([
    { value: 'AMATEUR', weight: 45 }, { value: 'INTERMEDIO', weight: 38 }, { value: 'COMPETITIVO', weight: 17 },
  ])

  const precioBase: Record<string, Record<string, [number, number]>> = {
    ARQUERO:       { AMATEUR: [25, 55], INTERMEDIO: [50, 90],  COMPETITIVO: [80,  160] },
    DEFENSA:       { AMATEUR: [20, 45], INTERMEDIO: [40, 80],  COMPETITIVO: [70,  140] },
    MEDIOCAMPISTA: { AMATEUR: [22, 50], INTERMEDIO: [45, 85],  COMPETITIVO: [75,  150] },
    DELANTERO:     { AMATEUR: [25, 55], INTERMEDIO: [50, 95],  COMPETITIVO: [85,  180] },
  }
  const [pMin, pMax] = precioBase[posicion][nivel]
  const precio = rndInt(pMin, pMax)

  const totalPartidos = nivel === 'COMPETITIVO' ? rndInt(50, 150) : nivel === 'INTERMEDIO' ? rndInt(20, 80) : rndInt(3, 45)
  const rating = genRating()
  const puntos = calcPuntos(totalPartidos, rating)
  const verificado = nivel === 'COMPETITIVO' ? Math.random() < 0.55 : nivel === 'INTERMEDIO' ? Math.random() < 0.25 : Math.random() < 0.08
  const piernaHabil = weightedPick([{ value: 'DERECHA', weight: 65 }, { value: 'IZQUIERDA', weight: 25 }, { value: 'AMBAS', weight: 10 }])
  const edad = rndInt(17, 42)

  return {
    email: `npc.f${String(i).padStart(4, '0')}@pichanga.pe`,
    password: hashedPwd,
    nombre,
    tipo: 'JUGADOR' as const,
    perfil: {
      deporte: 'FUTBOL',
      posicion,
      nivel,
      piernaHabil,
      edad,
      distrito: pickDistrito(),
      descripcion: pick(DESC_FUTBOL[posicion]),
      precio,
      rating,
      ratingPuntualidad: rndFloat(rating - 0.5 > 1 ? rating - 0.5 : 1.0, Math.min(rating + 0.3, 5.0)),
      ratingNivel: rndFloat(rating - 0.4 > 1 ? rating - 0.4 : 1.0, Math.min(rating + 0.4, 5.0)),
      ratingActitud: rndFloat(rating - 0.3 > 1 ? rating - 0.3 : 1.0, Math.min(rating + 0.3, 5.0)),
      totalResenas: rndInt(totalPartidos > 0 ? Math.floor(totalPartidos * 0.6) : 1, totalPartidos),
      totalPartidos,
      puntos,
      disponibilidad: genDisponibilidad(),
      radioAccion: pick([5, 8, 10, 10, 10, 15, 20]),
      verificado,
      esNPC: true,
    }
  }
}

// ─── Padel player factory ──────────────────────────────────────────────────────
function genPadelPerfil(i: number, hashedPwd: string) {
  const nombre = `${pick(NOMBRES)} ${pick(APELLIDOS)}`
  const posicion = Math.random() < 0.52 ? 'DERECHA' : 'REVES'
  const nivel = weightedPick([
    { value: 'PRINCIPIANTE', weight: 35 }, { value: 'INTERMEDIO', weight: 38 },
    { value: 'AVANZADO', weight: 20 }, { value: 'COMPETIDOR', weight: 7 },
  ])

  const precioBase: Record<string, [number, number]> = {
    PRINCIPIANTE: [20, 40], INTERMEDIO: [35, 70], AVANZADO: [65, 120], COMPETIDOR: [100, 200],
  }
  const [pMin, pMax] = precioBase[nivel]
  const precio = rndInt(pMin, pMax)

  const totalPartidos = nivel === 'COMPETIDOR' ? rndInt(40, 120) : nivel === 'AVANZADO' ? rndInt(20, 70) : nivel === 'INTERMEDIO' ? rndInt(10, 50) : rndInt(2, 25)
  const rating = genRating()
  const puntos = calcPuntos(totalPartidos, rating)
  const verificado = nivel === 'COMPETIDOR' ? Math.random() < 0.5 : nivel === 'AVANZADO' ? Math.random() < 0.2 : Math.random() < 0.06
  const edad = rndInt(18, 50)

  return {
    email: `npc.p${String(i).padStart(3, '0')}@dejada.pe`,
    password: hashedPwd,
    nombre,
    tipo: 'JUGADOR' as const,
    perfil: {
      deporte: 'PADEL',
      posicion,
      nivel,
      piernaHabil: 'DERECHA',
      edad,
      distrito: pickDistrito(),
      descripcion: pick(DESC_PADEL[posicion]),
      precio,
      rating,
      ratingPuntualidad: rndFloat(Math.max(rating - 0.5, 1.0), Math.min(rating + 0.3, 5.0)),
      ratingNivel: rndFloat(Math.max(rating - 0.4, 1.0), Math.min(rating + 0.4, 5.0)),
      ratingActitud: rndFloat(Math.max(rating - 0.3, 1.0), Math.min(rating + 0.3, 5.0)),
      totalResenas: rndInt(totalPartidos > 0 ? Math.floor(totalPartidos * 0.6) : 1, totalPartidos),
      totalPartidos,
      puntos,
      disponibilidad: genDisponibilidad(),
      radioAccion: pick([5, 8, 10, 10, 15, 20]),
      verificado,
      esNPC: true,
    }
  }
}

// ─── Endpoint ─────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const count = await prisma.jugadorPerfil.count({ where: { esNPC: true } })
  return NextResponse.json({ data: { npcCount: count } })
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const existing = await prisma.jugadorPerfil.count({ where: { esNPC: true } })
  if (existing > 0) {
    return NextResponse.json({ error: `Ya existen ${existing} NPCs. Usa DELETE para eliminarlos primero.` }, { status: 400 })
  }

  const hashedPwd = await bcrypt.hash('NPC_Pichanga_2025!', 10)
  const FUTBOL_COUNT = 532
  const PADEL_COUNT = 87
  const BATCH = 40

  let created = 0

  // Football players
  const futbolPlayers = Array.from({ length: FUTBOL_COUNT }, (_, i) => genFutbolPerfil(i + 1, hashedPwd))
  for (let i = 0; i < futbolPlayers.length; i += BATCH) {
    const batch = futbolPlayers.slice(i, i + BATCH)
    await Promise.all(batch.map(p => prisma.usuario.create({
      data: {
        email: p.email, password: p.password, nombre: p.nombre, tipo: p.tipo,
        perfil: { create: p.perfil }
      }
    })))
    created += batch.length
  }

  // Padel players
  const padelPlayers = Array.from({ length: PADEL_COUNT }, (_, i) => genPadelPerfil(i + 1, hashedPwd))
  for (let i = 0; i < padelPlayers.length; i += BATCH) {
    const batch = padelPlayers.slice(i, i + BATCH)
    await Promise.all(batch.map(p => prisma.usuario.create({
      data: {
        email: p.email, password: p.password, nombre: p.nombre, tipo: p.tipo,
        perfil: { create: p.perfil }
      }
    })))
    created += batch.length
  }

  return NextResponse.json({ data: { created, futbol: FUTBOL_COUNT, padel: PADEL_COUNT } })
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Delete NPC profiles then users
  const npcPerfiles = await prisma.jugadorPerfil.findMany({
    where: { esNPC: true }, select: { usuarioId: true }
  })
  const npcIds = npcPerfiles.map(p => p.usuarioId)

  await prisma.jugadorPerfil.deleteMany({ where: { esNPC: true } })
  await prisma.usuario.deleteMany({ where: { id: { in: npcIds } } })

  return NextResponse.json({ data: { deleted: npcIds.length } })
}
