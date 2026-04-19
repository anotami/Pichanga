const BASE = '/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

function authHeaders(): HeadersInit {
  const token = getToken()
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...options, headers: { ...authHeaders(), ...options?.headers } })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Error en la solicitud')
  return json.data
}

export const api = {
  get: <T>(path: string) => req<T>(path),
  post: <T>(path: string, body: unknown) => req<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => req<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => req<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
}
