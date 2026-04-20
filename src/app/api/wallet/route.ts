import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const [wallet, transacciones] = await Promise.all([
    prisma.wallet.upsert({
      where: { usuarioId: payload.userId },
      create: { usuarioId: payload.userId, saldo: 0 },
      update: {},
    }),
    prisma.transaccion.findMany({
      where: { jugadorId: payload.userId },
      include: { partido: { select: { titulo: true, distrito: true, fecha: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ])

  const pendiente = transacciones
    .filter(t => t.status === 'PENDIENTE')
    .reduce((s, t) => s + t.neto, 0)

  return NextResponse.json({ data: { wallet, transacciones, pendiente } })
}

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { accion, monto } = await req.json()

  if (accion === 'retirar') {
    const wallet = await prisma.wallet.findUnique({ where: { usuarioId: payload.userId } })
    if (!wallet || wallet.saldo < monto) {
      return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 })
    }
    await prisma.wallet.update({
      where: { usuarioId: payload.userId },
      data: { saldo: { decrement: monto } },
    })
    return NextResponse.json({ data: { mensaje: `Retiro de ${monto} procesado (simulado)` } })
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}
