'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { DISTRITOS, POSICIONES } from '@/lib/constants'

const TIPOS = [
  { value: 'JUGADOR', label: 'Soy jugador', emoji: '👟', desc: 'Quiero encontrar partidos y ganar dinero' },
  { value: 'ORGANIZADOR', label: 'Organizo partidos', emoji: '📋', desc: 'Necesito jugadores para mis partidos' },
  { value: 'CLUB', label: 'Tengo un club', emoji: '🏟️', desc: 'Quiero registrar mi club y organizar partidos' },
]

function RegistroForm() {
  const searchParams = useSearchParams()
  const tipoParam = searchParams.get('tipo') ?? 'JUGADOR'
  const [tipo, setTipo] = useState(tipoParam)
  const [form, setForm] = useState({ email: '', password: '', nombre: '', telefono: '', codigoReferido: '' })
  const [perfilForm, setPerfilForm] = useState({ posicion: 'DELANTERO', distrito: 'Miraflores', precio: '', nombreClub: '', descripcion: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const setPerfil = (k: string, v: string) => setPerfilForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tipo })
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); setLoading(false); return }

      const token = json.data.token
      const usuario = json.data.usuario
      localStorage.setItem('token', token)
      localStorage.setItem('usuario', JSON.stringify(usuario))

      if (tipo === 'JUGADOR' && perfilForm.precio) {
        await fetch('/api/perfil', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            posicion: perfilForm.posicion,
            distrito: perfilForm.distrito,
            precio: parseFloat(perfilForm.precio),
            descripcion: perfilForm.descripcion,
            disponibilidad: []
          })
        })
      }

      if (tipo === 'CLUB') {
        await fetch('/api/perfil', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ nombre: form.nombre, distrito: perfilForm.distrito, descripcion: perfilForm.descripcion, telefono: form.telefono, nombreClub: perfilForm.nombreClub })
        })
      }

      router.push('/dashboard')
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-5xl">⚽</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Crear cuenta</h1>
          <p className="text-gray-500 mt-1">Únete a la comunidad Pichanga Peru</p>
        </div>

        <div className="card">
          <div className="mb-6">
            <p className="label">¿Cómo quieres registrarte?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TIPOS.map(t => (
                <button key={t.value} type="button" onClick={() => setTipo(t.value)}
                  className={`border-2 rounded-xl p-3 text-left transition ${tipo === t.value ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="text-xl mb-1">{t.emoji}</div>
                  <div className="text-sm font-semibold text-gray-900">{t.label}</div>
                  <div className="text-xs text-gray-500">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre completo</label>
                <input className="input" placeholder="Juan Pérez" value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
              </div>
              <div>
                <label className="label">Teléfono</label>
                <input className="input" placeholder="987 654 321" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="tu@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input type="password" className="input" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
            </div>

            {tipo === 'JUGADOR' && (
              <>
                <hr className="border-gray-100" />
                <p className="text-sm font-semibold text-gray-700">Tu perfil de jugador</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Posición</label>
                    <select className="input" value={perfilForm.posicion} onChange={e => setPerfil('posicion', e.target.value)}>
                      {POSICIONES.map(p => <option key={p.value} value={p.value}>{p.emoji} {p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Precio por partido (S/)</label>
                    <input type="number" className="input" placeholder="50" min="1" value={perfilForm.precio} onChange={e => setPerfil('precio', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">Distrito</label>
                  <select className="input" value={perfilForm.distrito} onChange={e => setPerfil('distrito', e.target.value)}>
                    {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Descripción (opcional)</label>
                  <textarea className="input" rows={2} placeholder="Cuéntanos sobre ti..." value={perfilForm.descripcion} onChange={e => setPerfil('descripcion', e.target.value)} />
                </div>
              </>
            )}

            {tipo === 'CLUB' && (
              <>
                <hr className="border-gray-100" />
                <p className="text-sm font-semibold text-gray-700">Datos del club</p>
                <div>
                  <label className="label">Nombre del club</label>
                  <input className="input" placeholder="Club Deportivo Lima FC" value={perfilForm.nombreClub} onChange={e => setPerfil('nombreClub', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Distrito</label>
                  <select className="input" value={perfilForm.distrito} onChange={e => setPerfil('distrito', e.target.value)}>
                    {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="label">Código de referido (opcional)</label>
              <input className="input" placeholder="Código de quien te invitó" value={form.codigoReferido} onChange={e => set('codigoReferido', e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">Tu amigo gana 50 puntos si usas su código</p>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-red-600 font-semibold hover:text-red-700">Ingresar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegistroPage() {
  return <Suspense><RegistroForm /></Suspense>
}
