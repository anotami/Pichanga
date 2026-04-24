import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PartidoDetalleClient from './PartidoDetalleClient'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const partido = await prisma.partido.findUnique({
    where: { id: params.id },
    select: { titulo: true, distrito: true, modalidad: true, descripcion: true }
  })
  if (!partido) return { title: 'Partido | Pichanga' }

  const title = `${partido.titulo} en ${partido.distrito} | Pichanga`
  const description = partido.descripcion
    ?? `Partido de ${partido.modalidad} en ${partido.distrito}. Aplicá como jugador en Pichanga.`

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary', title, description }
  }
}

export default function PartidoDetallePage({ params }: { params: { id: string } }) {
  return <PartidoDetalleClient id={params.id} />
}
