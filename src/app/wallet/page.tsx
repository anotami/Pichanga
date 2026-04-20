'use client'
import { useState, useEffect } from 'react'
import { formatPrecio, formatFecha } from '@/lib/constants'
import Link from 'next/link'

interface WalletData {
  wallet: { saldo: number; updatedAt: string }
  transacciones: Array<{
    id: string; monto: number; comision: number; neto: number; tipo: string; status: string; createdAt: string
    partido: { titulo: string; distrito: string; fecha: string }
  }>
  pendiente: number
}

export default function WalletPage() {
  const [data, setData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [retirando, setRetirando] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/login'; return }
    fetch('/api/wallet', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(j => setData(j.data))
      .finally(() => setLoading(false))
  }, [])

  async function retirar() {
    if (!data || data.wallet.saldo <= 0) return
    setRetirando(true)
    const token = localStorage.getItem('token')
    const res = await fetch('/api/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ accion: 'retirar', monto: data.wallet.saldo }),
    })
    const json = await res.json()
    setMsg(json.data?.mensaje || json.error)
    setRetirando(false)
    if (json.data) {
      setData(prev => prev ? { ...prev, wallet: { ...prev.wallet, saldo: 0 } } : null)
    }
    setTimeout(() => setMsg(''), 4000)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">Cargando billetera...</div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white mb-4">Debes iniciar sesión</p>
        <Link href="/login" className="bg-red-600 text-white px-6 py-2 rounded-xl">Iniciar sesión</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Mi Billetera</h1>
          <p className="text-gray-400 mt-1">Tus ganancias en Pichanga</p>
        </div>

        {msg && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 rounded-xl px-4 py-3 text-sm mb-4">{msg}</div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 text-white">
            <p className="text-red-200 text-sm mb-1">Saldo disponible</p>
            <p className="text-4xl font-bold">{formatPrecio(data.wallet.saldo)}</p>
            <p className="text-red-300 text-xs mt-2">Actualizado {new Date(data.wallet.updatedAt).toLocaleDateString('es-PE')}</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Por cobrar</p>
            <p className="text-3xl font-bold text-amber-400">{formatPrecio(data.pendiente)}</p>
            <p className="text-gray-500 text-xs mt-2">En partidos pendientes</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 mb-6">
          <h3 className="text-white font-semibold mb-4">Retirar fondos</h3>
          <p className="text-gray-400 text-sm mb-4">
            Retira tu saldo a tu cuenta bancaria o billetera digital (Yape, Plin, BCP, Interbank).
          </p>
          <div className="bg-amber-900/30 border border-amber-700 rounded-xl p-3 mb-4">
            <p className="text-amber-300 text-xs">
              ⚠️ Próximamente: integración con Culqi y Yape para retiros instantáneos. Por ahora, contáctanos por WhatsApp para coordinar el pago.
            </p>
          </div>
          <button
            onClick={retirar}
            disabled={retirando || data.wallet.saldo <= 0}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {retirando ? 'Procesando...' : `Retirar ${formatPrecio(data.wallet.saldo)}`}
          </button>
        </div>

        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Historial de transacciones</h3>
          {data.transacciones.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-3">💰</div>
              <p>Aún no tienes transacciones</p>
              <p className="text-sm mt-1">Participa en partidos para ganar dinero</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.transacciones.map(tx => (
                <div key={tx.id} className="border border-gray-700 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white text-sm font-medium">{tx.partido.titulo}</p>
                      <p className="text-gray-400 text-xs">{tx.partido.distrito} · {formatFecha(tx.partido.fecha)}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{new Date(tx.createdAt).toLocaleDateString('es-PE')}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-green-400 font-bold">{formatPrecio(tx.neto)}</p>
                      <p className="text-gray-500 text-xs">neto</p>
                      <div className="flex items-center gap-1.5 mt-1 justify-end">
                        <span className="text-gray-500 text-xs line-through">{formatPrecio(tx.monto)}</span>
                        <span className="text-red-400 text-xs">-{formatPrecio(tx.comision)}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${tx.status === 'PAGADO' ? 'bg-green-900 text-green-300' : 'bg-amber-900 text-amber-300'}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
