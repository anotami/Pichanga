import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const usuario = await prisma.usuario.findUnique({ where: { id: payload.userId }, include: { perfil: true } })
  if (!usuario) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  if (usuario.tipo === 'JUGADOR') {
    const [solicitudes, transacciones, resenas] = await Promise.all([
      prisma.solicitud.findMany({
        where: { jugadorId: payload.userId },
        include: { partido: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.transaccion.findMany({
        where: { jugadorId: payload.userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.resena.findMany({
        where: { jugadorId: payload.userId },
        include: { autor: { select: { id: true, nombre: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ])

    const totalGanado = transacciones.filter(t => t.status === 'PAGADO').reduce((sum, t) => sum + t.neto, 0)
    const totalPendiente = transacciones.filter(t => t.status === 'PENDIENTE').reduce((sum, t) => sum + t.neto, 0)

    return NextResponse.json({
      data: {
        tipo: 'JUGADOR',
        perfil: usuario.perfil ? { ...usuario.perfil, disponibilidad: JSON.parse(usuario.perfil.disponibilidad) } : null,
        solicitudes: solicitudes.map(s => ({ ...s, partido: { ...s.partido, posiciones: JSON.parse(s.partido.posiciones) } })),
        transacciones,
        resenas,
        stats: { totalGanado, totalPendiente, totalPartidos: usuario.perfil?.totalPartidos ?? 0, rating: usuario.perfil?.rating ?? 0, puntos: usuario.perfil?.puntos ?? 0 }
      }
    })
  }

  const partidos = await prisma.partido.findMany({
    where: { organizadorId: payload.userId },
    include: { _count: { select: { solicitudes: true } }, solicitudes: { where: { status: 'PENDIENTE' } } },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  return NextResponse.json({
    data: {
      tipo: usuario.tipo,
      partidos: partidos.map(p => ({ ...p, posiciones: JSON.parse(p.posiciones) })),
      stats: {
        totalPartidos: partidos.length,
        partidosAbiertos: partidos.filter(p => p.status === 'ABIERTO').length,
        solicitudesPendientes: partidos.reduce((sum, p) => sum + p.solicitudes.length, 0)
      }
    }
  })
}
