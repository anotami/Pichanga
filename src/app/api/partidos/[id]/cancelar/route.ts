import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(req)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const partido = await prisma.partido.findUnique({ where: { id: params.id } })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
  if (partido.organizadorId !== payload.userId) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  if (partido.status !== 'ABIERTO') return NextResponse.json({ error: 'El partido no está abierto' }, { status: 400 })

  await prisma.partido.update({ where: { id: params.id }, data: { status: 'CANCELADO' } })

  // Notify accepted players
  const solicitudesAceptadas = await prisma.solicitud.findMany({
    where: { partidoId: params.id, status: 'ACEPTADO' },
  })
  if (solicitudesAceptadas.length > 0) {
    await prisma.notificacion.createMany({
      data: solicitudesAceptadas.map(s => ({
        usuarioId: s.jugadorId,
        tipo: 'PARTIDO_CANCELADO',
        titulo: 'Partido cancelado',
        mensaje: `El partido "${partido.titulo}" fue cancelado por el organizador.`,
        link: `/partidos/${params.id}`,
      })),
    })
  }

  return NextResponse.json({ data: { mensaje: 'Partido cancelado' } })
}
