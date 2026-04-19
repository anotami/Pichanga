import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { DIAS_BANEO_PRIMER_NO_SHOW, DIAS_BANEO_SEGUNDO_NO_SHOW } from '@/lib/constants'

export async function POST(request: Request) {
  const token = getTokenFromRequest(request)
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { jugadorId, partidoId, tipo, descripcion } = await request.json()

  const partido = await prisma.partido.findUnique({ where: { id: partidoId } })
  if (!partido) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
  if (partido.organizadorId !== payload.userId) {
    return NextResponse.json({ error: 'Solo el organizador puede reportar strikes' }, { status: 403 })
  }

  const yaExiste = await prisma.strike.findFirst({ where: { jugadorId, partidoId } })
  if (yaExiste) return NextResponse.json({ error: 'Ya reportaste a este jugador en este partido' }, { status: 400 })

  const usuario = await prisma.usuario.findUnique({ where: { id: jugadorId } })
  if (!usuario) return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 })

  const nuevoTotal = usuario.totalStrikes + 1
  const diasBaneo = nuevoTotal === 1 ? DIAS_BANEO_PRIMER_NO_SHOW : DIAS_BANEO_SEGUNDO_NO_SHOW

  const baneoHasta = new Date()
  baneoHasta.setDate(baneoHasta.getDate() + diasBaneo)

  const [strike] = await prisma.$transaction([
    prisma.strike.create({
      data: { jugadorId, reportadoPorId: payload.userId, partidoId, tipo, descripcion, baneoAplicado: diasBaneo }
    }),
    prisma.usuario.update({
      where: { id: jugadorId },
      data: { totalStrikes: nuevoTotal, baneoHasta }
    }),
    prisma.solicitud.updateMany({
      where: { jugadorId, partidoId },
      data: { asistio: false }
    })
  ])

  return NextResponse.json({
    data: { strike, mensaje: `Strike registrado. Jugador baneado por ${diasBaneo} días.` }
  }, { status: 201 })
}
