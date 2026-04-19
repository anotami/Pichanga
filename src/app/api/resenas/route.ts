import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { PUNTOS_POR_RATING } from '@/lib/constants'

export async function POST(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { jugadorId, rating, comentario, partidoId } = await request.json()

  if (!jugadorId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Datos de reseña inválidos' }, { status: 400 })
  }
  if (jugadorId === payload.userId) {
    return NextResponse.json({ error: 'No puedes reseñarte a ti mismo' }, { status: 400 })
  }

  const resena = await prisma.resena.create({
    data: { jugadorId, autorId: payload.userId, rating: parseInt(rating), comentario, partidoId },
    include: { autor: { select: { id: true, nombre: true } } }
  })

  const todasResenas = await prisma.resena.findMany({ where: { jugadorId } })
  const nuevoRating = todasResenas.reduce((sum, r) => sum + r.rating, 0) / todasResenas.length
  const puntosGanados = PUNTOS_POR_RATING[rating as keyof typeof PUNTOS_POR_RATING] ?? 0

  await prisma.jugadorPerfil.updateMany({
    where: { usuarioId: jugadorId },
    data: {
      rating: Math.round(nuevoRating * 10) / 10,
      totalResenas: todasResenas.length,
      puntos: { increment: puntosGanados }
    }
  })

  return NextResponse.json({ data: resena }, { status: 201 })
}
