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

const NPC_ORG_EMAIL = 'npc.org@pichanga.pe'
const NPC_ORG_PADEL_EMAIL = 'npc.org.padel@pichanga.pe'

// días desde hoy
function diasDesdeHoy(dias: number, hora = '10:00'): Date {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  const [h, m] = hora.split(':').map(Number)
  d.setHours(h, m, 0, 0)
  return d
}

const PARTIDOS_FUTBOL = [
  { titulo: 'Fulbito clásico dominguero', distrito: 'San Juan de Lurigancho', modalidad: '5VS5', duracion: 60,  tipoPago: 'PAGA_CUOTA', cuotaCosto: 15, dias: 3,  hora: '08:00', posiciones: [{ posicion: 'ARQUERO', cantidad: 1 }, { posicion: 'DEFENSA', cantidad: 2 }] },
  { titulo: 'Partido 7vs7 Los Olivos', distrito: 'Los Olivos', modalidad: '7VS7', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 20, dias: 5,  hora: '19:00', posiciones: [{ posicion: 'ARQUERO', cantidad: 1 }, { posicion: 'DEFENSA', cantidad: 1 }, { posicion: 'MEDIOCAMPISTA', cantidad: 2 }] },
  { titulo: 'Buscamos arquero urgente', distrito: 'Santiago de Surco', modalidad: '5VS5', duracion: 60,  tipoPago: 'SE_LE_PAGA', pagoJugador: 50, dias: 2,  hora: '20:00', posiciones: [{ posicion: 'ARQUERO', cantidad: 1 }] },
  { titulo: 'Fútbol 5 vs 5 en Miraflores', distrito: 'Miraflores', modalidad: '5VS5', duracion: 60,  tipoPago: 'PAGA_CUOTA', cuotaCosto: 25, dias: 7,  hora: '18:30', posiciones: [{ posicion: 'DELANTERO', cantidad: 2 }, { posicion: 'MEDIOCAMPISTA', cantidad: 1 }] },
  { titulo: 'Clásico del cono norte', distrito: 'Comas', modalidad: '7VS7', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 12, dias: 4,  hora: '17:00', posiciones: [{ posicion: 'DEFENSA', cantidad: 2 }, { posicion: 'DELANTERO', cantidad: 1 }] },
  { titulo: 'Partido nocturno SJM', distrito: 'San Juan de Miraflores', modalidad: '5VS5', duracion: 60,  tipoPago: 'PAGA_CUOTA', cuotaCosto: 18, dias: 6,  hora: '20:30', posiciones: [{ posicion: 'MEDIOCAMPISTA', cantidad: 2 }, { posicion: 'DELANTERO', cantidad: 1 }] },
  { titulo: 'San Borja 11 vs 11', distrito: 'San Borja', modalidad: '11VS11', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 30, dias: 10, hora: '07:00', posiciones: [{ posicion: 'ARQUERO', cantidad: 1 }, { posicion: 'DEFENSA', cantidad: 3 }, { posicion: 'MEDIOCAMPISTA', cantidad: 2 }, { posicion: 'DELANTERO', cantidad: 2 }] },
  { titulo: 'Fútbol gratis en La Molina', distrito: 'La Molina', modalidad: '5VS5', duracion: 60,  tipoPago: 'GRATIS', dias: 8,  hora: '09:00', posiciones: [{ posicion: 'DEFENSA', cantidad: 1 }, { posicion: 'DELANTERO', cantidad: 1 }] },
  { titulo: 'Pichanga VES sábado tarde', distrito: 'Villa El Salvador', modalidad: '5VS5', duracion: 60,  tipoPago: 'PAGA_CUOTA', cuotaCosto: 10, dias: 9,  hora: '15:00', posiciones: [{ posicion: 'ARQUERO', cantidad: 1 }, { posicion: 'MEDIOCAMPISTA', cantidad: 1 }] },
  { titulo: 'Buscamos mediocentro técnico', distrito: 'Lince', modalidad: '7VS7', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 22, dias: 3,  hora: '21:00', posiciones: [{ posicion: 'MEDIOCAMPISTA', cantidad: 2 }] },
  { titulo: 'Delanteros para 7vs7', distrito: 'San Miguel', modalidad: '7VS7', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 20, dias: 5,  hora: '08:30', posiciones: [{ posicion: 'DELANTERO', cantidad: 2 }] },
  { titulo: 'Partido SMP jueves noche', distrito: 'San Martín de Porres', modalidad: '5VS5', duracion: 60,  tipoPago: 'PAGA_CUOTA', cuotaCosto: 15, dias: 4,  hora: '19:30', posiciones: [{ posicion: 'DEFENSA', cantidad: 1 }, { posicion: 'DELANTERO', cantidad: 1 }] },
  { titulo: 'Necesitamos arquero pagado', distrito: 'Surquillo', modalidad: '7VS7', duracion: 90, tipoPago: 'SE_LE_PAGA', pagoJugador: 70, dias: 6,  hora: '10:00', posiciones: [{ posicion: 'ARQUERO', cantidad: 1 }] },
  { titulo: 'Pichanga Ate domingo mañana', distrito: 'Ate', modalidad: '5VS5', duracion: 60,  tipoPago: 'PAGA_CUOTA', cuotaCosto: 12, dias: 11, hora: '07:30', posiciones: [{ posicion: 'MEDIOCAMPISTA', cantidad: 1 }, { posicion: 'DELANTERO', cantidad: 1 }] },
  { titulo: 'Fútbol Pueblo Libre tarde', distrito: 'Pueblo Libre', modalidad: '5VS5', duracion: 60,  tipoPago: 'PAGA_CUOTA', cuotaCosto: 20, dias: 7,  hora: '16:00', posiciones: [{ posicion: 'ARQUERO', cantidad: 1 }, { posicion: 'DEFENSA', cantidad: 1 }] },
  { titulo: 'Pichanga Barranco bohemia', distrito: 'Barranco', modalidad: '5VS5', duracion: 60,  tipoPago: 'GRATIS', dias: 12, hora: '18:00', posiciones: [{ posicion: 'MEDIOCAMPISTA', cantidad: 2 }] },
  { titulo: '11 vs 11 clásico Chorrillos', distrito: 'Chorrillos', modalidad: '11VS11', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 25, dias: 14, hora: '08:00', posiciones: [{ posicion: 'ARQUERO', cantidad: 1 }, { posicion: 'DEFENSA', cantidad: 2 }, { posicion: 'MEDIOCAMPISTA', cantidad: 3 }, { posicion: 'DELANTERO', cantidad: 2 }] },
  { titulo: 'Buscamos defensa para 7vs7', distrito: 'Jesús María', modalidad: '7VS7', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 25, dias: 2,  hora: '20:00', posiciones: [{ posicion: 'DEFENSA', cantidad: 2 }] },
  { titulo: 'Fulbito nocturno Independencia', distrito: 'Independencia', modalidad: '5VS5', duracion: 60,  tipoPago: 'PAGA_CUOTA', cuotaCosto: 10, dias: 3,  hora: '21:00', posiciones: [{ posicion: 'DELANTERO', cantidad: 1 }, { posicion: 'ARQUERO', cantidad: 1 }] },
  { titulo: 'Pichanga Rímac sábado noche', distrito: 'Rímac', modalidad: '5VS5', duracion: 60,  tipoPago: 'PAGA_CUOTA', cuotaCosto: 12, dias: 8,  hora: '20:00', posiciones: [{ posicion: 'MEDIOCAMPISTA', cantidad: 1 }, { posicion: 'DEFENSA', cantidad: 1 }] },
  { titulo: 'VMT domingo clásico', distrito: 'Villa María del Triunfo', modalidad: '7VS7', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 10, dias: 9,  hora: '09:00', posiciones: [{ posicion: 'DEFENSA', cantidad: 1 }, { posicion: 'DELANTERO', cantidad: 2 }] },
  { titulo: 'Carabayllo 5vs5 mañanero', distrito: 'Carabayllo', modalidad: '5VS5', duracion: 60,  tipoPago: 'PAGA_CUOTA', cuotaCosto: 8,  dias: 6,  hora: '07:00', posiciones: [{ posicion: 'ARQUERO', cantidad: 1 }, { posicion: 'MEDIOCAMPISTA', cantidad: 1 }] },
  { titulo: 'Fútbol 5 San Isidro premium', distrito: 'San Isidro', modalidad: '5VS5', duracion: 60,  tipoPago: 'SE_LE_PAGA', pagoJugador: 80, dias: 4,  hora: '19:00', posiciones: [{ posicion: 'DELANTERO', cantidad: 1 }] },
  { titulo: 'Buscamos volante mixto Surco', distrito: 'Santiago de Surco', modalidad: '7VS7', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 22, dias: 5,  hora: '18:00', posiciones: [{ posicion: 'MEDIOCAMPISTA', cantidad: 2 }, { posicion: 'DEFENSA', cantidad: 1 }] },
  { titulo: '7vs7 Los Olivos fin de semana', distrito: 'Los Olivos', modalidad: '7VS7', duracion: 90, tipoPago: 'GRATIS', dias: 10, hora: '10:00', posiciones: [{ posicion: 'ARQUERO', cantidad: 1 }, { posicion: 'DEFENSA', cantidad: 1 }] },
]

