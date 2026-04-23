import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jugadores de pádel en Lima | DejadaPeru',
  description: 'Encontrá jugadores de pádel en Lima. Derecha y revés disponibles. Niveles principiante a competidor. La plataforma de pádel peruano.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
