import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function PUT(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const body = await request.json()

  // Club profile update via PUT
  if (body.tipo === 'club') {
    const { nombre, distrito, descripcion, telefono } = body
    const club = await prisma.club.upsert({
      where: { usuarioId: payload.userId },
      create: { usuarioId: payload.userId, nombre, distrito, descripcion, telefono },
      update: { nombre, distrito, descripcion, telefono },
    })
    return NextResponse.json({ data: club })
  }

  const { posicion, posicionSecundaria, nivel, piernaHabil, edad, altura, distrito, descripcion, precio, disponibilidad, foto, radioAccion, deporte } = body

  const perfil = await prisma.jugadorPerfil.upsert({
    where: { usuarioId: payload.userId },
    create: {
      usuarioId: payload.userId,
      deporte: deporte ?? 'FUTBOL',
      posicion, posicionSecundaria, nivel: nivel ?? 'AMATEUR',
      piernaHabil: piernaHabil ?? 'DERECHA',
      edad: edad ? parseInt(edad) : null,
      altura: altura ? parseInt(altura) : null,
      distrito, descripcion, precio: parseFloat(precio),
      foto, disponibilidad: JSON.stringify(disponibilidad ?? []),
      radioAccion: radioAccion ? parseInt(radioAccion) : 10,
    },
    update: {
      deporte: deporte ?? undefined,
      posicion, posicionSecundaria, nivel,
      piernaHabil, edad: edad ? parseInt(edad) : null,
      altura: altura ? parseInt(altura) : null,
      distrito, descripcion, precio: parseFloat(precio),
      foto, disponibilidad: JSON.stringify(disponibilidad ?? []),
      radioAccion: radioAccion ? parseInt(radioAccion) : undefined,
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
  const { nombre, distrito, descripcion, telefono, nombreClub } = body

  const usuario = await prisma.usuario.update({
    where: { id: payload.userId },
    data: { nombre, telefono }
  })

  if (usuario.tipo === 'CLUB') {
    await prisma.club.upsert({
      where: { usuarioId: payload.userId },
      create: { usuarioId: payload.userId, nombre: nombreClub || nombre, distrito, descripcion, telefono },
      update: { nombre: nombreClub || nombre, distrito, descripcion, telefono }
    })
  }

  return NextResponse.json({ data: { mensaje: 'Perfil actualizado' } })
}
