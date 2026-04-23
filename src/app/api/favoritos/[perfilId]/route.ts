import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'

export async function DELETE(request: Request, { params }: { params: { perfilId: string } }) {
  try {
    const auth = request.headers.get('authorization') ?? ''
    const payload = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET) as { id: string }
    await prisma.favorito.delete({
      where: { usuarioId_perfilId: { usuarioId: payload.id, perfilId: params.perfilId } },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
}
