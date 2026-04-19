import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const perfil = await prisma.jugadorPerfil.findUnique({
    where: { usuarioId: params.id },
    include: {
      usuario: { select: { id: true, nombre: true, email: true, tipo: true, telefono: true, createdAt: true } }
    }
  })
  if (!perfil) return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 })

  const resenas = await prisma.resena.findMany({
    where: { jugadorId: params.id },
    include: { autor: { select: { id: true, nombre: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  return NextResponse.json({
    data: {
      ...perfil,
      disponibilidad: JSON.parse(perfil.disponibilidad),
      resenas
    }
  })
}
