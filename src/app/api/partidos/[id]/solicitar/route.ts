import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const usuario = await prisma.usuario.findUnique({ where: { id: payload.userId } })
  if (!usuario || usuario.tipo !== 'JUGADOR') {
    return NextResponse.json({ error: 'Solo los jugadores pueden solicitar' }, { status: 403 })
  }

  const partido = await prisma.partido.findUnique({ where: { id: params.id } })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
  if (partido.status !== 'ABIERTO') return NextResponse.json({ error: 'El partido no está abierto' }, { status: 400 })
  if (partido.organizadorId === payload.userId) return NextResponse.json({ error: 'No puedes aplicar a tu propio partido' }, { status: 400 })

  const yaAplicó = await prisma.solicitud.findUnique({
    where: { partidoId_jugadorId: { partidoId: params.id, jugadorId: payload.userId } }
  })
  if (yaAplicó) return NextResponse.json({ error: 'Ya aplicaste a este partido' }, { status: 400 })

  const { posicion, precio, mensaje } = await request.json()
  if (!posicion || !precio) return NextResponse.json({ error: 'Posición y precio requeridos' }, { status: 400 })

  const solicitud = await prisma.solicitud.create({
    data: { partidoId: params.id, jugadorId: payload.userId, posicion, precio: parseFloat(precio), mensaje },
    include: { jugador: { select: { id: true, nombre: true } } }
  })

  return NextResponse.json({ data: solicitud }, { status: 201 })
}
