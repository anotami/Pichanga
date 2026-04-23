import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PWD_NPC  = '$2a$10$7fsHQXRViUJ3qUE4LyxH0.qLOnd4NUAKvEFlbhLLT7Q4U.tk3m3Q6'
const PWD_ORG  = '$2a$10$Py2fIWq8HbuWSwqeJAAic.a03j6EiSYoKWkKHTA665nOEbCnY7LOO'

const NOMBRES = [
  'Diego','Carlos','Luis','Juan','José','Miguel','Ángel','Fernando','Eduardo','Roberto',
  'César','Manuel','Jorge','Ricardo','Rodrigo','Daniel','Alejandro','Óscar','Iván','Paulo',
  'Renato','Wilder','Jhon','Kevin','Bryan','Anthony','Jefferson','Cristian','Alex','Marco',
  'Giancarlo','Paolo','Renzo','Piero','Aldo','Bruno','Franco','Sebastián','Nicolás','Andrés',
  'Felipe','Arturo','Gustavo','Henry','Raúl','Edinson','Anderson','Josué','Martín','Víctor',
  'Ernesto','Gerardo','Flavio','Dante','Rafael','Marcos','Pablo','Gabriel','Mateo','Adrián',
  'David','Fabricio','Samuel','André','Mario','Leonardo','Gianfranco','Luca','Jhonatan','Erwin',
  'Willy','Jean','Pierre','Claudio','Thiago','Lionel','Yosmer','Yordan','Álvaro','Rodrigo',
  'Cristopher','Michael','Jonathan','Richard','Steven','Percy','Elvis','Nixon','Segundo','Walter',
]
const APELLIDOS = [
  'García','Rodríguez','López','Martínez','González','Flores','Torres','Ramírez','Pérez','Sánchez',
  'Castro','Díaz','Mendoza','Vargas','Morales','Reyes','Chávez','Cruz','Huanca','Mamani',
  'Quispe','Condori','Villanueva','Palomino','Espinoza','Cárdenas','Rojas','Delgado','Ramos','Guerrero',
  'Medina','Cabrera','Vega','Herrera','Luna','Salinas','Núñez','Ponce','Ruiz','Obregón',
  'Paredes','Ríos','Aguirre','Tapia','Ortega','Campos','Valdivia','Ccopa','Apaza','Coaquira',
  'Catacora','Huaripata','Llanos','Montes','Nieto','Ocampo','Pacheco','Quiñones','Salas','Tito',
  'Ugarte','Valencia','Zárate','Arenas','Benítez','Caballero','Durand','Estrada','Fuentes','Gallardo',
  'Hidalgo','Inga','Jara','Lora','Melgar','Neyra','Orozco','Pinto','Salcedo','Turpo',
  'Vásquez','Wong','Bravo','Cortez','Figueroa','Gutiérrez','Navarro','Polo','Soto','Vilca',
  'Yucra','Zúñiga','Alvarado','Becerra','Cornejo','Flores','Huamán','Izquierdo','Lazo','Meza',
]
const DISTRITOS_PESO = [
  {d:'San Juan de Lurigancho',w:12},{d:'San Martín de Porres',w:9},{d:'Los Olivos',w:8},
  {d:'Ate',w:7},{d:'Comas',w:7},{d:'Villa El Salvador',w:6},{d:'San Juan de Miraflores',w:5},
  {d:'Villa María del Triunfo',w:5},{d:'Chorrillos',w:5},{d:'Santiago de Surco',w:5},
  {d:'San Miguel',w:4},{d:'Independencia',w:3},{d:'Rímac',w:3},{d:'La Molina',w:3},
  {d:'San Borja',w:3},{d:'Miraflores',w:3},{d:'Lince',w:2},{d:'Surquillo',w:2},
  {d:'Pueblo Libre',w:2},{d:'Jesús María',w:2},{d:'Barranco',w:2},{d:'Carabayllo',w:2},
  {d:'San Isidro',w:1},
]
const DESC_FUTBOL = {
  ARQUERO:['Arquero con reflejos rápidos y buen juego con los pies. Disponible fines de semana.','Guardavalla seguro, buena comunicación con la defensa y excelente en salidas.','Portero con experiencia en ligas distritales. Puntual y con equipo propio.','Arquero ágil, sólido en mano a mano y penales. Me adapto a cualquier sistema.','Guardameta seguro y comunicativo. Buena salida y distribución con los pies.'],
  DEFENSA:['Defensa central sólido. Buen juego aéreo y salida limpia desde atrás.','Lateral derecho con llegada al ataque y buena marca. Disponible toda la semana.','Zaguero contundente, buen en el uno a uno. Varios años en ligas del distrito.','Defensa ordenado, buen primer control y pase. Me adapto a 4-4-2 o línea de 3.','Lateral izquierdo veloz, buen en la marca y el desborde.'],
  MEDIOCAMPISTA:['Mediocampista técnico, buena visión de juego y llegada al ataque.','Volante box to box con buena resistencia física. Siempre dejo todo en la cancha.','Enganche con buen pie, asisto y anoto. Creativo y con llegada al área.','Mediocampista defensivo sólido, recupero y distribuyo bien.','Playmaker con buen pase largo y tiro de lejos.'],
  DELANTERO:['Delantero rápido con buen remate. Goleador habitual en ligas barriales.','Centroavante físico, buen juego de espaldas y definición.','Extremo derecho veloz, buen centro y regate.','Nueve clásico, buen posicionamiento y definición con ambas piernas.','Atacante habilidoso, buena técnica individual y asociación.'],
}
const DESC_PADEL = {
  DERECHA:['Jugador de derecha técnico, buen globo y bandeja. Nivel intermedio consolidado.','Derecha ordenado, fondo de cancha sólido. Busco partidos los fines de semana.','Jugador de derecha con excelente volea y red. Me adapto a cualquier ritmo.','Derecha técnico con buen remate y bajada de pared. Puntual y responsable.','Jugador de derecha con años de experiencia. Agresivo en red y sólido en fondo.'],
  REVES:['Revés dominante, especialista en la pared izquierda. Buen chiquita y víbora.','Jugador de revés sólido, fondo de cancha ordenado. Liga recreativa o competitiva.','Revés con buen globo defensivo y salida de pared. Varios torneos locales.','Revés constante y agresivo. Me encanta el pádel competitivo.','Jugador de revés técnico, buena colocación y juego de pared.'],
}

