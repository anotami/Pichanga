import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { partidoId, rating, ratingOrg, ratingCuota, ratingAmbiente, comentario } = await req.json()
  if (!partidoId || !rating) return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })

  // Verify user participated (accepted solicitud) or is organizer
  const partido = await prisma.partido.findUnique({
    where: { id: partidoId },
    include: { solicitudes: { where: { jugadorId: payload.userId, status: 'ACEPTADO' } } }
  })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  const esParte = partido.organizadorId !== payload.userId && partido.solicitudes.length === 0
  if (esParte) return NextResponse.json({ error: 'No participaste en este partido' }, { status: 403 })
  if (partido.status !== 'COMPLETADO') return NextResponse.json({ error: 'El partido no ha terminado' }, { status: 400 })

  const resena = await prisma.resenaPartido.upsert({
    where: { partidoId_autorId: { partidoId, autorId: payload.userId } },
    create: { partidoId, autorId: payload.userId, rating, ratingOrg: ratingOrg ?? 5, ratingCuota: ratingCuota ?? 5, ratingAmbiente: ratingAmbiente ?? 5, comentario },
    update: { rating, ratingOrg: ratingOrg ?? 5, ratingCuota: ratingCuota ?? 5, ratingAmbiente: ratingAmbiente ?? 5, comentario },
  })

  return NextResponse.json({ data: resena }, { status: 201 })
}
