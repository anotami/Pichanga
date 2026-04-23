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
  const { searchParams } = new URL(request.url)
  const deporte = searchParams.get('deporte')
  const distrito = searchParams.get('distrito')
  const superficie = searchParams.get('superficie')
  const tamano = searchParams.get('tamano')
  const soloDisponibles = searchParams.get('disponible') !== 'false'

  const canchas = await prisma.cancha.findMany({
    where: {
      ...(soloDisponibles ? { disponible: true } : {}),
      ...(deporte ? { OR: [{ deporte }, { deporte: 'AMBOS' }] } : {}),
      ...(distrito ? { distrito: { contains: distrito } } : {}),
      ...(superficie ? { superficie } : {}),
      ...(tamano ? { tamano } : {}),
    },
    orderBy: [{ distrito: 'asc' }, { nombre: 'asc' }]
  })

  return NextResponse.json({ data: canchas })
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const cancha = await prisma.cancha.create({ data: body })
  return NextResponse.json({ data: cancha }, { status: 201 })
}
