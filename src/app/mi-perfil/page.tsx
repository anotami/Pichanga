'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { POSICIONES, DISTRITOS, DIAS_SEMANA, NIVELES, PIERNAS } from '@/lib/constants'
import { Usuario } from '@/types'

export default function MiPerfilPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [form, setForm] = useState({
    posicion: 'DELANTERO', posicionSecundaria: '', nivel: 'AMATEUR',
    piernaHabil: 'DERECHA', edad: '', altura: '',
    distrito: 'Miraflores', precio: '', descripcion: '', radioAccion: '10',
    disponibilidad: [] as { dia: string; inicio: string; fin: string }[]
  })
  const [infoForm, setInfoForm] = useState({ nombre: '', telefono: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => {
        const u = j.data
        setUsuario(u)
        setInfoForm({ nombre: u.nombre, telefono: u.telefono || '' })
        if (u.perfil) {
          setForm({
            posicion: u.perfil.posicion,
            posicionSecundaria: u.perfil.posicionSecundaria || '',
            nivel: u.perfil.nivel || 'AMATEUR',
            piernaHabil: u.perfil.piernaHabil || 'DERECHA',
            edad: u.perfil.edad ? String(u.perfil.edad) : '',
            altura: u.perfil.altura ? String(u.perfil.altura) : '',
            distrito: u.perfil.distrito,
            precio: String(u.perfil.precio),
            descripcion: u.perfil.descripcion || '',
            radioAccion: String((u.perfil as unknown as { radioAccion?: number }).radioAccion ?? 10),
            disponibilidad: u.perfil.disponibilidad || []
          })
        }
      })
  }, [router])

  function toggleDia(dia: string) {
    setForm(f => {
      const existe = f.disponibilidad.find(d => d.dia === dia)
      if (existe) return { ...f, disponibilidad: f.disponibilidad.filter(d => d.dia !== dia) }
      return { ...f, disponibilidad: [...f.disponibilidad, { dia, inicio: '08:00', fin: '22:00' }] }
    })
  }

  function updateHorario(dia: string, campo: 'inicio' | 'fin', valor: string) {
    setForm(f => ({ ...f, disponibilidad: f.disponibilidad.map(d => d.dia === dia ? { ...d, [campo]: valor } : d) }))
  }

  async function guardarPerfil(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      const token = localStorage.getItem('token')
      if (usuario?.tipo === 'JUGADOR') {
        await fetch('/api/perfil', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...form, precio: parseFloat(form.precio) })
        })
      }
      await fetch('/api/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(infoForm)
      })
      setMsg('¡Perfil guardado exitosamente!')
      const me = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
      localStorage.setItem('usuario', JSON.stringify(me.data))
    } catch { setMsg('Error al guardar') }
    finally { setLoading(false) }
  }

  if (!usuario) return <div className="text-center py-20 text-4xl animate-pulse">⚽</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi perfil</h1>
        <p className="text-gray-500">Actualiza tu información para recibir más oportunidades</p>
      </div>

      {msg && <div className={`rounded-xl px-4 py-3 text-sm mb-4 ${msg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>}

      <div className="card mb-5 bg-amber-50 border-amber-200">
        <h3 className="font-semibold text-amber-900 mb-2">🎁 Tu código de referido</h3>
        <div className="flex items-center gap-3">
          <code className="bg-white border border-amber-200 text-amber-800 font-mono text-sm px-3 py-2 rounded-lg flex-1">
            {usuario.codigoReferido}
          </code>
          <button onClick={() => navigator.clipboard.writeText(usuario.codigoReferido ?? '')}
            className="text-sm bg-amber-500 text-white px-3 py-2 rounded-lg hover:bg-amber-600 transition">
            Copiar
          </button>
        </div>
        <p className="text-xs text-amber-700 mt-2">Ganas 50 puntos por cada jugador que se registre con tu código</p>
      </div>

      <form onSubmit={guardarPerfil} className="space-y-5">
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Información personal</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre</label>
              <input className="input" value={infoForm.nombre} onChange={e => setInfoForm(f => ({ ...f, nombre: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Teléfono</label>
              <input className="input" placeholder="987 654 321" value={infoForm.telefono} onChange={e => setInfoForm(f => ({ ...f, telefono: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input bg-gray-50 text-gray-400" value={usuario.email} disabled />
          </div>
        </div>

        {usuario.tipo === 'JUGADOR' && (
          <>
            <div className="card space-y-4">
              <h2 className="font-semibold text-gray-900">Perfil deportivo</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Posición principal</label>
                  <select className="input" value={form.posicion} onChange={e => setForm(f => ({ ...f, posicion: e.target.value }))}>
                    {POSICIONES.map(p => <option key={p.value} value={p.value}>{p.emoji} {p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Posición secundaria</label>
                  <select className="input" value={form.posicionSecundaria} onChange={e => setForm(f => ({ ...f, posicionSecundaria: e.target.value }))}>
                    <option value="">Ninguna</option>
                    {POSICIONES.map(p => <option key={p.value} value={p.value}>{p.emoji} {p.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nivel de juego</label>
                  <select className="input" value={form.nivel} onChange={e => setForm(f => ({ ...f, nivel: e.target.value }))}>
                    {NIVELES.map(n => <option key={n.value} value={n.value}>{n.emoji} {n.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Pierna hábil</label>
                  <select className="input" value={form.piernaHabil} onChange={e => setForm(f => ({ ...f, piernaHabil: e.target.value }))}>
                    {PIERNAS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Edad (años)</label>
                  <input type="number" className="input" placeholder="25" min="14" max="65" value={form.edad} onChange={e => setForm(f => ({ ...f, edad: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Altura (cm)</label>
                  <input type="number" className="input" placeholder="175" min="140" max="220" value={form.altura} onChange={e => setForm(f => ({ ...f, altura: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Precio por partido (S/)</label>
                  <input type="number" className="input" min="0" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} required />
                  <p className="text-xs text-gray-400 mt-1">Pon 0 si juegas gratis</p>
                </div>
                <div>
                  <label className="label">Distrito base</label>
                  <select className="input" value={form.distrito} onChange={e => setForm(f => ({ ...f, distrito: e.target.value }))}>
                    {DISTRITOS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Radio de acción: {form.radioAccion} km</label>
                <input type="range" min="2" max="30" step="2" className="w-full accent-red-600"
                  value={form.radioAccion} onChange={e => setForm(f => ({ ...f, radioAccion: e.target.value }))} />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>2 km (muy cerca)</span><span>15 km</span><span>30 km (toda Lima)</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Solo verás partidos dentro de este radio desde tu distrito</p>
              </div>
              <div>
                <label className="label">Descripción</label>
                <textarea className="input" rows={3} placeholder="Cuéntanos sobre tu experiencia..." value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
              </div>
            </div>

            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Disponibilidad semanal</h2>
              <div className="space-y-3">
                {DIAS_SEMANA.map(dia => {
                  const disp = form.disponibilidad.find(d => d.dia === dia)
                  return (
                    <div key={dia} className="flex items-center gap-3">
                      <button type="button" onClick={() => toggleDia(dia)}
                        className={`w-24 text-sm font-medium py-1.5 rounded-lg transition ${disp ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                        {dia.slice(0, 3)}
                      </button>
                      {disp ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input type="time" className="input py-1.5" value={disp.inicio} onChange={e => updateHorario(dia, 'inicio', e.target.value)} />
                          <span className="text-gray-400 text-sm">a</span>
                          <input type="time" className="input py-1.5" value={disp.fin} onChange={e => updateHorario(dia, 'fin', e.target.value)} />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">No disponible</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