const PARTIDOS_FUTBOL = [
  {titulo:'Fulbito clásico dominguero',distrito:'San Juan de Lurigancho',modalidad:'5VS5',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:15,dias:3,hora:'08:00',posiciones:[{posicion:'ARQUERO',cantidad:1},{posicion:'DEFENSA',cantidad:2}]},
  {titulo:'Partido 7vs7 Los Olivos',distrito:'Los Olivos',modalidad:'7VS7',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:20,dias:5,hora:'19:00',posiciones:[{posicion:'ARQUERO',cantidad:1},{posicion:'DEFENSA',cantidad:1},{posicion:'MEDIOCAMPISTA',cantidad:2}]},
  {titulo:'Buscamos arquero urgente',distrito:'Santiago de Surco',modalidad:'5VS5',duracion:60,tipoPago:'SE_LE_PAGA',pagoJugador:50,dias:2,hora:'20:00',posiciones:[{posicion:'ARQUERO',cantidad:1}]},
  {titulo:'Fútbol 5 vs 5 en Miraflores',distrito:'Miraflores',modalidad:'5VS5',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:25,dias:7,hora:'18:30',posiciones:[{posicion:'DELANTERO',cantidad:2},{posicion:'MEDIOCAMPISTA',cantidad:1}]},
  {titulo:'Clásico del cono norte',distrito:'Comas',modalidad:'7VS7',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:12,dias:4,hora:'17:00',posiciones:[{posicion:'DEFENSA',cantidad:2},{posicion:'DELANTERO',cantidad:1}]},
  {titulo:'Partido nocturno SJM',distrito:'San Juan de Miraflores',modalidad:'5VS5',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:18,dias:6,hora:'20:30',posiciones:[{posicion:'MEDIOCAMPISTA',cantidad:2},{posicion:'DELANTERO',cantidad:1}]},
  {titulo:'San Borja 11 vs 11',distrito:'San Borja',modalidad:'11VS11',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:30,dias:10,hora:'07:00',posiciones:[{posicion:'ARQUERO',cantidad:1},{posicion:'DEFENSA',cantidad:3},{posicion:'MEDIOCAMPISTA',cantidad:2},{posicion:'DELANTERO',cantidad:2}]},
  {titulo:'Fútbol gratis en La Molina',distrito:'La Molina',modalidad:'5VS5',duracion:60,tipoPago:'GRATIS',dias:8,hora:'09:00',posiciones:[{posicion:'DEFENSA',cantidad:1},{posicion:'DELANTERO',cantidad:1}]},
  {titulo:'Pichanga VES sábado tarde',distrito:'Villa El Salvador',modalidad:'5VS5',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:10,dias:9,hora:'15:00',posiciones:[{posicion:'ARQUERO',cantidad:1},{posicion:'MEDIOCAMPISTA',cantidad:1}]},
  {titulo:'Buscamos mediocentro técnico',distrito:'Lince',modalidad:'7VS7',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:22,dias:3,hora:'21:00',posiciones:[{posicion:'MEDIOCAMPISTA',cantidad:2}]},
  {titulo:'Delanteros para 7vs7',distrito:'San Miguel',modalidad:'7VS7',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:20,dias:5,hora:'08:30',posiciones:[{posicion:'DELANTERO',cantidad:2}]},
  {titulo:'Partido SMP jueves noche',distrito:'San Martín de Porres',modalidad:'5VS5',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:15,dias:4,hora:'19:30',posiciones:[{posicion:'DEFENSA',cantidad:1},{posicion:'DELANTERO',cantidad:1}]},
  {titulo:'Necesitamos arquero pagado',distrito:'Surquillo',modalidad:'7VS7',duracion:90,tipoPago:'SE_LE_PAGA',pagoJugador:70,dias:6,hora:'10:00',posiciones:[{posicion:'ARQUERO',cantidad:1}]},
  {titulo:'Pichanga Ate domingo mañana',distrito:'Ate',modalidad:'5VS5',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:12,dias:11,hora:'07:30',posiciones:[{posicion:'MEDIOCAMPISTA',cantidad:1},{posicion:'DELANTERO',cantidad:1}]},
  {titulo:'Fútbol Pueblo Libre tarde',distrito:'Pueblo Libre',modalidad:'5VS5',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:20,dias:7,hora:'16:00',posiciones:[{posicion:'ARQUERO',cantidad:1},{posicion:'DEFENSA',cantidad:1}]},
  {titulo:'Pichanga Barranco bohemia',distrito:'Barranco',modalidad:'5VS5',duracion:60,tipoPago:'GRATIS',dias:12,hora:'18:00',posiciones:[{posicion:'MEDIOCAMPISTA',cantidad:2}]},
  {titulo:'11 vs 11 clásico Chorrillos',distrito:'Chorrillos',modalidad:'11VS11',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:25,dias:14,hora:'08:00',posiciones:[{posicion:'ARQUERO',cantidad:1},{posicion:'DEFENSA',cantidad:2},{posicion:'MEDIOCAMPISTA',cantidad:3},{posicion:'DELANTERO',cantidad:2}]},
  {titulo:'Buscamos defensa para 7vs7',distrito:'Jesús María',modalidad:'7VS7',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:25,dias:2,hora:'20:00',posiciones:[{posicion:'DEFENSA',cantidad:2}]},
  {titulo:'Fulbito nocturno Independencia',distrito:'Independencia',modalidad:'5VS5',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:10,dias:3,hora:'21:00',posiciones:[{posicion:'DELANTERO',cantidad:1},{posicion:'ARQUERO',cantidad:1}]},
  {titulo:'Pichanga Rímac sábado noche',distrito:'Rímac',modalidad:'5VS5',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:12,dias:8,hora:'20:00',posiciones:[{posicion:'MEDIOCAMPISTA',cantidad:1},{posicion:'DEFENSA',cantidad:1}]},
  {titulo:'VMT domingo clásico',distrito:'Villa María del Triunfo',modalidad:'7VS7',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:10,dias:9,hora:'09:00',posiciones:[{posicion:'DEFENSA',cantidad:1},{posicion:'DELANTERO',cantidad:2}]},
  {titulo:'Carabayllo 5vs5 mañanero',distrito:'Carabayllo',modalidad:'5VS5',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:8,dias:6,hora:'07:00',posiciones:[{posicion:'ARQUERO',cantidad:1},{posicion:'MEDIOCAMPISTA',cantidad:1}]},
  {titulo:'Fútbol 5 San Isidro premium',distrito:'San Isidro',modalidad:'5VS5',duracion:60,tipoPago:'SE_LE_PAGA',pagoJugador:80,dias:4,hora:'19:00',posiciones:[{posicion:'DELANTERO',cantidad:1}]},
  {titulo:'Buscamos volante mixto Surco',distrito:'Santiago de Surco',modalidad:'7VS7',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:22,dias:5,hora:'18:00',posiciones:[{posicion:'MEDIOCAMPISTA',cantidad:2},{posicion:'DEFENSA',cantidad:1}]},
  {titulo:'7vs7 Los Olivos fin de semana',distrito:'Los Olivos',modalidad:'7VS7',duracion:90,tipoPago:'GRATIS',dias:10,hora:'10:00',posiciones:[{posicion:'ARQUERO',cantidad:1},{posicion:'DEFENSA',cantidad:1}]},
]
const PARTIDOS_PADEL = [
  {titulo:'Pádel mixto nivel intermedio',distrito:'Miraflores',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:40,dias:2,hora:'18:00',posiciones:[{posicion:'DERECHA',cantidad:1},{posicion:'REVES',cantidad:1}]},
  {titulo:'Busco compañero de revés',distrito:'San Isidro',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:35,dias:3,hora:'07:30',posiciones:[{posicion:'REVES',cantidad:1}]},
  {titulo:'Pádel avanzado Surco',distrito:'Santiago de Surco',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:50,dias:4,hora:'20:00',posiciones:[{posicion:'DERECHA',cantidad:1}]},
  {titulo:'Dobla el sábado Barranco',distrito:'Barranco',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:30,dias:6,hora:'09:00',posiciones:[{posicion:'DERECHA',cantidad:1},{posicion:'REVES',cantidad:1}]},
  {titulo:'Necesitamos derecha para torneo',distrito:'San Borja',duracion:90,tipoPago:'SE_LE_PAGA',pagoJugador:60,dias:5,hora:'19:30',posiciones:[{posicion:'DERECHA',cantidad:1}]},
  {titulo:'Pádel principiante La Molina',distrito:'La Molina',duracion:60,tipoPago:'GRATIS',dias:7,hora:'08:00',posiciones:[{posicion:'DERECHA',cantidad:1},{posicion:'REVES',cantidad:1}]},
  {titulo:'Pádel nocturno Jesús María',distrito:'Jesús María',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:45,dias:3,hora:'21:00',posiciones:[{posicion:'REVES',cantidad:1}]},
  {titulo:'Nivel competidor San Miguel',distrito:'San Miguel',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:55,dias:8,hora:'07:00',posiciones:[{posicion:'DERECHA',cantidad:1}]},
  {titulo:'Jueves pádel Pueblo Libre',distrito:'Pueblo Libre',duracion:60,tipoPago:'PAGA_CUOTA',cuotaCosto:35,dias:4,hora:'18:30',posiciones:[{posicion:'DERECHA',cantidad:1},{posicion:'REVES',cantidad:1}]},
  {titulo:'Pádel Lince fin de semana',distrito:'Lince',duracion:90,tipoPago:'PAGA_CUOTA',cuotaCosto:40,dias:9,hora:'10:00',posiciones:[{posicion:'REVES',cantidad:1}]},
]

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function rndFloat(min, max) { return parseFloat((Math.random() * (max - min) + min).toFixed(1)) }
function weightedPick(items) {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = Math.random() * total
  for (const item of items) { r -= item.weight; if (r <= 0) return item.value }
  return items[items.length - 1].value
}
function pickDistrito() {
  return weightedPick(DISTRITOS_PESO.map(d => ({ value: d.d, weight: d.w })))
}
function genRating() {
  const r = Math.random()
  if (r < 0.10) return rndFloat(2.0, 3.2)
  if (r < 0.30) return rndFloat(3.2, 3.8)
  if (r < 0.70) return rndFloat(3.8, 4.5)
  if (r < 0.90) return rndFloat(4.5, 4.9)
  return 5.0
}
function calcPuntos(totalPartidos, rating) {
  const ptsPerGame = rating >= 4.8 ? 15 : rating >= 4.5 ? 10 : rating >= 4.0 ? 6 : rating >= 3.5 ? 3 : 1
  const activityBonus = totalPartidos >= 100 ? 1.5 : totalPartidos >= 50 ? 1.2 : totalPartidos >= 20 ? 1.0 : 0.8
  return Math.round(totalPartidos * ptsPerGame * activityBonus * (0.85 + Math.random() * 0.30))
}
function genDisponibilidad() {
  const dias = ['LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO','DOMINGO']
  const shuffled = [...dias].sort(() => Math.random() - 0.5).slice(0, rndInt(2, 5))
  const slots = [{inicio:'07:00',fin:'09:00'},{inicio:'09:00',fin:'12:00'},{inicio:'18:00',fin:'21:00'},{inicio:'19:00',fin:'22:00'}]
  return JSON.stringify(shuffled.map(dia => ({ dia, ...pick(slots) })))
}
function diasDesdeHoy(dias, hora = '10:00') {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  const [h, m] = hora.split(':').map(Number)
  d.setHours(h, m, 0, 0)
  return d
}

