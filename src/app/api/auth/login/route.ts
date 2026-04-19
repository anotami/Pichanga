import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { perfil: true, club: true }
    })

    if (!usuario || !(await comparePassword(password, usuario.password))) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    const token = generateToken(usuario.id)
    return NextResponse.json({
      data: {
        token,
        usuario: {
          id: usuario.id, email: usuario.email, nombre: usuario.nombre,
          tipo: usuario.tipo, codigoReferido: usuario.codigoReferido,
          telefono: usuario.telefono,
          perfil: usuario.perfil ? {
            ...usuario.perfil,
            disponibilidad: JSON.parse(usuario.perfil.disponibilidad)
          } : null,
          club: usuario.club
        }
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
