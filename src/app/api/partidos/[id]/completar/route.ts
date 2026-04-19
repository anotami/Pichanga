import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const partido = await prisma.partido.findUnique({
    where: { id: params.id },
    include: { solicitudes: { where: { status: 'ACEPTADO' } } }
  })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
  if (partido.organizadorId !== payload.userId) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  await prisma.partido.update({
    where: { id: params.id },
    data: { status: 'COMPLETADO', completado: true }
  })

  // Marcar asistencia pendiente en las solicitudes aceptadas
  await prisma.solicitud.updateMany({
    where: { partidoId: params.id, status: 'ACEPTADO', asistio: null },
    data: { asistio: true }
  })

  return NextResponse.json({ data: { mensaje: 'Partido completado. Ahora puedes calificar a los jugadores.' } })
}
