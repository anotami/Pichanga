export const POSICIONES = [
  { value: 'ARQUERO', label: 'Arquero', emoji: '🧤', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  { value: 'DEFENSA', label: 'Defensa', emoji: '🛡️', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  { value: 'MEDIOCAMPISTA', label: 'Mediocampista', emoji: '⚽', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  { value: 'DELANTERO', label: 'Delantero', emoji: '⚡', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
]

export const POSICIONES_PADEL = [
  { value: 'DERECHA', label: 'Derecha', emoji: '🎾', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  { value: 'REVES', label: 'Revés', emoji: '🏓', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
]

export const NIVELES_PADEL = [
  { value: 'PRINCIPIANTE', label: 'Principiante', emoji: '🌱', desc: 'Empezando a jugar pádel' },
  { value: 'INTERMEDIO', label: 'Intermedio', emoji: '🎯', desc: 'Juego regular, buen manejo' },
  { value: 'AVANZADO', label: 'Avanzado', emoji: '🏆', desc: 'Alto nivel técnico' },
  { value: 'COMPETIDOR', label: 'Competidor', emoji: '⭐', desc: 'Nivel competitivo' },
]

export const MODALIDADES_PADEL = [
  { value: '2VS2', label: 'Pádel 2vs2' },
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
  { nombre: 'Rookie',   min: 0,    icon: '🌱', color: 'text-gray-600',   bg: 'bg-gray-100',    border: 'border-gray-300',   gradient: 'from-gray-400 to-gray-500' },
  { nombre: 'Bronce',   min: 50,   icon: '🥉', color: 'text-amber-800',  bg: 'bg-amber-100',   border: 'border-amber-300',  gradient: 'from-amber-500 to-amber-700' },
  { nombre: 'Plata',    min: 200,  icon: '🥈', color: 'text-slate-700',  bg: 'bg-slate-100',   border: 'border-slate-300',  gradient: 'from-slate-400 to-slate-600' },
  { nombre: 'Oro',      min: 500,  icon: '🥇', color: 'text-yellow-700', bg: 'bg-yellow-100',  border: 'border-yellow-400', gradient: 'from-yellow-400 to-yellow-600' },
  { nombre: 'Platino',  min: 1000, icon: '💎', color: 'text-cyan-700',   bg: 'bg-cyan-50',     border: 'border-cyan-400',   gradient: 'from-cyan-400 to-cyan-600' },
  { nombre: 'Leyenda',  min: 2000, icon: '👑', color: 'text-purple-700', bg: 'bg-purple-100',  border: 'border-purple-400', gradient: 'from-purple-500 to-purple-700' },
]

export function getRango(puntos: number) {
  return [...RANGOS].reverse().find(r => puntos >= r.min) ?? RANGOS[0]
}

export function getProgresoRango(puntos: number) {
  const idx = [...RANGOS].reverse().findIndex(r => puntos >= r.min)
  const rangoActual = [...RANGOS].reverse()[idx]
  const rangoIdx = RANGOS.indexOf(rangoActual)
  if (rangoIdx === RANGOS.length - 1) return { porcentaje: 100, puntosNecesarios: 0, siguiente: null }
  const siguiente = RANGOS[rangoIdx + 1]
  const rango_min = rangoActual.min
  const siguiente_min = siguiente.min
  const porcentaje = Math.min(Math.round(((puntos - rango_min) / (siguiente_min - rango_min)) * 100), 99)
  return { porcentaje, puntosNecesarios: siguiente_min - puntos, siguiente }
}

export interface Insignia { id: string; emoji: string; nombre: string; descripcion: string; ganada: boolean }

export function getInsignias(p: { totalPartidos: number; rating: number; totalResenas: number; verificado: boolean }): Insignia[] {
  return [
    { id: 'debut',        emoji: '🎮', nombre: 'Debut',        descripcion: 'Jugaste tu primer partido',  ganada: p.totalPartidos >= 1  },
    { id: 'racha',        emoji: '🔥', nombre: 'En racha',     descripcion: '5 o más partidos jugados',   ganada: p.totalPartidos >= 5  },
    { id: 'veterano',     emoji: '⚽', nombre: 'Veterano',     descripcion: '20 partidos completados',    ganada: p.totalPartidos >= 20 },
    { id: 'centenario',   emoji: '💯', nombre: 'Centenario',   descripcion: '50 partidos completados',    ganada: p.totalPartidos >= 50 },
    { id: 'bien-valorado',emoji: '⭐', nombre: 'Bien valorado',descripcion: 'Rating promedio 4.5+',       ganada: p.rating >= 4.5       },
    { id: 'top-player',   emoji: '🌟', nombre: 'Top player',   descripcion: 'Rating promedio 4.8+',       ganada: p.rating >= 4.8       },
    { id: 'popular',      emoji: '❤️', nombre: 'Popular',      descripcion: '10 o más reseñas recibidas', ganada: p.totalResenas >= 10  },
    { id: 'verificado',   emoji: '✅', nombre: 'Verificado',   descripcion: 'Identidad verificada',       ganada: p.verificado          },
  ]
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

export function getPosicionPadel(value: string) {
  return POSICIONES_PADEL.find(p => p.value === value)
}

export function getNivelPadel(value: string) {
  return NIVELES_PADEL.find(n => n.value === value)
}