const PARTIDOS_PADEL = [
  { titulo: 'Pádel mixto nivel intermedio', distrito: 'Miraflores', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 40, dias: 2,  hora: '18:00', posiciones: [{ posicion: 'DERECHA', cantidad: 1 }, { posicion: 'REVES', cantidad: 1 }] },
  { titulo: 'Busco compañero de revés', distrito: 'San Isidro', duracion: 60, tipoPago: 'PAGA_CUOTA', cuotaCosto: 35, dias: 3,  hora: '07:30', posiciones: [{ posicion: 'REVES', cantidad: 1 }] },
  { titulo: 'Pádel avanzado Surco', distrito: 'Santiago de Surco', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 50, dias: 4,  hora: '20:00', posiciones: [{ posicion: 'DERECHA', cantidad: 1 }] },
  { titulo: 'Dobla el sábado Barranco', distrito: 'Barranco', duracion: 60, tipoPago: 'PAGA_CUOTA', cuotaCosto: 30, dias: 6,  hora: '09:00', posiciones: [{ posicion: 'DERECHA', cantidad: 1 }, { posicion: 'REVES', cantidad: 1 }] },
  { titulo: 'Necesitamos derecha para torneo', distrito: 'San Borja', duracion: 90, tipoPago: 'SE_LE_PAGA', pagoJugador: 60, dias: 5,  hora: '19:30', posiciones: [{ posicion: 'DERECHA', cantidad: 1 }] },
  { titulo: 'Pádel principiante La Molina', distrito: 'La Molina', duracion: 60, tipoPago: 'GRATIS', dias: 7,  hora: '08:00', posiciones: [{ posicion: 'DERECHA', cantidad: 1 }, { posicion: 'REVES', cantidad: 1 }] },
  { titulo: 'Pádel nocturno Jesús María', distrito: 'Jesús María', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 45, dias: 3,  hora: '21:00', posiciones: [{ posicion: 'REVES', cantidad: 1 }] },
  { titulo: 'Nivel competidor San Miguel', distrito: 'San Miguel', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 55, dias: 8,  hora: '07:00', posiciones: [{ posicion: 'DERECHA', cantidad: 1 }] },
  { titulo: 'Jueves pádel Pueblo Libre', distrito: 'Pueblo Libre', duracion: 60, tipoPago: 'PAGA_CUOTA', cuotaCosto: 35, dias: 4,  hora: '18:30', posiciones: [{ posicion: 'DERECHA', cantidad: 1 }, { posicion: 'REVES', cantidad: 1 }] },
  { titulo: 'Pádel Lince fin de semana', distrito: 'Lince', duracion: 90, tipoPago: 'PAGA_CUOTA', cuotaCosto: 40, dias: 9,  hora: '10:00', posiciones: [{ posicion: 'REVES', cantidad: 1 }] },
]

