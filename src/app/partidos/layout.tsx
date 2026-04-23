import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partidos de fútbol en Lima | Pichanga',
  description: 'Encontrá partidos de fútbol cerca tuyo. Fulbito 5vs5, 7vs7 y 11vs11 en Lima. Aplicá como jugador o publicá tu partido.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
