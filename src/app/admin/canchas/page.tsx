'use client'
import { useState, useEffect } from 'react'

interface Cancha {
  id: string; nombre: string; deporte: string; distrito: string; direccion: string
  telefono?: string; precio?: number; superficie?: string; tamano?: string
  techada: boolean; iluminacion: boolean; vestuarios: boolean; estacionamiento: boolean
  disponible: boolean; descripcion?: string
}

const EMPTY: Omit<Cancha, 'id'> = {
  nombre: '', deporte: 'FUTBOL', distrito: '', direccion: '',
  telefono: '', precio: undefined, superficie: 'SINTETICO', tamano: '5VS5',
  techada: false, iluminacion: true, vestuarios: false, estacionamiento: false,
  disponible: true, descripcion: '',
}

const DISTRITOS = [
  'Ate','Barranco','Carabayllo','Chorrillos','Comas','Independencia','Jesús María',
  'La Molina','La Victoria','Lince','Los Olivos','Magdalena del Mar','Miraflores',
  'Pueblo Libre','Rímac','San Borja','San Isidro','San Juan de Lurigancho',
  'San Juan de Miraflores','San Martín de Porres','San Miguel','Santiago de Surco',
  'Surquillo','Villa El Salvador','Villa María del Triunfo',
]

export default function AdminCanchasPage() {
  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroDeporte, setFiltroDeporte] = useState('FUTBOL')
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState<Cancha | null>(null)
  const [form, setForm] = useState<Omit<Cancha, 'id'>>(EMPTY)
  const [msg, setMsg] = useState('')
  const [guardando, setGuardando] = useState(false)

  function token() { return localStorage.getItem('adminToken') }

  function fetchData() {
    setLoading(true)
    fetch(`/api/canchas?deporte=${filtroDeporte}&disponible=false`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(j => setCanchas(j.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [filtroDeporte])

  function abrirNueva() { setEditando(null); setForm(EMPTY); setModal(true) }
  function abrirEditar(c: Cancha) { setEditando(c); setForm({ ...c }); setModal(true) }

  async function guardar() {
    setGuardando(true)
    try {
      const url = editando ? `/api/canchas/${editando.id}` : '/api/canchas'
      const method = editando ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ ...form, precio: form.precio ? Number(form.precio) : null }),
      })
      if (res.ok) { setModal(false); flash(editando ? 'Cancha actualizada' : 'Cancha creada'); fetchData() }
      else { const j = await res.json(); flash(j.error ?? 'Error', true) }
    } finally { setGuardando(false) }
  }

  async function eliminar(id: string, nombre: string) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    await fetch(`/api/canchas/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    flash('Cancha eliminada'); fetchData()
  }

  async function toggleDisponible(c: Cancha) {
    await fetch(`/api/canchas/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ disponible: !c.disponible }),
    })
    fetchData()
  }

  function flash(text: string, err = false) {
    setMsg(err ? `❌ ${text}` : `✅ ${text}`)
    setTimeout(() => setMsg(''), 3000)
  }

  function F(key: keyof typeof form, val: unknown) { setForm(f => ({ ...f, [key]: val })) }

  const SUPERFICIE = ['SINTETICO','CESPED_NATURAL','CEMENTO','INDOOR']
  const TAMANOS_FUTBOL = ['5VS5','7VS7','11VS11']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Canchas</h1>
          <p className="text-gray-400 mt-1">Alta, baja y modificación de canchas</p>
        </div>
        <button onClick={abrirNueva} className="bg-red-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-red-700 transition">
          + Nueva cancha
        </button>
      </div>

      {msg && <div className="bg-gray-800 border border-gray-600 text-gray-200 rounded-xl px-4 py-3 text-sm mb-4">{msg}</div>}

      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 mb-6 flex gap-3">
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Deporte</label>
          <select value={filtroDeporte} onChange={e => setFiltroDeporte(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm">
            <option value="FUTBOL">⚽ Fútbol</option>
            <option value="PADEL">🏓 Pádel</option>
            <option value="AMBOS">Ambos</option>
          </select>
        </div>
      </div>

      <div className="text-gray-400 text-sm mb-3">{canchas.length} canchas</div>

      {loading ? (
        <div className="text-center py-10 text-gray-400 animate-pulse">Cargando...</div>
      ) : (
        <div className="space-y-3">
          {canchas.map(c => (
            <div key={c.id} className={`bg-gray-800 rounded-xl border p-4 ${!c.disponible ? 'border-red-900 opacity-60' : 'border-gray-700'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-semibold">{c.nombre}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.deporte === 'PADEL' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {c.deporte === 'PADEL' ? '🏓' : '⚽'} {c.deporte}
                    </span>
                    {!c.disponible && <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded-full">Inactiva</span>}
                  </div>
                  <p className="text-gray-400 text-sm">{c.distrito} · {c.direccion}</p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    {c.superficie && <span>{c.superficie}</span>}
                    {c.tamano && <span>{c.tamano}</span>}
                    {c.precio && <span>S/{c.precio}/h</span>}
                    {c.telefono && <span>📞 {c.telefono}</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => toggleDisponible(c)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition ${c.disponible ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'bg-green-900/40 text-green-400 border-green-800 hover:bg-green-900'}`}>
                    {c.disponible ? 'Desactivar' : 'Activar'}
                  </button>
                  <button onClick={() => abrirEditar(c)}
                    className="text-xs bg-blue-900/40 text-blue-300 border border-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-900 transition">
                    Editar
                  </button>
                  <button onClick={() => eliminar(c.id, c.nombre)}
                    className="text-xs bg-red-900/40 text-red-400 border border-red-800 px-3 py-1.5 rounded-lg hover:bg-red-900 transition">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-white font-bold text-lg mb-5">{editando ? 'Editar cancha' : 'Nueva cancha'}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Nombre *</label>
                    <input value={form.nombre} onChange={e => F('nombre', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm" placeholder="Canchas Sport Lima" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Deporte *</label>
                    <select value={form.deporte} onChange={e => F('deporte', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm">
                      <option value="FUTBOL">⚽ Fútbol</option>
                      <option value="PADEL">🏓 Pádel</option>
                      <option value="AMBOS">Ambos</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Distrito *</label>
                    <select value={form.distrito} onChange={e => F('distrito', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm">
                      <option value="">Seleccionar...</option>
                      {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Dirección *</label>
                    <input value={form.direccion} onChange={e => F('direccion', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm" placeholder="Av. Ejemplo 123" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Teléfono</label>
                    <input value={form.telefono ?? ''} onChange={e => F('telefono', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm" placeholder="9XXXXXXXX" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Precio/hora (S/)</label>
                    <input type="number" value={form.precio ?? ''} onChange={e => F('precio', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm" placeholder="100" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Superficie</label>
                    <select value={form.superficie ?? ''} onChange={e => F('superficie', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm">
                      <option value="">—</option>
                      {SUPERFICIE.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Tamaño</label>
                    <select value={form.tamano ?? ''} onChange={e => F('tamano', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm">
                      <option value="">—</option>
                      {(form.deporte === 'PADEL' ? ['PADEL'] : TAMANOS_FUTBOL).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Descripción</label>
                    <textarea value={form.descripcion ?? ''} onChange={e => F('descripcion', e.target.value)} rows={2}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['techada','iluminacion','vestuarios','estacionamiento'] as const).map(k => (
                    <label key={k} className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                      <input type="checkbox" checked={!!form[k]} onChange={e => F(k, e.target.checked)} className="rounded" />
                      {k === 'techada' ? '🏠 Techada' : k === 'iluminacion' ? '💡 Iluminación' : k === 'vestuarios' ? '🚿 Vestuarios' : '🅿️ Estacionamiento'}
                    </label>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.disponible} onChange={e => F('disponible', e.target.checked)} className="rounded" />
                  Disponible (visible en la plataforma)
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModal(false)} className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-xl hover:bg-gray-600 transition text-sm">Cancelar</button>
                <button onClick={guardar} disabled={guardando || !form.nombre || !form.distrito || !form.direccion}
                  className="flex-1 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition text-sm font-semibold disabled:opacity-40">
                  {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear cancha'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
