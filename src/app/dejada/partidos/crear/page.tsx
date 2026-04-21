'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { POSICIONES_PADEL, DISTRITOS, NIVELES_PADEL, formatPrecio } from '@/lib/constants'

interface PosicionRow { posicion: string; cantidad: number }

const TIPOS_PAGO = [
  { value: 'PAGA_CUOTA', label: 'Paga su cuota', desc: 'El jugador paga para participar', emoji: '💳' },
  { value: 'GRATIS', label: 'Juega gratis', desc: 'El jugador no paga ni cobra nada', emoji: '🆓' },
  { value: 'SE_LE_PAGA', label: 'Se le paga', desc: 'El jugador recibe un pago por jugar', emoji: '💰' },
]

export default function CrearPartidoPadelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    titulo: '', descripcion: '', distrito: 'Miraflores', direccion: '',
    fecha: '', hora: '10:00', duracion: '60',
    presupuestoMax: '', nivelRequerido: 'PRINCIPIANTE',
    tipoPago: 'PAGA_CUOTA', cuotaCosto: '', pagoJugador: ''
  })
  const [posiciones, setPosiciones] = useState<PosicionRow[]>([{ posicion: 'DERECHA', cantidad: 1 }])

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login')
  }, [router])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  function addPosicion() { setPosiciones(p => [...p, { posicion: 'REVES', cantidad: 1 }]) }
  function removePosicion(i: number) { setPosiciones(p => p.filter((_, idx) => idx !== i)) }
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
          modalidad: '2VS2',
          deporte: 'PADEL',
          nivelRequerido: form.nivelRequerido,
          tipoPago: form.tipoPago,
          cuotaCosto: form.cuotaCosto ? parseFloat(form.cuotaCosto) : null,
          pagoJugador: form.pagoJugador ? parseFloat(form.pagoJugador) : null,
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
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🏓</span>
          <h1 className="text-3xl font-bold text-gray-900">Publicar partido de pádel</h1>
        </div>
        <p className="text-gray-500">Completa los datos y recibirás propuestas de jugadores</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Información básica</h2>
          <div>
            <label className="label">Título del partido *</label>
            <input className="input" placeholder="Ej: Se busca revés para partido este sábado en San Isidro" value={form.titulo} onChange={e => set('titulo', e.target.value)} required />
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea className="input" rows={2} placeholder="Detalles del club, cancha, nivel del partido..." value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Duración (minutos)</label>
              <select className="input" value={form.duracion} onChange={e => set('duracion', e.target.value)}>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
                <option value="120">120 min</option>
              </select>
            </div>
            <div>
              <label className="label">Nivel mínimo</label>
              <select className="input" value={form.nivelRequerido} onChange={e => set('nivelRequerido', e.target.value)}>
                {NIVELES_PADEL.map(n => <option key={n.value} value={n.value}>{n.emoji} {n.label}</option>)}
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
            <label className="label">Club / Dirección (opcional)</label>
            <input className="input" placeholder="Club de Pádel Lima, Av. Principal 123" value={form.direccion} onChange={e => set('direccion', e.target.value)} />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Condiciones económicas</h2>
          <div className="grid grid-cols-3 gap-3">
            {TIPOS_PAGO.map(t => (
              <button key={t.value} type="button" onClick={() => set('tipoPago', t.value)}
                className={`p-3 rounded-xl border-2 text-center transition ${form.tipoPago === t.value ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="text-2xl mb-1">{t.emoji}</div>
                <p className={`text-xs font-semibold ${form.tipoPago === t.value ? 'text-green-700' : 'text-gray-700'}`}>{t.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{t.desc}</p>
              </button>
            ))}
          </div>
          {form.tipoPago === 'PAGA_CUOTA' && (
            <div>
              <label className="label">Monto de la cuota (S/)</label>
              <input type="number" className="input" placeholder="20" min="0" value={form.cuotaCosto} onChange={e => set('cuotaCosto', e.target.value)} />
            </div>
          )}
          {form.tipoPago === 'SE_LE_PAGA' && (
            <div>
              <label className="label">Pago al jugador (S/)</label>
              <input type="number" className="input" placeholder="50" min="0" value={form.pagoJugador} onChange={e => set('pagoJugador', e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">
                Recibes: <span className="text-green-600 font-semibold">
                  {form.pagoJugador ? formatPrecio(parseFloat(form.pagoJugador) * 0.9) : 'S/ --'}
                </span> (luego de 10% de comisión)
              </p>
            </div>
          )}
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Jugadores necesarios</h2>
            <button type="button" onClick={addPosicion} className="text-sm text-green-700 font-medium hover:text-green-800">+ Agregar posición</button>
          </div>
          {posiciones.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <select className="input flex-1" value={row.posicion} onChange={e => updatePosicion(i, 'posicion', e.target.value)}>
                {POSICIONES_PADEL.map(p => <option key={p.value} value={p.value}>{p.emoji} {p.label}</option>)}
              </select>
              <input type="number" className="input w-24" min="1" max="4" value={row.cantidad}
                onChange={e => updatePosicion(i, 'cantidad', parseInt(e.target.value))} />
              {posiciones.length > 1 && (
                <button type="button" onClick={() => removePosicion(i)} className="text-gray-400 hover:text-red-500 transition">✕</button>
              )}
            </div>
          ))}
          <div>
            <label className="label">Presupuesto máximo (S/) — opcional</label>
            <input type="number" className="input" placeholder="Sin límite" min="0" value={form.presupuestoMax} onChange={e => set('presupuestoMax', e.target.value)} />
          </div>
        </div>

        <button type="submit"
          className="w-full py-3 bg-green-700 text-white font-bold rounded-2xl hover:bg-green-800 transition text-base"
          disabled={loading}>
          {loading ? 'Publicando...' : '🏓 Publicar partido de pádel'}
        </button>
      </form>
    </div>
  )
}
