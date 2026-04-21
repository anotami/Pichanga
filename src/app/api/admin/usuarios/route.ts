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

  const { searchParams } = new URL(request.url)
  const tipo = searchParams.get('tipo')
  const baneados = searchParams.get('baneados')
  const busqueda = searchParams.get('q')
  const npc = searchParams.get('npc')

  const usuarios = await prisma.usuario.findMany({
    where: {
      ...(tipo ? { tipo } : {}),
      ...(baneados === 'true' ? { baneoHasta: { gt: new Date() } } : {}),
      ...(npc === 'true' ? { perfil: { esNPC: true } } : {}),
      ...(npc === 'false' ? { perfil: { esNPC: false } } : {}),
      ...(busqueda ? { OR: [{ nombre: { contains: busqueda } }, { email: { contains: busqueda } }] } : {})
    },
    include: { perfil: true, _count: { select: { solicitudes: true, partidosOrg: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100
  })

  return NextResponse.json({
    data: usuarios.map(u => ({
      ...u, password: undefined,
      perfil: u.perfil ? { ...u.perfil, disponibilidad: JSON.parse(u.perfil.disponibilidad) } : null
    }))
  })
}
