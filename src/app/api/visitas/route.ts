import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'

export async function POST(request: Request) {
  try {
    const { pagina } = await request.json()
    if (!pagina || typeof pagina !== 'string') return NextResponse.json({ ok: false })
    await prisma.visita.create({ data: { pagina } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}

export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? ''
  try {
    const payload = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET) as { role?: string }
    if (payload.role !== 'admin') throw new Error()
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  const semana = new Date(); semana.setDate(semana.getDate() - 7); semana.setHours(0, 0, 0, 0)
  const mes = new Date(); mes.setDate(mes.getDate() - 30); mes.setHours(0, 0, 0, 0)

  const [total, hoyCount, semanaCount, mesCount, porPagina] = await Promise.all([
    prisma.visita.count(),
    prisma.visita.count({ where: { createdAt: { gte: hoy } } }),
    prisma.visita.count({ where: { createdAt: { gte: semana } } }),
    prisma.visita.count({ where: { createdAt: { gte: mes } } }),
    prisma.visita.groupBy({
      by: ['pagina'],
      _count: { pagina: true },
      orderBy: { _count: { pagina: 'desc' } },
      take: 10,
    }),
  ])

  return NextResponse.json({ data: { total, hoy: hoyCount, semana: semanaCount, mes: mesCount, porPagina } })
}
