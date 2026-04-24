import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const usuario = await prisma.usuario.findUnique({
    where: { id: payload.userId },
    select: { codigoReferido: true }
  })
  if (!usuario) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  const referidos = await prisma.usuario.findMany({
    where: { referidoPorId: payload.userId },
    select: { id: true, nombre: true, createdAt: true }
  })

  // 50 pts per referred user (awarded at registration)
  const puntosReferidos = referidos.length * 50

  return NextResponse.json({
    data: {
      codigoReferido: usuario.codigoReferido,
      referidos,
      totalReferidos: referidos.length,
      puntosReferidos,
      shareUrl: `https://pichanga.pe/registro?ref=${usuario.codigoReferido}`
    }
  })
}
