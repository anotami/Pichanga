'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DISTRITOS } from '@/lib/constants'

interface ClubData {
  club?: { id: string; nombre: string; distrito: string; descripcion?: string; telefono?: string }
  usuario: { nombre: string; email: string; tipo: string }
}

export default function MiClubPage() {
  const router = useRouter()
  const [data, setData] = useState<ClubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ nombre: '', distrito: 'Miraflores', descripcion: '', telefono: '' })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => {
        const u = j.data
        if (!u || u.tipo !== 'CLUB') { router.push('/dashboard'); return }
        setData({ usuario: u, club: u.club })
        if (u.club) {
          setForm({
            nombre: u.club.nombre ?? '',
            distrito: u.club.distrito ?? 'Miraflores',
            descripcion: u.club.descripcion ?? '',
            telefono: u.club.telefono ?? '',
          })
        }
      })
      .finally(() => setLoading(false))
  }, [router])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('token')
    const res = await fetch('/api/perfil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tipo: 'club', ...form }),
    })
    const json = await res.json()
    if (res.ok) {
      setMsg('Club actualizado correctamente')
      setData(prev => prev ? { ...prev, club: json.data } : null)
    } else {
      setMsg(json.error || 'Error al guardar')
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return <div className="text-center py-20 text-4xl animate-pulse">⚽</div>
  if (!data) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Club</h1>
        <p className="text-gray-500">Gestiona la información de tu club</p>
      </div>

      {msg && (
        <div className={`rounded-xl px-4 py-3 text-sm mb-4 ${msg.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg}
        </div>
      )}

      <div className="card mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-2xl">🏟️</div>
          <div>
            <p className="font-semibold text-gray-900">{data.usuario.nombre}</p>
            <p className="text-gray-500 text-sm">{data.usuario.email}</p>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Club</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Información del club</h2>
          <div>
            <label className="label">Nombre del club *</label>
            <input className="input" placeholder="Ej: Lima Deportivo FC" value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
          </div>
          <div>
            <label className="label">Distrito *</label>
            <select className="input" value={form.distrito} onChange={e => set('distrito', e.target.value)}>
              {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Teléfono de contacto</label>
            <input className="input" placeholder="+51 999 999 999" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea className="input" rows={3} placeholder="Cuéntanos sobre tu club, instalaciones, días disponibles..." value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      <div className="card mt-6">
        <h3 className="font-semibold text-gray-900 mb-3">Acciones rápidas</h3>
        <div className="space-y-2">
          <a href="/partidos/crear" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
            <span className="text-2xl">⚽</span>
            <div>
              <p className="font-medium text-gray-900">Publicar partido</p>
              <p className="text-gray-500 text-xs">Busca jugadores para tu cancha</p>
            </div>
          </a>
          <a href="/partidos" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-medium text-gray-900">Ver partidos activos</p>
              <p className="text-gray-500 text-xs">Gestiona tus partidos publicados</p>
            </div>
          </a>
          <a href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-medium text-gray-900">Dashboard</p>
              <p className="text-gray-500 text-xs">Estadísticas y resumen</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
