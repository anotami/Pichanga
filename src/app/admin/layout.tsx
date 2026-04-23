'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', emoji: '📊' },
  { href: '/admin/jugadores', label: 'Jugadores', emoji: '👟' },
  { href: '/admin/partidos', label: 'Partidos', emoji: '⚽' },
  { href: '/admin/strikes', label: 'Strikes & Baneos', emoji: '🚨' },
  { href: '/admin/transacciones', label: 'Transacciones', emoji: '💰' },
  { href: '/admin/canchas', label: 'Canchas', emoji: '🏟️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLogin = pathname === '/admin/login'

  useEffect(() => {
    if (!isLogin && !localStorage.getItem('adminToken')) router.push('/admin/login')
  }, [isLogin, router])

  if (isLogin) return <>{children}</>

  function salir() {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-10">
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚽</span>
            <div>
              <p className="text-white font-bold text-sm">Pichanga</p>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition ${
                pathname === item.href
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              <span>{item.emoji}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-sm">
            ← Ver app
          </Link>
          <button onClick={salir} className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 text-sm w-full">
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-56 p-8 overflow-auto">{children}</main>
    </div>
  )
}
