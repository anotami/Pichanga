import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function POST(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { partidoId, rating, comentario } = await request.json()
  if (!partidoId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const partido = await prisma.partido.findUnique({ where: { id: partidoId } })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  if (new Date(partido.fecha) > new Date()) {
    return NextResponse.json({ error: 'El partido aún no se jugó' }, { status: 400 })
  }

  const solicitud = await prisma.solicitud.findFirst({
    where: { partidoId, jugadorId: payload.userId, status: 'ACEPTADO' }
  })
  if (!solicitud) {
    return NextResponse.json({ error: 'No participaste en este partido' }, { status: 403 })
  }

  const existente = await prisma.resenaOrganizador.findUnique({
    where: { autorId_partidoId: { autorId: payload.userId, partidoId } }
  })
  if (existente) return NextResponse.json({ error: 'Ya calificaste a este organizador' }, { status: 409 })

  const resena = await prisma.resenaOrganizador.create({
    data: {
      organizadorId: partido.organizadorId,
      autorId: payload.userId,
      partidoId,
      rating,
      comentario: comentario?.trim() || null
    }
  })

  return NextResponse.json({ data: resena }, { status: 201 })
}
