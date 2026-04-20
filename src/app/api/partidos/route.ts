import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const distrito = searchParams.get('distrito')
  const modalidad = searchParams.get('modalidad')
  const posicion = searchParams.get('posicion')
  const status = searchParams.get('status') ?? 'ABIERTO'

  const partidos = await prisma.partido.findMany({
    where: {
      status,
      ...(distrito ? { distrito: { contains: distrito } } : {}),
      ...(modalidad ? { modalidad } : {})
    },
    include: {
      organizador: { select: { id: true, nombre: true } },
      club: true,
      _count: { select: { solicitudes: true } }
    },
    orderBy: { fecha: 'asc' }
  })

  const resultado = partidos.map(p => ({
    ...p,
    posiciones: JSON.parse(p.posiciones)
  })).filter(p => {
    if (!posicion) return true
    return p.posiciones.some((pos: { posicion: string }) => pos.posicion === posicion)
  })

  return NextResponse.json({ data: resultado })
}

export async function POST(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const body = await request.json()
  const { titulo, descripcion, distrito, direccion, fecha, duracion, modalidad, posiciones, presupuestoMax, clubId, nivelRequerido } = body

  if (!titulo || !distrito || !fecha || !modalidad || !posiciones) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const partido = await prisma.partido.create({
    data: {
      organizadorId: payload.userId,
      clubId: clubId || null,
      titulo, descripcion, distrito, direccion,
      fecha: new Date(fecha),
      duracion: parseInt(duracion),
      modalidad,
      nivelRequerido: nivelRequerido ?? 'AMATEUR',
      posiciones: JSON.stringify(posiciones),
      presupuestoMax: presupuestoMax ? parseFloat(presupuestoMax) : null
    },
    include: { organizador: { select: { id: true, nombre: true } }, club: true }
  })

  return NextResponse.json({ data: { ...partido, posiciones: JSON.parse(partido.posiciones) } }, { status: 201 })
}
