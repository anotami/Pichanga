import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(req)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { asistencias } = await req.json()
  // asistencias: Array<{ solicitudId: string; asistio: boolean }>

  const partido = await prisma.partido.findUnique({ where: { id: params.id } })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
  if (partido.organizadorId !== payload.userId) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  for (const a of asistencias) {
    await prisma.solicitud.update({
      where: { id: a.solicitudId },
      data: { asistio: a.asistio },
    })
  }

  return NextResponse.json({ data: { mensaje: 'Asistencia registrada' } })
}
