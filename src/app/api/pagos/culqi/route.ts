import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

const CULQI_SECRET = process.env.CULQI_SECRET_KEY || ''
const PRECIO_DESTACADO = 500 // S/5.00 en centavos

async function crearCargo(token: string, monto: number, descripcion: string, email: string) {
  const res = await fetch('https://api.culqi.com/v2/charges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CULQI_SECRET}`,
    },
    body: JSON.stringify({
      amount: monto,
      currency_code: 'PEN',
      description: descripcion,
      email,
      source_id: token,
    }),
  })
  return res.json()
}

export async function POST(req: NextRequest) {
  const authToken = getTokenFromRequest(req)
  if (!authToken) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(authToken)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { culqiToken, partidoId, tipo } = await req.json()

  if (!culqiToken || !partidoId || !tipo) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: payload.userId } })
  if (!usuario) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  const partido = await prisma.partido.findUnique({ where: { id: partidoId } })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  if (tipo === 'destacado') {
    // Charge via Culqi
    const cargo = await crearCargo(
      culqiToken,
      PRECIO_DESTACADO,
      `Partido destacado: ${partido.titulo}`,
      usuario.email
    )

    if (cargo.object === 'error') {
      return NextResponse.json({ error: cargo.user_message || 'Error al procesar pago' }, { status: 400 })
    }

    // Mark as featured
    await prisma.$transaction([
      prisma.partido.update({ where: { id: partidoId }, data: { destacado: true } }),
      prisma.alertaDestacada.upsert({
        where: { partidoId },
        create: { partidoId, monto: 5, pagado: true },
        update: { pagado: true },
      }),
    ])

    return NextResponse.json({
      data: {
        mensaje: '¡Partido destacado exitosamente!',
        chargeId: cargo.id,
      }
    })
  }

  return NextResponse.json({ error: 'Tipo de pago no válido' }, { status: 400 })
}
