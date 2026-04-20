import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

function isAdmin(request: Request) {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return false
  try {
    const p = jwt.verify(auth.substring(7), process.env.JWT_SECRET || 'pichanga-secret') as { role: string }
    return p.role === 'admin'
  } catch { return false }
}

export async function GET(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const strikes = await prisma.strike.findMany({
    include: {
      jugador: { select: { id: true, nombre: true, email: true, baneoHasta: true, totalStrikes: true } },
      reportadoPor: { select: { id: true, nombre: true } },
      partido: { select: { id: true, titulo: true, distrito: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  const baneados = await prisma.usuario.findMany({
    where: { baneoHasta: { gt: new Date() } },
    include: { perfil: { select: { posicion: true, distrito: true } } },
    orderBy: { baneoHasta: 'asc' }
  })

  return NextResponse.json({ data: { strikes, baneados } })
}