async function seedNPCs() {
  const existing = await prisma.jugadorPerfil.count({ where: { esNPC: true } })
  if (existing > 0) { console.log(`✓ ${existing} NPCs ya existen`); return }

  console.log('Sembrando 619 jugadores NPC...')
  const BATCH = 40

  // Fútbol
  const posicionesFutbol = [
    ...Array(64).fill('ARQUERO'), ...Array(149).fill('DEFENSA'),
    ...Array(186).fill('MEDIOCAMPISTA'), ...Array(133).fill('DELANTERO'),
  ]
  const nivelesFutbol = (pos) => weightedPick([{value:'AMATEUR',weight:45},{value:'INTERMEDIO',weight:38},{value:'COMPETITIVO',weight:17}])
  const precioFutbol = { ARQUERO:{AMATEUR:[25,55],INTERMEDIO:[50,90],COMPETITIVO:[80,160]}, DEFENSA:{AMATEUR:[20,45],INTERMEDIO:[40,80],COMPETITIVO:[70,140]}, MEDIOCAMPISTA:{AMATEUR:[22,50],INTERMEDIO:[45,85],COMPETITIVO:[75,150]}, DELANTERO:{AMATEUR:[25,55],INTERMEDIO:[50,95],COMPETITIVO:[85,180]} }

  const futbolPlayers = posicionesFutbol.map((posicion, i) => {
    const nivel = nivelesFutbol(posicion)
    const [pMin, pMax] = precioFutbol[posicion][nivel]
    const totalPartidos = nivel === 'COMPETITIVO' ? rndInt(60,220) : nivel === 'INTERMEDIO' ? rndInt(20,80) : rndInt(3,45)
    const rating = genRating()
    return {
      email: `npc.f${String(i+1).padStart(4,'0')}@pichanga.pe`,
      password: PWD_NPC,
      nombre: `${pick(NOMBRES)} ${pick(APELLIDOS)}`,
      tipo: 'JUGADOR',
      perfil: {
        deporte:'FUTBOL', posicion, nivel,
        piernaHabil: weightedPick([{value:'DERECHA',weight:65},{value:'IZQUIERDA',weight:25},{value:'AMBAS',weight:10}]),
        edad: rndInt(17,42), distrito: pickDistrito(),
        descripcion: pick(DESC_FUTBOL[posicion]),
        precio: rndInt(pMin, pMax), rating,
        ratingPuntualidad: rndFloat(Math.max(rating-0.5,1.0), Math.min(rating+0.3,5.0)),
        ratingNivel: rndFloat(Math.max(rating-0.4,1.0), Math.min(rating+0.4,5.0)),
        ratingActitud: rndFloat(Math.max(rating-0.3,1.0), Math.min(rating+0.3,5.0)),
        totalResenas: rndInt(Math.max(1,Math.floor(totalPartidos*0.6)), Math.max(1,totalPartidos)),
        totalPartidos, puntos: calcPuntos(totalPartidos, rating),
        disponibilidad: genDisponibilidad(),
        radioAccion: pick([5,8,10,10,10,15,20]),
        verificado: nivel==='COMPETITIVO' ? Math.random()<0.55 : nivel==='INTERMEDIO' ? Math.random()<0.25 : Math.random()<0.08,
        esNPC: true,
      }
    }
  })

  for (let i = 0; i < futbolPlayers.length; i += BATCH) {
    await Promise.all(futbolPlayers.slice(i, i+BATCH).map(p =>
      prisma.usuario.create({ data: { email:p.email, password:p.password, nombre:p.nombre, tipo:p.tipo, perfil:{ create:p.perfil } } })
    ))
  }
  console.log(`  ✓ 532 jugadores de fútbol`)

  // Pádel
  const padelPlayers = Array.from({ length: 87 }, (_, i) => {
    const posicion = Math.random() < 0.52 ? 'DERECHA' : 'REVES'
    const nivel = weightedPick([{value:'PRINCIPIANTE',weight:35},{value:'INTERMEDIO',weight:38},{value:'AVANZADO',weight:20},{value:'COMPETIDOR',weight:7}])
    const precioP = { PRINCIPIANTE:[20,40], INTERMEDIO:[35,70], AVANZADO:[65,120], COMPETIDOR:[100,200] }
    const [pMin,pMax] = precioP[nivel]
    const totalPartidos = nivel==='COMPETIDOR' ? rndInt(60,160) : nivel==='AVANZADO' ? rndInt(20,70) : nivel==='INTERMEDIO' ? rndInt(10,50) : rndInt(2,25)
    const rating = genRating()
    return {
      email: `npc.p${String(i+1).padStart(3,'0')}@dejada.pe`,
      password: PWD_NPC,
      nombre: `${pick(NOMBRES)} ${pick(APELLIDOS)}`,
      tipo: 'JUGADOR',
      perfil: {
        deporte:'PADEL', posicion, nivel, piernaHabil:'DERECHA',
        edad: rndInt(18,50), distrito: pickDistrito(),
        descripcion: pick(DESC_PADEL[posicion]),
        precio: rndInt(pMin,pMax), rating,
        ratingPuntualidad: rndFloat(Math.max(rating-0.5,1.0), Math.min(rating+0.3,5.0)),
        ratingNivel: rndFloat(Math.max(rating-0.4,1.0), Math.min(rating+0.4,5.0)),
        ratingActitud: rndFloat(Math.max(rating-0.3,1.0), Math.min(rating+0.3,5.0)),
        totalResenas: rndInt(Math.max(1,Math.floor(totalPartidos*0.6)), Math.max(1,totalPartidos)),
        totalPartidos, puntos: calcPuntos(totalPartidos, rating),
        disponibilidad: genDisponibilidad(),
        radioAccion: pick([5,8,10,10,15,20]),
        verificado: nivel==='COMPETIDOR' ? Math.random()<0.5 : nivel==='AVANZADO' ? Math.random()<0.2 : Math.random()<0.06,
        esNPC: true,
      }
    }
  })

  for (let i = 0; i < padelPlayers.length; i += BATCH) {
    await Promise.all(padelPlayers.slice(i, i+BATCH).map(p =>
      prisma.usuario.create({ data: { email:p.email, password:p.password, nombre:p.nombre, tipo:p.tipo, perfil:{ create:p.perfil } } })
    ))
  }
  console.log(`  ✓ 87 jugadores de pádel`)
}

