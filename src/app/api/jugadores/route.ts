import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const posicion = searchParams.get('posicion')
  const distrito = searchParams.get('distrito')
  const precioMax = searchParams.get('precioMax')
  const nivel = searchParams.get('nivel')
  const busqueda = searchParams.get('q')

  const verificado = searchParams.get('verificado')

  const deporte = searchParams.get('deporte')

  const where: Record<string, unknown> = { esNPC: false }
  if (deporte) where.deporte = deporte
  if (posicion) where.posicion = posicion
  if (distrito) where.distrito = { contains: distrito }
  if (precioMax) where.precio = { lte: parseFloat(precioMax) }
  if (nivel) where.nivel = nivel
  if (verificado === 'true') where.verificado = true

  const perfiles = await prisma.jugadorPerfil.findMany({
    where,
    select: {
      id: true, usuarioId: true, deporte: true, posicion: true, posicionSecundaria: true,
      nivel: true, piernaHabil: true, edad: true, altura: true, distrito: true,
      descripcion: true, precio: true, puntos: true, rating: true, ratingPuntualidad: true,
      ratingNivel: true, ratingActitud: true, totalResenas: true, totalPartidos: true,
      foto: true, disponibilidad: true, radioAccion: true, verificado: true, createdAt: true,
      usuario: { select: { id: true, nombre: true, tipo: true, baneoHasta: true } }
    },
    orderBy: [{ rating: 'desc' }, { puntos: 'desc' }]
  })

  const ahora = new Date()
  const resultado = perfiles
    .filter(p => !p.usuario.baneoHasta || new Date(p.usuario.baneoHasta) < ahora)
    .map(p => ({ ...p, disponibilidad: JSON.parse(p.disponibilidad) }))
    .filter(p => !busqueda ||
      p.usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.distrito.toLowerCase().includes(busqueda.toLowerCase())
    )

  return NextResponse.json({ data: resultado })
}
