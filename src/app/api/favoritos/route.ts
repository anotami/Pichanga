import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'

function getUserId(request: Request): string | null {
  try {
    const auth = request.headers.get('authorization') ?? ''
    const payload = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET) as { id: string }
    return payload.id
  } catch { return null }
}

export async function GET(request: Request) {
  const userId = getUserId(request)
  if (!userId) return NextResponse.json({ data: [] })

  const favs = await prisma.favorito.findMany({
    where: { usuarioId: userId },
    include: {
      perfil: {
        select: {
          id: true, posicion: true, precio: true, rating: true, puntos: true,
          distrito: true, totalPartidos: true, totalResenas: true, verificado: true,
          usuarioId: true,
          usuario: { select: { nombre: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ data: favs.map(f => f.perfil) })
}

export async function POST(request: Request) {
  const userId = getUserId(request)
  if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { perfilId } = await request.json()
  if (!perfilId) return NextResponse.json({ error: 'perfilId requerido' }, { status: 400 })

  await prisma.favorito.upsert({
    where: { usuarioId_perfilId: { usuarioId: userId, perfilId } },
    create: { usuarioId: userId, perfilId },
    update: {},
  })

  return NextResponse.json({ ok: true })
}
