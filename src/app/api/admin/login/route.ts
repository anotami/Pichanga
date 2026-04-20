import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  const { password } = await request.json()
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin-pichanga-2024'
  const JWT_SECRET = process.env.JWT_SECRET || 'pichanga-secret'

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' })
  return NextResponse.json({ data: { token } })
}
