import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

function isAdmin(request: Request) {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return false
  try {
    const payload = jwt.verify(auth.substring(7), process.env.JWT_SECRET || 'pichanga-secret') as { role: string }
    return payload.role === 'admin'
  } catch { return false }
}

export async function GET(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const [totalUsuarios, totalJugadores, totalOrganizadores, totalClubes,
    totalPartidos, partidosAbiertos, partidosCompletados,
    totalSolicitudes, solicitudesAceptadas,
    totalTransacciones, totalStrikes, baneados] = await Promise.all([
    prisma.usuario.count(),
    prisma.usuario.count({ where: { tipo: 'JUGADOR' } }),
    prisma.usuario.count({ where: { tipo: 'ORGANIZADOR' } }),
    prisma.usuario.count({ where: { tipo: 'CLUB' } }),
    prisma.partido.count(),
    prisma.partido.count({ where: { status: 'ABIERTO' } }),
    prisma.partido.count({ where: { status: 'COMPLETADO' } }),
    prisma.solicitud.count(),
    prisma.solicitud.count({ where: { status: 'ACEPTADO' } }),
    prisma.transaccion.count(),
    prisma.strike.count(),
    prisma.usuario.count({ where: { baneoHasta: { gt: new Date() } } }),
  ])

  const ingresos = await prisma.transaccion.aggregate({
    where: { status: 'PAGADO' },
    _sum: { comision: true, monto: true }
  })

  const jugadoresPorPosicion = await prisma.jugadorPerfil.groupBy({
    by: ['posicion'], _count: true, _avg: { rating: true, precio: true }
  })

  const partidosPorDistrito = await prisma.partido.groupBy({
    by: ['distrito'], _count: true, orderBy: { _count: { distrito: 'desc' } }, take: 10
  })

  const registrosRecientes = await prisma.usuario.findMany({
    orderBy: { createdAt: 'desc' }, take: 5,
    select: { id: true, nombre: true, tipo: true, createdAt: true }
  })

  return NextResponse.json({
    data: {
      usuarios: { total: totalUsuarios, jugadores: totalJugadores, organizadores: totalOrganizadores, clubes: totalClubes, baneados },
      partidos: { total: totalPartidos, abiertos: partidosAbiertos, completados: partidosCompletados },
      solicitudes: { total: totalSolicitudes, aceptadas: solicitudesAceptadas },
      transacciones: { total: totalTransacciones },
      strikes: { total: totalStrikes },
      ingresos: { comisiones: ingresos._sum.comision ?? 0, volumen: ingresos._sum.monto ?? 0 },
      jugadoresPorPosicion,
      partidosPorDistrito,
      registrosRecientes
    }
  })
}
