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

  // Mark attendance as attended for accepted players
  await prisma.solicitud.updateMany({
    where: { partidoId: params.id, status: 'ACEPTADO', asistio: null },
    data: { asistio: true }
  })

  // Confirm transactions and credit wallet for each accepted player
  const transacciones = await prisma.transaccion.findMany({
    where: { partidoId: params.id, status: 'PENDIENTE' }
  })

  for (const tx of transacciones) {
    await prisma.transaccion.update({ where: { id: tx.id }, data: { status: 'PAGADO' } })
    await prisma.wallet.upsert({
      where: { usuarioId: tx.jugadorId },
      create: { usuarioId: tx.jugadorId, saldo: tx.neto },
      update: { saldo: { increment: tx.neto } },
    })
    await prisma.notificacion.create({
      data: {
        usuarioId: tx.jugadorId,
        tipo: 'PARTIDO_COMPLETADO',
        titulo: '¡Pago acreditado!',
        mensaje: `Se acreditaron S/${tx.neto.toFixed(2)} en tu billetera por el partido "${partido.titulo}".`,
        link: '/wallet',
      },
    })
  }

  // Notify all accepted players about completion
  for (const s of partido.solicitudes) {
    const yaTieneNotif = transacciones.some(t => t.jugadorId === s.jugadorId)
    if (!yaTieneNotif) {
      await prisma.notificacion.create({
        data: {
          usuarioId: s.jugadorId,
          tipo: 'PARTIDO_COMPLETADO',
          titulo: 'Partido completado',
          mensaje: `El partido "${partido.titulo}" ha sido marcado como completado. Puedes dejar tu reseña.`,
          link: `/partidos/${params.id}`,
        },
      })
    }
  }

  return NextResponse.json({ data: { mensaje: 'Partido completado. Pagos acreditados a los jugadores.' } })
}
