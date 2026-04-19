import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const partido = await prisma.partido.findUnique({
    where: { id: params.id },
    include: {
      organizador: { select: { id: true, nombre: true, email: true, telefono: true } },
      club: true,
      solicitudes: {
        include: {
          jugador: {
            select: { id: true, nombre: true, perfil: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  return NextResponse.json({
    data: {
      ...partido,
      posiciones: JSON.parse(partido.posiciones),
      solicitudes: partido.solicitudes.map(s => ({
        ...s,
        jugador: s.jugador.perfil
          ? { ...s.jugador, perfil: { ...s.jugador.perfil, disponibilidad: JSON.parse(s.jugador.perfil.disponibilidad) } }
          : s.jugador
      }))
    }
  })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const partido = await prisma.partido.findUnique({ where: { id: params.id } })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
  if (partido.organizadorId !== payload.userId) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { status } = await request.json()
  const updated = await prisma.partido.update({ where: { id: params.id }, data: { status } })
  return NextResponse.json({ data: { ...updated, posiciones: JSON.parse(updated.posiciones) } })
}
