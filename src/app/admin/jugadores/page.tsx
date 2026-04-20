'use client'
import { useState, useEffect } from 'react'
import { formatPrecio } from '@/lib/constants'

interface UserAdmin {
  id: string; nombre: string; email: string; telefono?: string; tipo: string
  totalStrikes: number; baneoHasta?: string; createdAt: string
  perfil?: { posicion: string; nivel: string; distrito: string; precio: number; rating: number; puntos: number; totalPartidos: number; verificado: boolean }
  _count: { solicitudes: number; partidosOrg: number }
}

export default function AdminJugadoresPage() {
  const [usuarios, setUsuarios] = useState<UserAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState('JUGADOR')
  const [filtroBan, setFiltroBan] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [msg, setMsg] = useState('')

  function fetchData() {
    const token = localStorage.getItem('adminToken')
    const params = new URLSearchParams({ tipo: filtroTipo })
    if (filtroBan) params.set('baneados', 'true')
    if (busqueda) params.set('q', busqueda)
    setLoading(true)
    fetch(`/api/admin/usuarios?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => setUsuarios(j.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [filtroTipo, filtroBan])

  async function accion(id: string, accion: string, dias?: number) {
    const token = localStorage.getItem('adminToken')
    const res = await fetch(`/api/admin/usuarios/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ accion, dias })
    })
    const json = await res.json()
    setMsg(json.data?.mensaje || json.error)
    fetchData()
    setTimeout(() => setMsg(''), 3000)
  }

  const ahora = new Date()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
        <p className="text-gray-400 mt-1">Administra jugadores, organizadores y clubes</p>
      </div>

      {msg && <div className="bg-green-900/50 border border-green-700 text-green-300 rounded-xl px-4 py-3 text-sm mb-4">{msg}</div>}

      <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Tipo</label>
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm">
            <option value="JUGADOR">Jugadores</option>
            <option value="ORGANIZADOR">Organizadores</option>
            <option value="CLUB">Clubes</option>
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Buscar</label>
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
            placeholder="Nombre o email..." />
        </div>
        <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
          <input type="checkbox" checked={filtroBan} onChange={e => setFiltroBan(e.target.checked)} className="rounded" />
          Solo baneados
        </label>
        <button onClick={fetchData} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition">Buscar</button>
      </div>

      <div className="text-gray-400 text-sm mb-3">{usuarios.length} usuarios encontrados</div>

      {loading ? (
        <div className="text-center py-10 text-gray-400 animate-pulse">Cargando...</div>
      ) : (
        <div className="space-y-3">
          {usuarios.map(u => {
            const esBaneado = u.baneoHasta && new Date(u.baneoHasta) > ahora
            return (
              <div key={u.id} className={`bg-gray-800 rounded-xl border p-4 ${esBaneado ? 'border-red-800' : 'border-gray-700'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold">{u.nombre}</span>
                      {esBaneado && <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded-full">🚫 Baneado hasta {new Date(u.baneoHasta!).toLocaleDateString('es-PE')}</span>}
                      {u.perfil?.verificado && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">✓ Verificado</span>}
                      {u.totalStrikes > 0 && <span className="text-xs bg-amber-900 text-amber-300 px-2 py-0.5 rounded-full">{u.totalStrikes} strike{u.totalStrikes > 1 ? 's' : ''}</span>}
                    </div>
                    <p className="text-gray-400 text-sm mt-0.5">{u.email} {u.telefono && `· ${u.telefono}`}</p>
                    {u.perfil && (
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
                        <span>{u.perfil.posicion}</span>
                        <span>·</span>
                        <span>{u.perfil.nivel}</span>
                        <span>·</span>
                        <span>{u.perfil.distrito}</span>
                        <span>·</span>
                        <span>★ {u.perfil.rating.toFixed(1)}</span>
                        <span>·</span>
                        <span>{formatPrecio(u.perfil.precio)}</span>
                        <span>·</span>
                        <span>{u.perfil.totalPartidos} partidos</span>
                        <span>·</span>
                        <span>{u.perfil.puntos} pts</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!esBaneado ? (
                      <>
                        <button onClick={() => accion(u.id, 'banear', 7)}
                          className="text-xs bg-red-900/50 text-red-300 border border-red-800 px-3 py-1.5 rounded-lg hover:bg-red-900 transition">
                          Banear 7d
                        </button>
                        <button onClick={() => accion(u.id, 'banear', 30)}
                          className="text-xs bg-red-900/50 text-red-300 border border-red-800 px-3 py-1.5 rounded-lg hover:bg-red-900 transition">
                          Banear 30d
                        </button>
                      </>
                    ) : (
                      <button onClick={() => accion(u.id, 'desbanear')}
                        className="text-xs bg-green-900/50 text-green-300 border border-green-800 px-3 py-1.5 rounded-lg hover:bg-green-900 transition">
                        Levantar baneo
                      </button>
                    )}
                    {u.perfil && !u.perfil.verificado && (
                      <button onClick={() => accion(u.id, 'verificar')}
                        className="text-xs bg-blue-900/50 text-blue-300 border border-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-900 transition">
                        Verificar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
