import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = (p: string) => bcrypt.hash(p, 10)

  // Clubes
  const club1 = await prisma.usuario.create({
    data: {
      email: 'limadeportivo@pichanga.pe',
      password: await hash('club123'),
      nombre: 'Lima Deportivo FC',
      telefono: '01-234-5678',
      tipo: 'CLUB',
      club: {
        create: {
          nombre: 'Lima Deportivo FC',
          distrito: 'Miraflores',
          descripcion: 'Club deportivo con más de 20 años de historia en Miraflores. Canchas reglamentarias y vestuarios.',
          telefono: '01-234-5678'
        }
      }
    },
    include: { club: true }
  })

  const club2 = await prisma.usuario.create({
    data: {
      email: 'atleticosurco@pichanga.pe',
      password: await hash('club123'),
      nombre: 'Atlético Surco',
      telefono: '987-654-321',
      tipo: 'CLUB',
      club: {
        create: {
          nombre: 'Atlético Surco',
          distrito: 'Santiago de Surco',
          descripcion: 'Organizamos pichangas todos los fines de semana. Ambiente familiar y competitivo.'
        }
      }
    },
    include: { club: true }
  })

  // Organizador
  const org1 = await prisma.usuario.create({
    data: {
      email: 'jorge.org@pichanga.pe',
      password: await hash('org123'),
      nombre: 'Jorge Villegas',
      telefono: '987-123-456',
      tipo: 'ORGANIZADOR'
    }
  })

  // Jugadores
  const jugadores = [
    { nombre: 'Carlos Quispe', email: 'carlos.q@pichanga.pe', posicion: 'ARQUERO', distrito: 'San Juan de Miraflores', precio: 60, rating: 4.8, puntos: 420, desc: 'Arquero con 8 años de experiencia. Reflejos rápidos y buen juego aéreo. Disponible fines de semana.' },
    { nombre: 'Luis Mamani', email: 'luis.m@pichanga.pe', posicion: 'DEFENSA', distrito: 'San Martín de Porres', precio: 45, rating: 4.5, puntos: 280, desc: 'Central sólido. Buen juego de cabeza y marca firme. Juego en ligas amateur de SMP.' },
    { nombre: 'Diego Huanca', email: 'diego.h@pichanga.pe', posicion: 'MEDIOCAMPISTA', distrito: 'Miraflores', precio: 55, rating: 4.9, puntos: 650, desc: 'Mediocampista creativo. Buena visión de juego y pase filtrado. Elite verificado.' },
    { nombre: 'Jesús Tapia', email: 'jesus.t@pichanga.pe', posicion: 'DELANTERO', distrito: 'San Borja', precio: 70, rating: 4.7, puntos: 380, desc: 'Delantero rápido y goleador. +50 goles en ligas amateur. Disponible tardes.' },
    { nombre: 'Roberto Ccori', email: 'roberto.c@pichanga.pe', posicion: 'DEFENSA', distrito: 'Surquillo', precio: 40, rating: 4.2, puntos: 150, desc: 'Lateral derecho. Buen despliegue físico y proyección ofensiva.' },
    { nombre: 'Anderson Flores', email: 'anderson.f@pichanga.pe', posicion: 'DELANTERO', distrito: 'Los Olivos', precio: 50, rating: 4.6, puntos: 310, desc: 'Extremo izquierdo veloz. Buen dominio de balón y definición.' },
    { nombre: 'Marco Inca', email: 'marco.i@pichanga.pe', posicion: 'ARQUERO', distrito: 'La Molina', precio: 80, rating: 4.9, puntos: 720, desc: 'Arquero profesional retirado. Excelente en salidas y penales. Elite de la plataforma.' },
    { nombre: 'Paolo Rios', email: 'paolo.r@pichanga.pe', posicion: 'MEDIOCAMPISTA', distrito: 'Chorrillos', precio: 48, rating: 4.3, puntos: 190, desc: 'Volante de contención. Buen robo de balón y distribución simple.' },
  ]

  const createdJugadores = []
  for (const j of jugadores) {
    const dispo = [
      { dia: 'SÁBADO', inicio: '08:00', fin: '22:00' },
      { dia: 'DOMINGO', inicio: '08:00', fin: '20:00' },
      { dia: 'VIERNES', inicio: '18:00', fin: '22:00' }
    ]
    const u = await prisma.usuario.create({
      data: {
        email: j.email,
        password: await hash('jugador123'),
        nombre: j.nombre,
        tipo: 'JUGADOR',
        perfil: {
          create: {
            posicion: j.posicion,
            distrito: j.distrito,
            precio: j.precio,
            rating: j.rating,
            puntos: j.puntos,
            descripcion: j.desc,
            totalResenas: Math.floor(Math.random() * 20) + 5,
            totalPartidos: Math.floor(Math.random() * 30) + 10,
            verificado: j.puntos >= 300,
            disponibilidad: JSON.stringify(dispo)
          }
        }
      }
    })
    createdJugadores.push(u)
  }

  // Partidos
  const ahora = new Date()
  const manana = new Date(ahora); manana.setDate(ahora.getDate() + 1); manana.setHours(10, 0, 0, 0)
  const sabado = new Date(ahora); sabado.setDate(ahora.getDate() + (6 - ahora.getDay() + 7) % 7 || 7); sabado.setHours(9, 0, 0, 0)
  const domingo = new Date(sabado); domingo.setDate(sabado.getDate() + 1); domingo.setHours(11, 0, 0, 0)
  const siguiente = new Date(ahora); siguiente.setDate(ahora.getDate() + 3); siguiente.setHours(20, 0, 0, 0)

  await prisma.partido.create({
    data: {
      organizadorId: club1.id,
      clubId: club1.club!.id,
      titulo: 'Se busca arquero para fulbito sabatino',
      descripcion: 'Equipo consolidado busca arquero para completar el 11. Somos serios y puntuales. Cancha sintética.',
      distrito: 'Miraflores',
      direccion: 'Av. Larco 350, cancha 3',
      fecha: sabado,
      duracion: 90,
      modalidad: '5VS5',
      posiciones: JSON.stringify([{ posicion: 'ARQUERO', cantidad: 1 }]),
      presupuestoMax: 80,
      status: 'ABIERTO'
    }
  })

  await prisma.partido.create({
    data: {
      organizadorId: org1.id,
      titulo: 'Necesito defensa y delantero para 7vs7',
      descripcion: 'Partido de 7vs7 el domingo por la mañana. Buen nivel, somos respetuosos.',
      distrito: 'San Borja',
      direccion: 'Complejo deportivo San Borja',
      fecha: domingo,
      duracion: 90,
      modalidad: '7VS7',
      posiciones: JSON.stringify([
        { posicion: 'DEFENSA', cantidad: 1 },
        { posicion: 'DELANTERO', cantidad: 1 }
      ]),
      presupuestoMax: 60,
      status: 'ABIERTO'
    }
  })

  await prisma.partido.create({
    data: {
      organizadorId: club2.id,
      clubId: club2.club!.id,
      titulo: 'Atlético Surco busca mediocampista para liga',
      descripcion: 'Somos club establecido en Surco. Jugamos liga los domingos. Buscamos mediocampista de buen nivel.',
      distrito: 'Santiago de Surco',
      fecha: manana,
      duracion: 60,
      modalidad: '5VS5',
      posiciones: JSON.stringify([{ posicion: 'MEDIOCAMPISTA', cantidad: 2 }]),
      presupuestoMax: 55,
      status: 'ABIERTO'
    }
  })

  await prisma.partido.create({
    data: {
      organizadorId: org1.id,
      titulo: 'Pichanga nocturna - todos los jueves',
      descripcion: 'Organizamos pichanga todas las semanas. Esta vez nos falta un delantero y un arquero.',
      distrito: 'La Victoria',
      direccion: 'Av. Grau 800',
      fecha: siguiente,
      duracion: 60,
      modalidad: '5VS5',
      posiciones: JSON.stringify([
        { posicion: 'ARQUERO', cantidad: 1 },
        { posicion: 'DELANTERO', cantidad: 1 }
      ]),
      status: 'ABIERTO'
    }
  })

  // Reseñas para los jugadores top
  const resenaData = [
    { jugador: 0, autor: org1.id, rating: 5, comentario: 'Excelente arquero, atajó todo. Lo volvería a contratar.' },
    { jugador: 0, autor: club1.id, rating: 5, comentario: 'Muy puntual y profesional. Atajó penales clave.' },
    { jugador: 2, autor: org1.id, rating: 5, comentario: 'Diego tiene una visión de juego increíble. 100% recomendado.' },
    { jugador: 3, autor: club2.id, rating: 5, comentario: 'Jesús es un goleador nato. Metió 3 goles en 60 minutos.' },
    { jugador: 1, autor: org1.id, rating: 4, comentario: 'Buen defensa, bien posicionado y fuerte en el juego aéreo.' },
  ]

  for (const r of resenaData) {
    await prisma.resena.create({
      data: {
        jugadorId: createdJugadores[r.jugador].id,
        autorId: r.autor,
        rating: r.rating,
        comentario: r.comentario
      }
    })
  }

  console.log('✅ Seed completado exitosamente')
  console.log('\nCuentas de prueba:')
  console.log('Jugador:     carlos.q@pichanga.pe / jugador123')
  console.log('Jugador:     diego.h@pichanga.pe / jugador123')
  console.log('Organizador: jorge.org@pichanga.pe / org123')
  console.log('Club:        limadeportivo@pichanga.pe / club123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
