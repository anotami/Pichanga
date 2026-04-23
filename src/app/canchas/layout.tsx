import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Canchas de fútbol en Lima | Pichanga',
  description: 'Descubrí canchas de fútbol en Lima con precios, superficie y amenidades. Sintético, césped natural y cemento. Fulbito y fútbol completo.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
