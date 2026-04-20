'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }
      localStorage.setItem('adminToken', json.data.token)
      router.push('/admin/dashboard')
    } catch { setError('Error de conexión') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">⚽</span>
          <h1 className="text-2xl font-bold text-white mt-3">Admin Pichanga</h1>
          <p className="text-gray-400 mt-1">Panel de administración</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          {error && <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña de administrador</label>
              <input type="password" className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition disabled:opacity-50">
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
