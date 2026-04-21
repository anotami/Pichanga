import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⚽</span>
              <span className="text-white font-bold text-xl">Pichanga</span>
              <span className="text-gray-600 text-lg">|</span>
              <span className="text-2xl">🏓</span>
              <span className="text-white font-bold text-xl">DejadaPeru</span>
            </div>
            <p className="text-sm leading-relaxed">La plataforma peruana que conecta jugadores con partidos. Fútbol y pádel — completa tu equipo, juega más, gana puntos.</p>
            <div className="flex gap-3 mt-4">
              <span className="text-2xl">🇵🇪</span>
              <span className="text-sm text-gray-500 self-center">Hecho con amor en Lima, Perú</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">⚽ Pichanga Fútbol</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jugadores" className="hover:text-white transition">Buscar jugadores</Link></li>
              <li><Link href="/partidos" className="hover:text-white transition">Ver partidos</Link></li>
              <li><Link href="/pichanga" className="hover:text-white transition">Inicio fútbol</Link></li>
            </ul>
            <h4 className="text-white font-semibold mb-3 mt-5 text-sm uppercase tracking-wider">🏓 DejadaPeru Pádel</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dejada/jugadores" className="hover:text-white transition">Buscar jugadores</Link></li>
              <li><Link href="/dejada/partidos" className="hover:text-white transition">Ver partidos</Link></li>
              <li><Link href="/dejada" className="hover:text-white transition">Inicio pádel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Posiciones</h4>
            <ul className="space-y-2 text-sm">
              <li>🧤 Arquero</li>
              <li>🛡️ Defensa</li>
              <li>⚽ Mediocampista</li>
              <li>⚡ Delantero</li>
              <li className="pt-2 border-t border-gray-800">🎾 Derecha (pádel)</li>
              <li>🏓 Revés (pádel)</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© 2025 Pichanga & DejadaPeru. Todos los derechos reservados.</p>
          <p>La plataforma retiene el 10% de comisión por partido completado.</p>
        </div>
      </div>
    </footer>
  )
}
