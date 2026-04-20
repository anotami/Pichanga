import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const solicitudes = await prisma.solicitud.findMany({
    where: { jugadorId: payload.userId },
    include: {
      partido: {
        select: {
          id: true, titulo: true, distrito: true, fecha: true, modalidad: true, status: true,
          organizador: { select: { nombre: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ data: solicitudes })
}
