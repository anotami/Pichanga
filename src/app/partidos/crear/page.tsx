'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { POSICIONES, DISTRITOS, MODALIDADES } from '@/lib/constants'

interface PosicionRow { posicion: string; cantidad: number }

export default function CrearPartidoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    titulo: '', descripcion: '', distrito: 'Miraflores', direccion: '',
    fecha: '', hora: '10:00', duracion: '90', modalidad: '5VS5', presupuestoMax: ''
  })
  const [posiciones, setPosiciones] = useState<PosicionRow[]>([{ posicion: 'ARQUERO', cantidad: 1 }])

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login')
  }, [router])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  function addPosicion() {
    setPosiciones(p => [...p, { posicion: 'DELANTERO', cantidad: 1 }])
  }
  function removePosicion(i: number) {
    setPosiciones(p => p.filter((_, idx) => idx !== i))
  }
  function updatePosicion(i: number, k: keyof PosicionRow, v: string | number) {
    setPosiciones(p => p.map((row, idx) => idx === i ? { ...row, [k]: v } : row))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (posiciones.length === 0) { setError('Agrega al menos una posición'); return }
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const fechaCompleta = new Date(`${form.fecha}T${form.hora}:00`)
      const res = await fetch('/api/partidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          titulo: form.titulo, descripcion: form.descripcion,
          distrito: form.distrito, direccion: form.direccion,
          fecha: fechaCompleta.toISOString(),
          duracion: parseInt(form.duracion),
          modalidad: form.modalidad,
          posiciones,
          presupuestoMax: form.presupuestoMax ? parseFloat(form.presupuestoMax) : null
        })
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }
      router.push(`/partidos/${json.data.id}`)
    } catch { setError('Error de conexión') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicar partido</h1>
        <p className="text-gray-500">Completa los datos y recibirás ofertas de jugadores</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Información básica</h2>
          <div>
            <label className="label">Título del partido *</label>
            <input className="input" placeholder="Ej: Se busca arquero para fulbito el sábado" value={form.titulo} onChange={e => set('titulo', e.target.value)} required />
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea className="input" rows={2} placeholder="Detalles adicionales del partido..." value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Modalidad</label>
              <select className="input" value={form.modalidad} onChange={e => set('modalidad', e.target.value)}>
                {MODALIDADES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Duración (minutos)</label>
              <select className="input" value={form.duracion} onChange={e => set('duracion', e.target.value)}>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
                <option value="120">120 min</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Fecha y lugar</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Fecha *</label>
              <input type="date" className="input" value={form.fecha} onChange={e => set('fecha', e.target.value)} required min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="label">Hora *</label>
              <input type="time" className="input" value={form.hora} onChange={e => set('hora', e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="label">Distrito *</label>
            <select className="input" value={form.distrito} onChange={e => set('distrito', e.target.value)}>
              {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Dirección (opcional)</label>
            <input className="input" placeholder="Av. Principal 123, cerca al parque" value={form.direccion} onChange={e => set('direccion', e.target.value)} />
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Jugadores necesarios</h2>
            <button type="button" onClick={addPosicion} className="text-sm text-red-600 font-medium hover:text-red-700">+ Agregar posición</button>
          </div>
          {posiciones.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <select className="input flex-1" value={row.posicion} onChange={e => updatePosicion(i, 'posicion', e.target.value)}>
                {POSICIONES.map(p => <option key={p.value} value={p.value}>{p.emoji} {p.label}</option>)}
              </select>
              <input type="number" className="input w-24" min="1" max="11" value={row.cantidad}
                onChange={e => updatePosicion(i, 'cantidad', parseInt(e.target.value))}
                placeholder="N°" />
              {posiciones.length > 1 && (
                <button type="button" onClick={() => removePosicion(i)} className="text-gray-400 hover:text-red-500 transition">✕</button>
              )}
            </div>
          ))}
          <div>
            <label className="label">Presupuesto máximo por jugador (S/)</label>
            <input type="number" className="input" placeholder="Sin límite" min="0" value={form.presupuestoMax} onChange={e => set('presupuestoMax', e.target.value)} />
            <p className="text-xs text-gray-400 mt-1">La plataforma retiene el 10% de comisión</p>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar partido'}
        </button>
      </form>
    </div>
  )
}
