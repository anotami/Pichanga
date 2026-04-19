import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const posicion = searchParams.get('posicion')
  const distrito = searchParams.get('distrito')
  const precioMax = searchParams.get('precioMax')
  const busqueda = searchParams.get('q')

  const where: Record<string, unknown> = {}
  if (posicion) where.posicion = posicion
  if (distrito) where.distrito = { contains: distrito }
  if (precioMax) where.precio = { lte: parseFloat(precioMax) }

  const perfiles = await prisma.jugadorPerfil.findMany({
    where,
    include: {
      usuario: { select: { id: true, nombre: true, email: true, tipo: true } }
    },
    orderBy: [{ rating: 'desc' }, { puntos: 'desc' }]
  })

  const resultado = perfiles
    .map(p => ({ ...p, disponibilidad: JSON.parse(p.disponibilidad) }))
    .filter(p => !busqueda || p.usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.distrito.toLowerCase().includes(busqueda.toLowerCase()))

  return NextResponse.json({ data: resultado })
}
