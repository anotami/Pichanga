import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { PRECIO_DESTACADO } from '@/lib/constants'

export async function POST(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { partidoId } = await request.json()

  const partido = await prisma.partido.findUnique({ where: { id: partidoId } })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
  if (partido.organizadorId !== payload.userId) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const yaDestacado = await prisma.alertaDestacada.findUnique({ where: { partidoId } })
  if (yaDestacado) return NextResponse.json({ error: 'Este partido ya está destacado' }, { status: 400 })

  await prisma.$transaction([
    prisma.alertaDestacada.create({ data: { partidoId, monto: PRECIO_DESTACADO, pagado: true } }),
    prisma.partido.update({ where: { id: partidoId }, data: { destacado: true } })
  ])

  return NextResponse.json({
    data: { mensaje: `Partido destacado por S/ ${PRECIO_DESTACADO}. Aparecerá primero en los resultados.` }
  }, { status: 201 })
}
