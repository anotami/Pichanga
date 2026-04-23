import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import JugadorDetalleClient from './JugadorDetalleClient'

const POS_LABEL: Record<string, string> = {
  ARQUERO: 'Arquero', DEFENSA: 'Defensa', MEDIOCAMPISTA: 'Mediocampista', DELANTERO: 'Delantero',
  DERECHA: 'Derecha', REVES: 'Revés',
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const perfil = await prisma.jugadorPerfil.findFirst({
    where: { usuarioId: params.id },
    include: { usuario: { select: { nombre: true } } },
  })
  if (!perfil) return { title: 'Jugador no encontrado | Pichanga' }

  const pos = POS_LABEL[perfil.posicion] ?? perfil.posicion
  const nombre = perfil.usuario.nombre
  const title = `${nombre} – ${pos} en ${perfil.distrito} | Pichanga`
  const description = `Contratá a ${nombre}, ${pos} disponible en ${perfil.distrito}. Rating ${perfil.rating.toFixed(1)}/5, ${perfil.totalPartidos} partidos jugados. Desde S/ ${perfil.precio} por partido.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      siteName: 'Pichanga Peru',
    },
  }
}

export default function JugadorDetallePage({ params }: { params: { id: string } }) {
  return <JugadorDetalleClient id={params.id} />
}
