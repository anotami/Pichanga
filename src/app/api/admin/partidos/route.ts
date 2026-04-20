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

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const partidos = await prisma.partido.findMany({
    where: status ? { status } : {},
    include: {
      organizador: { select: { id: true, nombre: true, tipo: true } },
      club: { select: { nombre: true } },
      _count: { select: { solicitudes: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  })

  return NextResponse.json({
    data: partidos.map(p => ({ ...p, posiciones: JSON.parse(p.posiciones) }))
  })
}