async function seedPartidos() {
  const existing = await prisma.partido.count({ where: { organizador: { email: { startsWith: 'npc.org' } } } })
  if (existing > 0) { console.log(`✓ ${existing} partidos de ejemplo ya existen`); return }

  console.log('Sembrando 35 partidos de ejemplo...')

  const orgFutbol = await prisma.usuario.upsert({
    where: { email: 'npc.org@pichanga.pe' },
    create: { email:'npc.org@pichanga.pe', password:PWD_ORG, nombre:'Organizador Pichanga', tipo:'ORGANIZADOR' },
    update: {},
  })
  const orgPadel = await prisma.usuario.upsert({
    where: { email: 'npc.org.padel@pichanga.pe' },
    create: { email:'npc.org.padel@pichanga.pe', password:PWD_ORG, nombre:'Organizador DejadaPeru', tipo:'ORGANIZADOR' },
    update: {},
  })

  await Promise.all(PARTIDOS_FUTBOL.map(p => prisma.partido.create({ data: {
    organizadorId: orgFutbol.id, deporte:'FUTBOL', titulo:p.titulo, distrito:p.distrito,
    fecha: diasDesdeHoy(p.dias, p.hora), duracion:p.duracion, modalidad:p.modalidad,
    nivelRequerido:'AMATEUR', tipoPago:p.tipoPago,
    cuotaCosto: p.cuotaCosto ?? null, pagoJugador: p.pagoJugador ?? null,
    posiciones: JSON.stringify(p.posiciones),
  }})))

  await Promise.all(PARTIDOS_PADEL.map(p => prisma.partido.create({ data: {
    organizadorId: orgPadel.id, deporte:'PADEL', titulo:p.titulo, distrito:p.distrito,
    fecha: diasDesdeHoy(p.dias, p.hora), duracion:p.duracion, modalidad:'2VS2',
    nivelRequerido:'PRINCIPIANTE', tipoPago:p.tipoPago,
    cuotaCosto: p.cuotaCosto ?? null, pagoJugador: p.pagoJugador ?? null,
    posiciones: JSON.stringify(p.posiciones),
  }})))

  console.log(`  ✓ 25 partidos de fútbol + 10 de pádel`)
}

