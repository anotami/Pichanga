import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jugadores de fútbol en Lima | Pichanga',
  description: 'Encontrá arqueros, defensas, mediocampistas y delanteros disponibles en Lima. Filtrá por distrito, nivel y precio. Plataforma de fútbol peruano.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
