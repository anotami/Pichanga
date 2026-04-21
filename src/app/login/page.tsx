'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }
      localStorage.setItem('token', json.data.token)
      localStorage.setItem('usuario', JSON.stringify(json.data.usuario))
      router.push('/dashboard')
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Imagen lateral */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80"
          alt="Campo de fútbol"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/85 to-red-700/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-white text-center">
          <div className="text-6xl mb-6">⚽</div>
          <h2 className="text-3xl font-extrabold mb-4 leading-tight">
            La pichanga<br />te espera
          </h2>
          <p className="text-red-200 text-lg max-w-xs">
            Ingresa y encuentra tu próximo partido en Lima y todo el Perú.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            {[
              { n: '1,200+', l: 'Jugadores' },
              { n: '500+',   l: 'Partidos'  },
              { n: '50+',    l: 'Clubes'    },
            ].map(s => (
              <div key={s.l}>
                <p className="text-2xl font-extrabold">{s.n}</p>
                <p className="text-red-300 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-3xl">⚽</span>
              <span className="text-xl font-bold text-gray-900">Pichanga</span>
              <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full">Perú</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Bienvenido de vuelta</h1>
            <p className="text-gray-500 mt-1">Ingresa a tu cuenta</p>
          </div>

          <div className="card shadow-lg">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="tu@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="label">Contraseña</label>
                <input type="password" className="input" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar →'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className="text-red-600 font-semibold hover:text-red-700">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
