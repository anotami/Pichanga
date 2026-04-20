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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { accion, dias } = await request.json()

  if (accion === 'banear') {
    const hasta = new Date()
    hasta.setDate(hasta.getDate() + (dias ?? 7))
    await prisma.usuario.update({ where: { id: params.id }, data: { baneoHasta: hasta } })
    return NextResponse.json({ data: { mensaje: `Baneado por ${dias} días` } })
  }

  if (accion === 'desbanear') {
    await prisma.usuario.update({ where: { id: params.id }, data: { baneoHasta: null, totalStrikes: 0 } })
    return NextResponse.json({ data: { mensaje: 'Baneo levantado' } })
  }

  if (accion === 'verificar') {
    await prisma.jugadorPerfil.updateMany({ where: { usuarioId: params.id }, data: { verificado: true } })
    return NextResponse.json({ data: { mensaje: 'Jugador verificado' } })
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}
