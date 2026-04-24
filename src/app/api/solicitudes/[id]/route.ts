import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { COMISION_PLATAFORMA } from '@/lib/constants'
import { sendSolicitudAceptada, sendSolicitudRechazada, sendSolicitudCancelada } from '@/lib/email'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const solicitud = await prisma.solicitud.findUnique({
    where: { id: params.id },
    include: {
      partido: true,
      jugador: { select: { id: true, nombre: true, email: true } }
    }
  })
  if (!solicitud) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })

  const { status } = await request.json()

  // Player cancels their own accepted solicitud
  if (status === 'CANCELADO') {
    if (solicitud.jugadorId !== payload.userId) {
      return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
    }
    if (solicitud.status !== 'ACEPTADO') {
      return NextResponse.json({ error: 'Solo podés cancelar solicitudes aceptadas' }, { status: 400 })
    }

    const horasHastaPartido = (new Date(solicitud.partido.fecha).getTime() - Date.now()) / 3600000
    const penalizar = horasHastaPartido < 24

    const updated = await prisma.solicitud.update({
      where: { id: params.id },
      data: { status: 'CANCELADO', canceladoA: new Date(), penalizado: penalizar }
    })

    if (penalizar) {
      await prisma.jugadorPerfil.updateMany({
        where: { usuarioId: payload.userId },
        data: { puntos: { decrement: 20 } }
      })
    }

    // Decrement totalPartidos since it was incremented on accept
    await prisma.jugadorPerfil.updateMany({
      where: { usuarioId: payload.userId },
      data: { totalPartidos: { decrement: 1 } }
    })

    // Notify organizer
    await prisma.notificacion.create({
      data: {
        usuarioId: solicitud.partido.organizadorId,
        tipo: 'SOLICITUD_RECHAZADA',
        titulo: 'Jugador canceló su participación',
        mensaje: `${solicitud.jugador.nombre} canceló su participación en "${solicitud.partido.titulo}".${penalizar ? ' (menos de 24h antes del partido)' : ''}`,
        link: `/partidos/${solicitud.partidoId}`,
      }
    })

    // Get organizer email for notification
    const organizador = await prisma.usuario.findUnique({
      where: { id: solicitud.partido.organizadorId },
      select: { nombre: true, email: true }
    })
    if (organizador) {
      await sendSolicitudCancelada(organizador.email, organizador.nombre, solicitud.jugador.nombre, solicitud.partido.titulo)
    }

    return NextResponse.json({ data: updated, penalizado: penalizar })
  }

  // Organizer accepts or rejects
  if (!['ACEPTADO', 'RECHAZADO'].includes(status)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }
  if (solicitud.partido.organizadorId !== payload.userId) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  }

  const updated = await prisma.solicitud.update({ where: { id: params.id }, data: { status } })

  if (status === 'ACEPTADO') {
    const comision = solicitud.precio * COMISION_PLATAFORMA
    const neto = solicitud.precio - comision
    await prisma.transaccion.create({
      data: {
        jugadorId: solicitud.jugadorId,
        partidoId: solicitud.partidoId,
        monto: solicitud.precio,
        comision,
        neto,
        status: 'PENDIENTE'
      }
    })
    await prisma.jugadorPerfil.updateMany({
      where: { usuarioId: solicitud.jugadorId },
      data: { totalPartidos: { increment: 1 } }
    })
    await prisma.notificacion.create({
      data: {
        usuarioId: solicitud.jugadorId,
        tipo: 'SOLICITUD_ACEPTADA',
        titulo: '¡Solicitud aceptada!',
        mensaje: `Tu solicitud para "${solicitud.partido.titulo}" fue aceptada. Recibirás S/${neto.toFixed(2)} al completarse.`,
        link: `/partidos/${solicitud.partidoId}`,
      },
    })
    await sendSolicitudAceptada(solicitud.jugador.email, solicitud.jugador.nombre, solicitud.partido.titulo, neto)
  } else {
    await prisma.notificacion.create({
      data: {
        usuarioId: solicitud.jugadorId,
        tipo: 'SOLICITUD_RECHAZADA',
        titulo: 'Solicitud rechazada',
        mensaje: `Tu solicitud para "${solicitud.partido.titulo}" no fue aceptada esta vez.`,
        link: `/partidos/${solicitud.partidoId}`,
      },
    })
    await sendSolicitudRechazada(solicitud.jugador.email, solicitud.jugador.nombre, solicitud.partido.titulo)
  }

  return NextResponse.json({ data: updated })
}
