import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const notificaciones = await prisma.notificacion.findMany({
    where: { usuarioId: payload.userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const noLeidas = notificaciones.filter(n => !n.leida).length

  return NextResponse.json({ data: { notificaciones, noLeidas } })
}

export async function PATCH(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  await prisma.notificacion.updateMany({
    where: { usuarioId: payload.userId, leida: false },
    data: { leida: true },
  })

  return NextResponse.json({ data: { mensaje: 'Todas marcadas como leídas' } })
}
