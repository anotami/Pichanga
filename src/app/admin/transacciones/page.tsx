'use client'
import { useState, useEffect } from 'react'
import { formatPrecio } from '@/lib/constants'

interface TxData {
  transacciones: Array<{
    id: string; monto: number; comision: number; neto: number; tipo: string; status: string; createdAt: string
    jugador: { nombre: string; email: string }
    partido: { titulo: string; distrito: string }
  }>
  resumenIngresos: { _sum: { comision: number; monto: number; neto: number }; _count: number }
  alertasDestacadas: Array<{
    id: string; monto: number; pagado: boolean; createdAt: string
    partido: { titulo: string; distrito: string }
  }>
}

export default function AdminTransaccionesPage() {
  const [data, setData] = useState<TxData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'tx' | 'alertas'>('tx')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    fetch('/api/admin/transacciones', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => setData(j.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse">Cargando...</div>
  if (!data) return null

  const comisiones = data.resumenIngresos._sum.comision ?? 0
  const volumen = data.resumenIngresos._sum.monto ?? 0
  const ingresosAlertas = data.alertasDestacadas.filter(a => a.pagado).reduce((s, a) => s + a.monto, 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Transacciones</h1>
        <p className="text-gray-400 mt-1">Auditoría de pagos y comisiones</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Comisiones (10%)', value: formatPrecio(comisiones), color: 'text-green-400' },
          { label: 'Alertas destacadas', value: formatPrecio(ingresosAlertas), color: 'text-amber-400' },
          { label: 'Volumen total', value: formatPrecio(volumen), color: 'text-blue-400' },
          { label: 'N° transacciones', value: data.resumenIngresos._count, color: 'text-white' },
        ].map(k => (
          <div key={k.label} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">{k.label}</p>
            <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-4">
        <p className="text-gray-400 text-sm">
          💰 <strong className="text-white">Ingresos totales plataforma:</strong>{' '}
          <span className="text-green-400 font-bold text-lg">{formatPrecio(comisiones + ingresosAlertas)}</span>
          {' '}= comisiones de partidos + alertas destacadas
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        {(['tx', 'alertas'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'}`}>
            {t === 'tx' ? `Transacciones (${data.transacciones.length})` : `Alertas destacadas (${data.alertasDestacadas.length})`}
          </button>
        ))}
      </div>

      {tab === 'tx' && (
        <div className="space-y-2">
          {data.transacciones.map(tx => (
            <div key={tx.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-white font-medium">{tx.jugador.nombre}</p>
                  <p className="text-gray-400 text-sm">{tx.partido.titulo} · {tx.partido.distrito}</p>
                  <p className="text-gray-500 text-xs mt-1">{new Date(tx.createdAt).toLocaleDateString('es-PE')}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-3 flex-wrap justify-end">
                    <div className="text-center">
                      <p className="text-white font-bold">{formatPrecio(tx.monto)}</p>
                      <p className="text-gray-500 text-xs">monto</p>
                    </div>
                    <div className="text-center">
                      <p className="text-red-400 font-semibold">{formatPrecio(tx.comision)}</p>
                      <p className="text-gray-500 text-xs">comisión</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-400 font-semibold">{formatPrecio(tx.neto)}</p>
                      <p className="text-gray-500 text-xs">al jugador</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${tx.status === 'PAGADO' ? 'bg-green-900 text-green-300' : 'bg-amber-900 text-amber-300'}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'alertas' && (
        <div className="space-y-2">
          {data.alertasDestacadas.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No hay alertas destacadas aún</div>
          ) : data.alertasDestacadas.map(a => (
            <div key={a.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{a.partido.titulo}</p>
                <p className="text-gray-400 text-sm">{a.partido.distrito} · {new Date(a.createdAt).toLocaleDateString('es-PE')}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-amber-400 font-bold">{formatPrecio(a.monto)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${a.pagado ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                  {a.pagado ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
