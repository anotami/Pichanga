'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UsuarioBasico { id: string; nombre: string; tipo: string }

export default function Navbar() {
  const [usuario, setUsuario] = useState<UsuarioBasico | null>(null)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('usuario')
    if (token && u) setUsuario(JSON.parse(u))
  }, [])

  function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
    router.push('/')
  }

  return (
    <nav className="bg-red-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <span className="text-white font-bold text-xl tracking-tight">Pichanga</span>
            <span className="text-red-200 text-xs font-medium hidden sm:block">Peru</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/jugadores" className="text-red-100 hover:text-white transition font-medium">Jugadores</Link>
            <Link href="/partidos" className="text-red-100 hover:text-white transition font-medium">Partidos</Link>
            {usuario ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="text-red-100 hover:text-white transition font-medium">Dashboard</Link>
                <div className="relative">
                  <button onClick={() => setMenuAbierto(!menuAbierto)}
                    className="flex items-center gap-2 bg-red-700 text-white rounded-full px-3 py-1.5 text-sm font-medium hover:bg-red-800 transition">
                    <span className="w-6 h-6 bg-white text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {usuario.nombre.charAt(0).toUpperCase()}
                    </span>
                    {usuario.nombre.split(' ')[0]}
                  </button>
                  {menuAbierto && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 border border-gray-100">
                      <Link href="/mi-perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuAbierto(false)}>Mi perfil</Link>
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuAbierto(false)}>Dashboard</Link>
                      <Link href="/wallet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuAbierto(false)}>💰 Mi billetera</Link>
                      <hr className="my-1" />
                      <button onClick={cerrarSesion} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Cerrar sesión</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-red-100 hover:text-white transition font-medium">Ingresar</Link>
                <Link href="/registro" className="bg-white text-red-600 rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-red-50 transition">Registrarse</Link>
              </div>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuAbierto(!menuAbierto)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuAbierto ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className="md:hidden bg-red-700 border-t border-red-500 px-4 py-3 space-y-2">
          <Link href="/jugadores" className="block text-red-100 py-2" onClick={() => setMenuAbierto(false)}>Jugadores</Link>
          <Link href="/partidos" className="block text-red-100 py-2" onClick={() => setMenuAbierto(false)}>Partidos</Link>
          {usuario ? (
            <>
              <Link href="/dashboard" className="block text-red-100 py-2" onClick={() => setMenuAbierto(false)}>Dashboard</Link>
              <Link href="/mi-perfil" className="block text-red-100 py-2" onClick={() => setMenuAbierto(false)}>Mi perfil</Link>
              <Link href="/wallet" className="block text-red-100 py-2" onClick={() => setMenuAbierto(false)}>💰 Mi billetera</Link>
              <button onClick={cerrarSesion} className="block text-red-200 py-2">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-red-100 py-2" onClick={() => setMenuAbierto(false)}>Ingresar</Link>
              <Link href="/registro" className="block text-white font-semibold py-2" onClick={() => setMenuAbierto(false)}>Registrarse</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
