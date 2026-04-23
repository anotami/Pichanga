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

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const cancha = await prisma.cancha.findUnique({ where: { id: params.id } })
  if (!cancha) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json({ data: cancha })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const body = await request.json()
  const cancha = await prisma.cancha.update({ where: { id: params.id }, data: body })
  return NextResponse.json({ data: cancha })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  await prisma.cancha.delete({ where: { id: params.id } })
  return NextResponse.json({ data: { ok: true } })
}
