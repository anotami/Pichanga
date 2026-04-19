import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: { partidoId: string } }) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  // Verificar que el usuario es parte del partido
  const partido = await prisma.partido.findUnique({
    where: { id: params.partidoId },
    include: { solicitudes: { where: { status: 'ACEPTADO', jugadorId: payload.userId } } }
  })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  const esOrganizador = partido.organizadorId === payload.userId
  const esJugadorAceptado = partido.solicitudes.length > 0

  if (!esOrganizador && !esJugadorAceptado) {
    return NextResponse.json({ error: 'No eres parte de este partido' }, { status: 403 })
  }

  const mensajes = await prisma.mensaje.findMany({
    where: { partidoId: params.partidoId },
    include: { autor: { select: { id: true, nombre: true } } },
    orderBy: { createdAt: 'asc' }
  })

  return NextResponse.json({ data: mensajes })
}

export async function POST(request: Request, { params }: { params: { partidoId: string } }) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { texto } = await request.json()
  if (!texto?.trim()) return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 })

  const partido = await prisma.partido.findUnique({
    where: { id: params.partidoId },
    include: { solicitudes: { where: { status: 'ACEPTADO', jugadorId: payload.userId } } }
  })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  const esOrganizador = partido.organizadorId === payload.userId
  const esJugadorAceptado = partido.solicitudes.length > 0
  if (!esOrganizador && !esJugadorAceptado) {
    return NextResponse.json({ error: 'No puedes enviar mensajes en este partido' }, { status: 403 })
  }

  const mensaje = await prisma.mensaje.create({
    data: { partidoId: params.partidoId, autorId: payload.userId, texto: texto.trim() },
    include: { autor: { select: { id: true, nombre: true } } }
  })

  return NextResponse.json({ data: mensaje }, { status: 201 })
}
