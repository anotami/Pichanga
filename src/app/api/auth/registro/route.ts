import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password, nombre, telefono, tipo, codigoReferido } = await request.json()

    if (!email || !password || !nombre || !tipo) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    const existe = await prisma.usuario.findUnique({ where: { email } })
    if (existe) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
    }

    let referidoPorId: string | undefined
    if (codigoReferido) {
      const referidor = await prisma.usuario.findUnique({ where: { codigoReferido }, include: { perfil: true } })
      if (referidor) {
        referidoPorId = referidor.id
        if (referidor.perfil) {
          await prisma.jugadorPerfil.update({
            where: { usuarioId: referidor.id },
            data: { puntos: { increment: 50 } }
          })
        }
      }
    }

    const usuario = await prisma.usuario.create({
      data: {
        email,
        password: await hashPassword(password),
        nombre,
        telefono,
        tipo,
        referidoPorId
      }
    })

    const token = generateToken(usuario.id)
    return NextResponse.json({
      data: { token, usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, tipo: usuario.tipo, codigoReferido: usuario.codigoReferido } }
    }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