async function seedRecalibrarPuntos() {
  const maxPuntos = await prisma.jugadorPerfil.aggregate({ where: { esNPC: true }, _max: { puntos: true } })
  if ((maxPuntos._max.puntos ?? 0) >= 2000) {
    console.log(`✓ Puntos NPC ya calibrados (máx: ${maxPuntos._max.puntos})`)
    return
  }

  const npcs = await prisma.jugadorPerfil.findMany({
    where: { esNPC: true },
    select: { id: true, totalPartidos: true, rating: true },
  })
  if (npcs.length === 0) return

  console.log(`Recalibrando puntos de ${npcs.length} NPCs...`)
  const BATCH = 50
  for (let i = 0; i < npcs.length; i += BATCH) {
    await Promise.all(npcs.slice(i, i + BATCH).map(npc => {
      const ptsPerGame = npc.rating >= 4.8 ? 15 : npc.rating >= 4.5 ? 10 : npc.rating >= 4.0 ? 6 : npc.rating >= 3.5 ? 3 : 1
      const activityBonus = npc.totalPartidos >= 100 ? 1.5 : npc.totalPartidos >= 50 ? 1.2 : npc.totalPartidos >= 20 ? 1.0 : 0.8
      const puntos = Math.round(npc.totalPartidos * ptsPerGame * activityBonus)
      return prisma.jugadorPerfil.update({ where: { id: npc.id }, data: { puntos } })
    }))
  }
  console.log(`  ✓ Puntos recalibrados (6 niveles: Rookie → Leyenda)`)
}

async function seedCanchas() {
  const existing = await prisma.cancha.count()
  if (existing > 0) { console.log(`✓ ${existing} canchas ya existen`); return }

  console.log('Sembrando canchas de Lima...')
  const { CANCHAS_FUTBOL, CANCHAS_PADEL } = await import('./canchas-data.mjs')
  const todas = [
    ...CANCHAS_FUTBOL.map(c => ({ ...c, deporte: 'FUTBOL', disponible: true })),
    ...CANCHAS_PADEL.map(c => ({ ...c, deporte: 'PADEL', disponible: true })),
  ]
  for (const c of todas) {
    await prisma.cancha.create({ data: c })
  }
  console.log(`  ✓ ${CANCHAS_FUTBOL.length} canchas de fútbol + ${CANCHAS_PADEL.length} canchas de pádel`)
}

async function main() {
  console.log('🌱 Iniciando seed de producción...')
  await seedNPCs()
  await seedRecalibrarPuntos()
  await seedPartidos()
  await seedCanchas()
  console.log('✅ Seed completo')
}

main()
  .catch(e => { console.error('❌ Error en seed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
