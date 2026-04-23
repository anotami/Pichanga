import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VisitaTracker from '@/components/VisitaTracker'

export const metadata: Metadata = {
  title: 'Pichanga - Completa tu partido en Perú',
  description: 'Encuentra jugadores para completar tu equipo. Arqueros, defensas, mediocampistas y delanteros disponibles en Lima y todo el Perú.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <VisitaTracker />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
