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

  const [transacciones, resumenIngresos, alertasDestacadas] = await Promise.all([
    prisma.transaccion.findMany({
      include: {
        jugador: { select: { nombre: true, email: true } },
        partido: { select: { titulo: true, distrito: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 200
    }),
    prisma.transaccion.aggregate({ _sum: { comision: true, monto: true, neto: true }, _count: true }),
    prisma.alertaDestacada.findMany({
      include: { partido: { select: { titulo: true, distrito: true } } },
      orderBy: { createdAt: 'desc' }
    })
  ])

  return NextResponse.json({ data: { transacciones, resumenIngresos, alertasDestacadas } })
}