export async function GET(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const count = await prisma.partido.count({ where: { organizador: { email: { startsWith: 'npc.org' } } } })
  return NextResponse.json({ data: { partidosCount: count } })
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const existing = await prisma.partido.count({ where: { organizador: { email: { startsWith: 'npc.org' } } } })
  if (existing > 0) {
    return NextResponse.json({ error: `Ya existen ${existing} partidos de ejemplo.` }, { status: 400 })
  }

  const hashedPwd = await bcrypt.hash('NPC_Org_2025!', 10)

  const orgFutbol = await prisma.usuario.upsert({
    where: { email: NPC_ORG_EMAIL },
    create: { email: NPC_ORG_EMAIL, password: hashedPwd, nombre: 'Organizador Pichanga', tipo: 'ORGANIZADOR' },
    update: {},
  })

  const orgPadel = await prisma.usuario.upsert({
    where: { email: NPC_ORG_PADEL_EMAIL },
    create: { email: NPC_ORG_PADEL_EMAIL, password: hashedPwd, nombre: 'Organizador DejadaPeru', tipo: 'ORGANIZADOR' },
    update: {},
  })

  let created = 0

  await Promise.all(PARTIDOS_FUTBOL.map(p => prisma.partido.create({
    data: {
      organizadorId: orgFutbol.id,
      deporte: 'FUTBOL',
      titulo: p.titulo,
      distrito: p.distrito,
      fecha: diasDesdeHoy(p.dias, p.hora),
      duracion: p.duracion,
      modalidad: p.modalidad,
      nivelRequerido: 'AMATEUR',
      tipoPago: p.tipoPago,
      cuotaCosto: 'cuotaCosto' in p ? p.cuotaCosto : null,
      pagoJugador: 'pagoJugador' in p ? p.pagoJugador : null,
      posiciones: JSON.stringify(p.posiciones),
    }
  })))
  created += PARTIDOS_FUTBOL.length

  await Promise.all(PARTIDOS_PADEL.map(p => prisma.partido.create({
    data: {
      organizadorId: orgPadel.id,
      deporte: 'PADEL',
      titulo: p.titulo,
      distrito: p.distrito,
      fecha: diasDesdeHoy(p.dias, p.hora),
      duracion: p.duracion,
      modalidad: '2VS2',
      nivelRequerido: 'PRINCIPIANTE',
      tipoPago: p.tipoPago,
      cuotaCosto: 'cuotaCosto' in p ? p.cuotaCosto : null,
      pagoJugador: 'pagoJugador' in p ? p.pagoJugador : null,
      posiciones: JSON.stringify(p.posiciones),
    }
  })))
  created += PARTIDOS_PADEL.length

  return NextResponse.json({ data: { created, futbol: PARTIDOS_FUTBOL.length, padel: PARTIDOS_PADEL.length } })
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const orgs = await prisma.usuario.findMany({
    where: { email: { in: [NPC_ORG_EMAIL, NPC_ORG_PADEL_EMAIL] } },
    select: { id: true }
  })
  const orgIds = orgs.map(o => o.id)

  const deleted = await prisma.partido.deleteMany({ where: { organizadorId: { in: orgIds } } })
  await prisma.usuario.deleteMany({ where: { id: { in: orgIds } } })

  return NextResponse.json({ data: { deleted: deleted.count } })
}
