import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { COMISION_PLATAFORMA } from '@/lib/constants'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const solicitud = await prisma.solicitud.findUnique({
    where: { id: params.id },
    include: { partido: true }
  })
  if (!solicitud) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
  if (solicitud.partido.organizadorId !== payload.userId) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  }

  const { status } = await request.json()
  if (!['ACEPTADO', 'RECHAZADO'].includes(status)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const updated = await prisma.solicitud.update({ where: { id: params.id }, data: { status } })

  if (status === 'ACEPTADO') {
    const comision = solicitud.precio * COMISION_PLATAFORMA
    await prisma.transaccion.create({
      data: {
        jugadorId: solicitud.jugadorId,
        partidoId: solicitud.partidoId,
        monto: solicitud.precio,
        comision,
        neto: solicitud.precio - comision,
        status: 'PENDIENTE'
      }
    })
    await prisma.jugadorPerfil.updateMany({
      where: { usuarioId: solicitud.jugadorId },
      data: { totalPartidos: { increment: 1 } }
    })
  }

  return NextResponse.json({ data: updated })
}
