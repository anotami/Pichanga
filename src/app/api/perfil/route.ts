import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function PUT(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const body = await request.json()
  const { posicion, distrito, descripcion, precio, disponibilidad, foto } = body

  const perfil = await prisma.jugadorPerfil.upsert({
    where: { usuarioId: payload.userId },
    create: {
      usuarioId: payload.userId,
      posicion, distrito, descripcion, precio: parseFloat(precio),
      foto, disponibilidad: JSON.stringify(disponibilidad ?? [])
    },
    update: {
      posicion, distrito, descripcion, precio: parseFloat(precio),
      foto, disponibilidad: JSON.stringify(disponibilidad ?? [])
    }
  })

  return NextResponse.json({ data: { ...perfil, disponibilidad: JSON.parse(perfil.disponibilidad) } })
}

export async function POST(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const body = await request.json()
  const { nombre, distrito, descripcion, telefono } = body

  const usuario = await prisma.usuario.update({
    where: { id: payload.userId },
    data: { nombre, telefono }
  })

  if (usuario.tipo === 'CLUB') {
    await prisma.club.upsert({
      where: { usuarioId: payload.userId },
      create: { usuarioId: payload.userId, nombre: body.nombreClub || nombre, distrito, descripcion, telefono },
      update: { nombre: body.nombreClub || nombre, distrito, descripcion, telefono }
    })
  }

  return NextResponse.json({ data: { mensaje: 'Perfil actualizado' } })
}
