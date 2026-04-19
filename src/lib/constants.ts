export const POSICIONES = [
  { value: 'ARQUERO', label: 'Arquero', emoji: '🧤', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  { value: 'DEFENSA', label: 'Defensa', emoji: '🛡️', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  { value: 'MEDIOCAMPISTA', label: 'Mediocampista', emoji: '⚽', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  { value: 'DELANTERO', label: 'Delantero', emoji: '⚡', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
]

export const NIVELES = [
  { value: 'AMATEUR', label: 'Amateur', emoji: '⚽', desc: 'Juego recreativo, diversión ante todo' },
  { value: 'INTERMEDIO', label: 'Intermedio', emoji: '🏅', desc: 'Liga amateur, buen nivel técnico' },
  { value: 'COMPETITIVO', label: 'Competitivo', emoji: '🏆', desc: 'Liga organizada, nivel alto' },
]

export const PIERNAS = [
  { value: 'DERECHA', label: 'Derecha' },
  { value: 'IZQUIERDA', label: 'Izquierda' },
  { value: 'AMBAS', label: 'Ambidiestro' },
]

export const MODALIDADES = [
  { value: '5VS5', label: 'Fulbito 5vs5' },
  { value: '7VS7', label: 'Fútbol 7vs7' },
  { value: '11VS11', label: 'Fútbol 11vs11' },
]

export const DIAS_SEMANA = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO']

export const DISTRITOS = [
  'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chorrillos', 'Comas',
  'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria',
  'Lince', 'Los Olivos', 'Lurigancho', 'Lurín', 'Magdalena del Mar',
  'Miraflores', 'Pueblo Libre', 'Puente Piedra', 'Rímac', 'San Borja',
  'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores',
  'San Luis', 'San Martín de Porres', 'San Miguel', 'Santa Anita',
  'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo',
  'Cercado de Lima', 'Callao',
  'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Cusco',
  'Huancayo', 'Tacna', 'Ica', 'Puno'
].sort()

export const COMISION_PLATAFORMA = 0.10
export const PRECIO_DESTACADO = 5 // S/ para destacar partido
export const DIAS_BANEO_PRIMER_NO_SHOW = 7
export const DIAS_BANEO_SEGUNDO_NO_SHOW = 30

export const PUNTOS_POR_RATING: Record<number, number> = { 5: 10, 4: 5, 3: 3, 2: 1, 1: 0 }

export const RANGOS = [
  { nombre: 'Rookie', min: 0, color: 'text-gray-600', bg: 'bg-gray-100' },
  { nombre: 'Amateur', min: 100, color: 'text-green-700', bg: 'bg-green-100' },
  { nombre: 'Profesional', min: 300, color: 'text-blue-700', bg: 'bg-blue-100' },
  { nombre: 'Elite', min: 600, color: 'text-amber-700', bg: 'bg-amber-100' },
]

export function getRango(puntos: number) {
  return [...RANGOS].reverse().find(r => puntos >= r.min) ?? RANGOS[0]
}

export function getPosicion(value: string) {
  return POSICIONES.find(p => p.value === value)
}

export function getNivel(value: string) {
  return NIVELES.find(n => n.value === value)
}

export function formatPrecio(precio: number): string {
  return `S/ ${precio.toFixed(2)}`
}

export function formatFecha(fecha: string | Date): string {
  return new Date(fecha).toLocaleDateString('es-PE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

export function formatHora(fecha: string | Date): string {
  return new Date(fecha).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

export function esBaneado(baneoHasta?: string | Date | null): boolean {
  if (!baneoHasta) return false
  return new Date(baneoHasta) > new Date()
}
