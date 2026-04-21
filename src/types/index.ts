export type UserTipo = 'JUGADOR' | 'ORGANIZADOR' | 'CLUB'
export type Posicion = 'ARQUERO' | 'DEFENSA' | 'MEDIOCAMPISTA' | 'DELANTERO' | 'DERECHA' | 'REVES'
export type PartidoStatus = 'ABIERTO' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO'
export type SolicitudStatus = 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO'
export type TransaccionStatus = 'PENDIENTE' | 'PAGADO'
export type Modalidad = '5VS5' | '7VS7' | '11VS11' | '2VS2'

export interface DisponibilidadDia {
  dia: string
  inicio: string
  fin: string
}

export interface PosicionNecesaria {
  posicion: Posicion
  cantidad: number
}

export interface Usuario {
  id: string
  email: string
  nombre: string
  telefono?: string
  tipo: UserTipo
  codigoReferido: string
  createdAt: string
  perfil?: JugadorPerfil
  club?: Club
}

export interface JugadorPerfil {
  id: string
  usuarioId: string
  deporte?: string
  posicion: Posicion
  nivel?: string
  distrito: string
  descripcion?: string
  precio: number
  puntos: number
  rating: number
  totalResenas: number
  totalPartidos: number
  foto?: string
  disponibilidad: DisponibilidadDia[]
  verificado: boolean
  usuario?: Usuario
}

export interface Club {
  id: string
  usuarioId: string
  nombre: string
  distrito: string
  descripcion?: string
  telefono?: string
  usuario?: Usuario
}

export interface Partido {
  id: string
  organizadorId: string
  organizador?: Usuario
  clubId?: string
  club?: Club
  deporte?: string
  titulo: string
  descripcion?: string
  distrito: string
  direccion?: string
  fecha: string
  duracion: number
  modalidad: Modalidad
  posiciones: PosicionNecesaria[]
  nivelRequerido?: string
  tipoPago?: string
  cuotaCosto?: number
  pagoJugador?: number
  presupuestoMax?: number
  destacado?: boolean
  completado?: boolean
  status: PartidoStatus
  createdAt: string
  solicitudes?: Solicitud[]
}

export interface Solicitud {
  id: string
  partidoId: string
  partido?: Partido
  jugadorId: string
  jugador?: Usuario
  posicion: Posicion
  precio: number
  mensaje?: string
  status: SolicitudStatus
  asistio?: boolean | null
  createdAt: string
}

export interface Resena {
  id: string
  jugadorId: string
  jugador?: Usuario
  autorId: string
  autor?: Usuario
  partidoId?: string
  rating: number
  comentario?: string
  createdAt: string
}

export interface Transaccion {
  id: string
  jugadorId: string
  jugador?: Usuario
  partidoId: string
  partido?: Partido
  monto: number
  comision: number
  neto: number
  status: TransaccionStatus
  createdAt: string
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}
