import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚽</span>
              <span className="text-white font-bold text-xl">Pichanga</span>
            </div>
            <p className="text-sm leading-relaxed">La plataforma peruana que conecta jugadores con partidos. Completa tu equipo, juega más, gana puntos.</p>
            <div className="flex gap-3 mt-4">
              <span className="text-2xl">🇵🇪</span>
              <span className="text-sm text-gray-500 self-center">Hecho con amor en Lima, Perú</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Plataforma</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jugadores" className="hover:text-white transition">Buscar jugadores</Link></li>
              <li><Link href="/partidos" className="hover:text-white transition">Ver partidos</Link></li>
              <li><Link href="/registro" className="hover:text-white transition">Registrarse</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Posiciones</h4>
            <ul className="space-y-2 text-sm">
              <li>🧤 Arquero</li>
              <li>🛡️ Defensa</li>
              <li>⚽ Mediocampista</li>
              <li>⚡ Delantero</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© 2024 Pichanga Peru. Todos los derechos reservados.</p>
          <p>La plataforma retiene el 10% de comisión por partido completado.</p>
        </div>
      </div>
    </footer>
  )
}
