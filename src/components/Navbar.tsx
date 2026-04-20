'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface UsuarioBasico { id: string; nombre: string; tipo: string }

export default function Navbar() {
  const [usuario, setUsuario] = useState<UsuarioBasico | null>(null)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [noLeidas, setNoLeidas] = useState(0)
  const [notifs, setNotifs] = useState<Array<{ id: string; titulo: string; mensaje: string; leida: boolean; link?: string; createdAt: string }>>([])
  const notifRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('usuario')
    if (token && u) {
      setUsuario(JSON.parse(u))
      // Load notifications count
      fetch('/api/notificaciones', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(j => { if (j.data) { setNoLeidas(j.data.noLeidas); setNotifs(j.data.notificaciones) } })
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
    router.push('/')
  }

  async function marcarLeidas() {
    const token = localStorage.getItem('token')
    await fetch('/api/notificaciones', { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } })
    setNoLeidas(0)
    setNotifs(prev => prev.map(n => ({ ...n, leida: true })))
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

                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen && noLeidas > 0) marcarLeidas() }}
                    className="relative text-red-100 hover:text-white transition p-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {noLeidas > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-red-600 text-xs font-bold rounded-full flex items-center justify-center">
                        {noLeidas > 9 ? '9+' : noLeidas}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <span className="font-semibold text-gray-900 text-sm">Notificaciones</span>
                        {noLeidas > 0 && <button onClick={marcarLeidas} className="text-xs text-red-500 hover:text-red-700">Marcar todas leídas</button>}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifs.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-8">Sin notificaciones</p>
                        ) : notifs.slice(0, 15).map(n => (
                          <a key={n.id} href={n.link ?? '#'} onClick={() => setNotifOpen(false)}
                            className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition ${!n.leida ? 'bg-red-50' : ''}`}>
                            <p className="text-sm font-medium text-gray-900">{n.titulo}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.mensaje}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString('es-PE')}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

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
                      {usuario.tipo === 'JUGADOR' && <Link href="/mis-solicitudes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuAbierto(false)}>Mis solicitudes</Link>}
                      {usuario.tipo === 'CLUB' && <Link href="/mi-club" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuAbierto(false)}>Mi club</Link>}
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
            {noLeidas > 0 && <span className="absolute top-3 right-12 w-4 h-4 bg-white text-red-600 text-xs font-bold rounded-full flex items-center justify-center">{noLeidas}</span>}
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
              {usuario.tipo === 'JUGADOR' && <Link href="/mis-solicitudes" className="block text-red-100 py-2" onClick={() => setMenuAbierto(false)}>Mis solicitudes</Link>}
              {usuario.tipo === 'CLUB' && <Link href="/mi-club" className="block text-red-100 py-2" onClick={() => setMenuAbierto(false)}>Mi club</Link>}
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
