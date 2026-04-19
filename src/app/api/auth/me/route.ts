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
    include: { perfil: true, club: true }
  })
  if (!usuario) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  return NextResponse.json({
    data: {
      id: usuario.id, email: usuario.email, nombre: usuario.nombre,
      tipo: usuario.tipo, codigoReferido: usuario.codigoReferido, telefono: usuario.telefono,
      perfil: usuario.perfil ? { ...usuario.perfil, disponibilidad: JSON.parse(usuario.perfil.disponibilidad) } : null,
      club: usuario.club
    }
  })
}
