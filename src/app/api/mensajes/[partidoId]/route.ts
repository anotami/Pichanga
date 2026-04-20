import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: { partidoId: string } }) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

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
    include: {
      solicitudes: { where: { status: 'ACEPTADO' }, select: { jugadorId: true } },
    }
  })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  const esOrganizador = partido.organizadorId === payload.userId
  const esJugadorAceptado = partido.solicitudes.some(s => s.jugadorId === payload.userId)
  if (!esOrganizador && !esJugadorAceptado) {
    return NextResponse.json({ error: 'No puedes enviar mensajes en este partido' }, { status: 403 })
  }

  // Chat expires 24h after match
  const chatExpirado = partido.status === 'COMPLETADO' &&
    (new Date().getTime() - new Date(partido.fecha).getTime()) > 24 * 60 * 60 * 1000
  if (chatExpirado) {
    return NextResponse.json({ error: 'El chat cerró 24 horas después del partido' }, { status: 403 })
  }

  const autor = await prisma.usuario.findUnique({ where: { id: payload.userId }, select: { nombre: true } })

  const mensaje = await prisma.mensaje.create({
    data: { partidoId: params.partidoId, autorId: payload.userId, texto: texto.trim() },
    include: { autor: { select: { id: true, nombre: true } } }
  })

  // Notify all participants except sender
  const participantes = [
    partido.organizadorId,
    ...partido.solicitudes.map(s => s.jugadorId)
  ].filter(id => id !== payload.userId)

  if (participantes.length > 0) {
    await prisma.notificacion.createMany({
      data: participantes.map(uid => ({
        usuarioId: uid,
        tipo: 'NUEVO_MENSAJE',
        titulo: `Mensaje de ${autor?.nombre ?? 'Alguien'}`,
        mensaje: texto.trim().substring(0, 100),
        link: `/partidos/${params.partidoId}`,
      })),
      skipDuplicates: true,
    })
  }

  return NextResponse.json({ data: mensaje }, { status: 201 })
}
