// Datos de 110 canchas reales/realistas de Lima
export const CANCHAS_FUTBOL = [
  // SAN JUAN DE LURIGANCHO
  { nombre:'Complejo Deportivo Canto Grande', distrito:'San Juan de Lurigancho', direccion:'Av. Canto Grande 1250', superficie:'SINTETICO', tamano:'5VS5', precio:80, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'960111001' },
  { nombre:'Canchas El Sol SJL', distrito:'San Juan de Lurigancho', direccion:'Jr. Las Flores 340, Zarate', superficie:'SINTETICO', tamano:'5VS5', precio:70, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'960111002' },
  { nombre:'Estadio Municipal Canto Rey', distrito:'San Juan de Lurigancho', direccion:'Av. Canto Rey 890', superficie:'CESPED_NATURAL', tamano:'11VS11', precio:200, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'960111003' },
  { nombre:'Futbol 5 Wiracocha', distrito:'San Juan de Lurigancho', direccion:'Av. Gran Chimú 450', superficie:'SINTETICO', tamano:'5VS5', precio:75, techada:true, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'960111004' },
  { nombre:'Complejo Los Postes SJL', distrito:'San Juan de Lurigancho', direccion:'Av. Las Flores de Primavera 123', superficie:'SINTETICO', tamano:'7VS7', precio:120, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'960111005' },

  // LOS OLIVOS
  { nombre:'Canchas Pro Los Olivos', distrito:'Los Olivos', direccion:'Av. Universitaria Norte 2150', superficie:'SINTETICO', tamano:'5VS5', precio:90, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'960222001' },
  { nombre:'Estadio Auxiliar Los Olivos', distrito:'Los Olivos', direccion:'Av. Carlos Izaguirre 820', superficie:'CESPED_NATURAL', tamano:'11VS11', precio:250, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'960222002' },
  { nombre:'Fulbito Arena Los Olivos', distrito:'Los Olivos', direccion:'Jr. Monte Bello 340', superficie:'SINTETICO', tamano:'5VS5', precio:80, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'960222003' },
  { nombre:'Complejo Deportivo Naranjal', distrito:'Los Olivos', direccion:'Av. Naranjal 1100', superficie:'SINTETICO', tamano:'7VS7', precio:130, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'960222004' },

  // COMAS
  { nombre:'Complejo Deportivo Comas', distrito:'Comas', direccion:'Av. Túpac Amaru 2800', superficie:'SINTETICO', tamano:'5VS5', precio:65, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'960333001' },
  { nombre:'Canchas El Retablo', distrito:'Comas', direccion:'Av. El Retablo 550', superficie:'SINTETICO', tamano:'7VS7', precio:100, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'960333002' },
  { nombre:'Estadio La Pascana', distrito:'Comas', direccion:'Av. Las Vegas 200', superficie:'CESPED_NATURAL', tamano:'11VS11', precio:180, techada:false, iluminacion:false, vestuarios:true, estacionamiento:false, telefono:'960333003' },
  { nombre:'Arena 5 Comas Norte', distrito:'Comas', direccion:'Av. Universitaria Norte 4500', superficie:'SINTETICO', tamano:'5VS5', precio:70, techada:true, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'960333004' },

  // ATE
  { nombre:'Complejo Deportivo Huaycán', distrito:'Ate', direccion:'Av. Nicolás Ayllón 2900', superficie:'SINTETICO', tamano:'5VS5', precio:75, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'960444001' },
  { nombre:'Canchas La Molina Vieja', distrito:'Ate', direccion:'Carretera Central Km 8', superficie:'SINTETICO', tamano:'7VS7', precio:120, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'960444002' },
  { nombre:'Arena Fútbol Ate', distrito:'Ate', direccion:'Av. Prolongación Javier Prado 5200', superficie:'SINTETICO', tamano:'5VS5', precio:85, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'960444003' },
  { nombre:'Estadio Santa Clara', distrito:'Ate', direccion:'Av. Santa Clara 1000', superficie:'CESPED_NATURAL', tamano:'11VS11', precio:220, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'960444004' },

  // SAN MARTÍN DE PORRES
  { nombre:'Fulbito 5 San Martín', distrito:'San Martín de Porres', direccion:'Av. Perú 3400', superficie:'SINTETICO', tamano:'5VS5', precio:80, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'960555001' },
  { nombre:'Complejo Deportivo Zarumilla', distrito:'San Martín de Porres', direccion:'Av. Zarumilla 890', superficie:'SINTETICO', tamano:'7VS7', precio:110, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'960555002' },
  { nombre:'Canchas El Planeta SMP', distrito:'San Martín de Porres', direccion:'Av. Tomás Valle 650', superficie:'SINTETICO', tamano:'5VS5', precio:75, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'960555003' },
  { nombre:'Estadio Unión Miramar', distrito:'San Martín de Porres', direccion:'Jr. Independencia 1200', superficie:'CESPED_NATURAL', tamano:'11VS11', precio:200, techada:false, iluminacion:false, vestuarios:true, estacionamiento:false, telefono:'960555004' },

  // VILLA EL SALVADOR
  { nombre:'Complejo Deportivo VES', distrito:'Villa El Salvador', direccion:'Av. Revolución 1500', superficie:'SINTETICO', tamano:'5VS5', precio:60, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'960666001' },
  { nombre:'Canchas Ciudad de Dios VES', distrito:'Villa El Salvador', direccion:'Av. Pachacútec 2200', superficie:'SINTETICO', tamano:'7VS7', precio:90, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'960666002' },
  { nombre:'Arena Fútbol El Sol VES', distrito:'Villa El Salvador', direccion:'Sector 1 Grupo 15', superficie:'CEMENTO', tamano:'5VS5', precio:50, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'960666003' },

  // SAN JUAN DE MIRAFLORES
  { nombre:'Complejo Deportivo Pamplona', distrito:'San Juan de Miraflores', direccion:'Av. San Juan 1800', superficie:'SINTETICO', tamano:'5VS5', precio:70, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'960777001' },
  { nombre:'Canchas Los Álamos SJM', distrito:'San Juan de Miraflores', direccion:'Av. Los Álamos 450', superficie:'SINTETICO', tamano:'7VS7', precio:100, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'960777002' },
  { nombre:'Fulbito Arena Panamericana Sur', distrito:'San Juan de Miraflores', direccion:'Panamericana Sur Km 14', superficie:'SINTETICO', tamano:'5VS5', precio:75, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'960777003' },

  // CHORRILLOS
  { nombre:'Canchas La Chira', distrito:'Chorrillos', direccion:'Av. Huaylas 850', superficie:'SINTETICO', tamano:'5VS5', precio:80, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'960888001' },
  { nombre:'Complejo Deportivo Chorrillos', distrito:'Chorrillos', direccion:'Av. Defensores del Morro 1200', superficie:'SINTETICO', tamano:'7VS7', precio:120, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'960888002' },
  { nombre:'Estadio Municipal Villa María', distrito:'Chorrillos', direccion:'Av. Guardia Civil 500', superficie:'CESPED_NATURAL', tamano:'11VS11', precio:230, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'960888003' },

  // SANTIAGO DE SURCO
  { nombre:'Sport Center Surco', distrito:'Santiago de Surco', direccion:'Av. Benavides 5100', superficie:'SINTETICO', tamano:'5VS5', precio:110, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'960999001' },
  { nombre:'Canchas Los Próceres Surco', distrito:'Santiago de Surco', direccion:'Av. Los Próceres 1400', superficie:'SINTETICO', tamano:'7VS7', precio:150, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'960999002' },
  { nombre:'Complejo Deportivo Surquillo-Surco', distrito:'Santiago de Surco', direccion:'Av. Tomás Marsano 2800', superficie:'SINTETICO', tamano:'5VS5', precio:100, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'960999003' },

  // MIRAFLORES
  { nombre:'Canchas Kennedy Miraflores', distrito:'Miraflores', direccion:'Av. Larco 1100', superficie:'SINTETICO', tamano:'5VS5', precio:130, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'961000001' },
  { nombre:'Sport Grass Miraflores', distrito:'Miraflores', direccion:'Av. Reducto 1350', superficie:'SINTETICO', tamano:'7VS7', precio:170, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'961000002' },

  // SAN BORJA
  { nombre:'Complejo Deportivo San Borja', distrito:'San Borja', direccion:'Av. San Borja Norte 1200', superficie:'SINTETICO', tamano:'7VS7', precio:160, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'961111001' },
  { nombre:'Canchas La Pampa San Borja', distrito:'San Borja', direccion:'Av. Del Aire 500', superficie:'SINTETICO', tamano:'5VS5', precio:120, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'961111002' },

  // LA MOLINA
  { nombre:'Complejo Deportivo La Molina', distrito:'La Molina', direccion:'Av. La Molina 1500', superficie:'SINTETICO', tamano:'5VS5', precio:120, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'961222001' },
  { nombre:'Sport Grass La Molina', distrito:'La Molina', direccion:'Av. Raúl Ferrero 1200', superficie:'CESPED_NATURAL', tamano:'11VS11', precio:280, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'961222002' },
  { nombre:'Canchas Las Lagunas', distrito:'La Molina', direccion:'Av. Las Lagunas 300', superficie:'SINTETICO', tamano:'7VS7', precio:150, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'961222003' },

  // SAN MIGUEL
  { nombre:'Canchas Sport San Miguel', distrito:'San Miguel', direccion:'Av. La Marina 2100', superficie:'SINTETICO', tamano:'5VS5', precio:100, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'961333001' },
  { nombre:'Complejo Deportivo Bertolotto', distrito:'San Miguel', direccion:'Av. Universitaria 1800', superficie:'SINTETICO', tamano:'7VS7', precio:140, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'961333002' },

  // LINCE
  { nombre:'Canchas El Estadio Lince', distrito:'Lince', direccion:'Av. Arequipa 2890', superficie:'SINTETICO', tamano:'5VS5', precio:95, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'961444001' },
  { nombre:'Fulbito Arena Lince', distrito:'Lince', direccion:'Jr. General Garzón 890', superficie:'SINTETICO', tamano:'5VS5', precio:90, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'961444002' },

  // SURQUILLO
  { nombre:'Canchas Sport Surquillo', distrito:'Surquillo', direccion:'Av. Angamos Este 1900', superficie:'SINTETICO', tamano:'5VS5', precio:90, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'961555001' },
  { nombre:'Arena Fútbol Surquillo', distrito:'Surquillo', direccion:'Av. Tomás Marsano 1200', superficie:'SINTETICO', tamano:'7VS7', precio:120, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'961555002' },

  // PUEBLO LIBRE
  { nombre:'Canchas Liberales Pueblo Libre', distrito:'Pueblo Libre', direccion:'Av. Brasil 2800', superficie:'SINTETICO', tamano:'5VS5', precio:95, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'961666001' },
  { nombre:'Complejo Municipal Pueblo Libre', distrito:'Pueblo Libre', direccion:'Av. Sucre 1500', superficie:'SINTETICO', tamano:'7VS7', precio:130, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'961666002' },

  // JESÚS MARÍA
  { nombre:'Sport Grass Jesús María', distrito:'Jesús María', direccion:'Av. Faustino Sánchez Carrión 1200', superficie:'SINTETICO', tamano:'5VS5', precio:100, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'961777001' },
  { nombre:'Canchas Los Álamos JM', distrito:'Jesús María', direccion:'Av. Gregorio Escobedo 650', superficie:'SINTETICO', tamano:'7VS7', precio:140, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'961777002' },

  // BARRANCO
  { nombre:'Canchas El Puente Barranco', distrito:'Barranco', direccion:'Av. Grau 650', superficie:'SINTETICO', tamano:'5VS5', precio:100, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'961888001' },
  { nombre:'Sport Center Barranco', distrito:'Barranco', direccion:'Av. Pedro de Osma 200', superficie:'SINTETICO', tamano:'5VS5', precio:110, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'961888002' },

  // SAN ISIDRO
  { nombre:'Country Club Sport Grass', distrito:'San Isidro', direccion:'Av. Los Eucaliptos 590', superficie:'CESPED_NATURAL', tamano:'11VS11', precio:350, techada:false, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'961999001' },
  { nombre:'Canchas El Olivar', distrito:'San Isidro', direccion:'Av. El Olivar 200', superficie:'SINTETICO', tamano:'5VS5', precio:150, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'961999002' },

  // INDEPENDENCIA
  { nombre:'Canchas Independencia Norte', distrito:'Independencia', direccion:'Av. Independencia 1800', superficie:'SINTETICO', tamano:'5VS5', precio:65, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'962000001' },
  { nombre:'Complejo Deportivo Unificado', distrito:'Independencia', direccion:'Av. Carlos Arrieta 900', superficie:'SINTETICO', tamano:'7VS7', precio:95, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'962000002' },

  // RÍMAC
  { nombre:'Estadio El Rímac', distrito:'Rímac', direccion:'Jr. Trujillo 800', superficie:'CESPED_NATURAL', tamano:'11VS11', precio:190, techada:false, iluminacion:false, vestuarios:true, estacionamiento:false, telefono:'962111001' },
  { nombre:'Canchas Sport Rímac', distrito:'Rímac', direccion:'Av. Prolongación Tacna 1500', superficie:'SINTETICO', tamano:'5VS5', precio:70, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'962111002' },

  // VILLA MARÍA DEL TRIUNFO
  { nombre:'Complejo Deportivo VMT', distrito:'Villa María del Triunfo', direccion:'Av. Pachacútec 4200', superficie:'SINTETICO', tamano:'5VS5', precio:55, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'962222001' },
  { nombre:'Canchas Nueva Esperanza VMT', distrito:'Villa María del Triunfo', direccion:'Av. Salvador Allende 800', superficie:'SINTETICO', tamano:'7VS7', precio:85, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'962222002' },

  // CARABAYLLO
  { nombre:'Canchas Sport Carabayllo', distrito:'Carabayllo', direccion:'Av. Túpac Amaru 5800', superficie:'SINTETICO', tamano:'5VS5', precio:55, techada:false, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'962333001' },
  { nombre:'Complejo Municipal Carabayllo', distrito:'Carabayllo', direccion:'Av. San Pedro 300', superficie:'CESPED_NATURAL', tamano:'11VS11', precio:150, techada:false, iluminacion:false, vestuarios:true, estacionamiento:false, telefono:'962333002' },

  // MAGDALENA
  { nombre:'Sport Grass Magdalena', distrito:'Magdalena del Mar', direccion:'Av. Brasil 3600', superficie:'SINTETICO', tamano:'7VS7', precio:130, techada:false, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'962444001' },
  { nombre:'Canchas Mar Magdalena', distrito:'Magdalena del Mar', direccion:'Jr. Bolognesi 450', superficie:'SINTETICO', tamano:'5VS5', precio:100, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'962444002' },
]

export const CANCHAS_PADEL = [
  // MIRAFLORES
  { nombre:'Padel Lima Miraflores', distrito:'Miraflores', direccion:'Av. Benavides 310', superficie:'INDOOR', tamano:'PADEL', precio:120, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'963000001', descripcion:'4 canchas indoor de pádel. Academias y torneos semanales.' },
  { nombre:'Smash Padel Club', distrito:'Miraflores', direccion:'Av. Larco 890', superficie:'INDOOR', tamano:'PADEL', precio:130, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'963000002', descripcion:'3 canchas panorámicas. Clases para todos los niveles.' },
  { nombre:'Set & Match Miraflores', distrito:'Miraflores', direccion:'Calle Independencia 120', superficie:'INDOOR', tamano:'PADEL', precio:110, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'963000003', descripcion:'2 canchas de pádel con bar y vestuarios completos.' },

  // SAN ISIDRO
  { nombre:'Lima Padel Club', distrito:'San Isidro', direccion:'Av. Javier Prado Este 450', superficie:'INDOOR', tamano:'PADEL', precio:150, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963111001', descripcion:'Club exclusivo con 6 canchas. Liga interna mensual.' },
  { nombre:'Royal Padel San Isidro', distrito:'San Isidro', direccion:'Calle Los Libertadores 240', superficie:'INDOOR', tamano:'PADEL', precio:140, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963111002', descripcion:'5 canchas premium. Torneos FPT homologados.' },
  { nombre:'Winners Padel SI', distrito:'San Isidro', direccion:'Av. Rivera Navarrete 890', superficie:'INDOOR', tamano:'PADEL', precio:135, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963111003', descripcion:'Modernas canchas con vidrio panorámico.' },

  // SANTIAGO DE SURCO
  { nombre:'Padel Zone Surco', distrito:'Santiago de Surco', direccion:'Av. El Polo 740', superficie:'INDOOR', tamano:'PADEL', precio:120, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963222001', descripcion:'8 canchas. El club de pádel más grande de Surco.' },
  { nombre:'Pro Padel Surco', distrito:'Santiago de Surco', direccion:'Av. Benavides 5200', superficie:'INDOOR', tamano:'PADEL', precio:115, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963222002', descripcion:'4 canchas profesionales. Clases con instructores certificados.' },
  { nombre:'Surco Padel Club', distrito:'Santiago de Surco', direccion:'Calle Los Ficus 340', superficie:'INDOOR', tamano:'PADEL', precio:110, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963222003', descripcion:'3 canchas en zona exclusiva de Surco.' },
  { nombre:'Ace Padel Monterrico', distrito:'Santiago de Surco', direccion:'Av. Encalada 1820', superficie:'INDOOR', tamano:'PADEL', precio:125, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963222004', descripcion:'Cancha outdoor y 2 indoor. Ambiente familiar.' },

  // LA MOLINA
  { nombre:'La Molina Padel Club', distrito:'La Molina', direccion:'Av. La Fontana 1200', superficie:'INDOOR', tamano:'PADEL', precio:130, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963333001', descripcion:'6 canchas. Liga La Molina todos los sábados.' },
  { nombre:'Padel Garden La Molina', distrito:'La Molina', direccion:'Av. Raúl Ferrero 800', superficie:'INDOOR', tamano:'PADEL', precio:120, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963333002', descripcion:'4 canchas rodeadas de jardines. Ideal para familias.' },
  { nombre:'Smash La Molina', distrito:'La Molina', direccion:'Calle Los Cipreses 560', superficie:'INDOOR', tamano:'PADEL', precio:115, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963333003', descripcion:'3 canchas modernas. Precios competitivos.' },

  // SAN BORJA
  { nombre:'Padel Center San Borja', distrito:'San Borja', direccion:'Av. San Borja Sur 1100', superficie:'INDOOR', tamano:'PADEL', precio:125, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963444001', descripcion:'5 canchas. Clases de todos los niveles.' },
  { nombre:'Club Deportivo San Borja Padel', distrito:'San Borja', direccion:'Av. Agustín de la Rosa Toro 200', superficie:'INDOOR', tamano:'PADEL', precio:110, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963444002', descripcion:'Instalaciones de primer nivel con spa.' },

  // SAN MIGUEL
  { nombre:'Padel Lima Oeste', distrito:'San Miguel', direccion:'Av. La Marina 3200', superficie:'INDOOR', tamano:'PADEL', precio:110, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963555001', descripcion:'4 canchas con vista al mar. La mejor ubicación.' },
  { nombre:'Net Padel San Miguel', distrito:'San Miguel', direccion:'Av. Universitaria 2800', superficie:'INDOOR', tamano:'PADEL', precio:100, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'963555002', descripcion:'3 canchas accesibles. Ideal para principiantes.' },

  // PUEBLO LIBRE
  { nombre:'Padel Club Pueblo Libre', distrito:'Pueblo Libre', direccion:'Av. Brasil 3100', superficie:'INDOOR', tamano:'PADEL', precio:100, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'963666001', descripcion:'2 canchas. Club deportivo con historia.' },
  { nombre:'Arena Padel PL', distrito:'Pueblo Libre', direccion:'Jr. Castilla 580', superficie:'INDOOR', tamano:'PADEL', precio:95, techada:true, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'963666002', descripcion:'Cancha exclusiva para socios y alquiler por horas.' },

  // JESÚS MARÍA
  { nombre:'JM Padel Center', distrito:'Jesús María', direccion:'Av. Gregorio Escobedo 800', superficie:'INDOOR', tamano:'PADEL', precio:105, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'963777001', descripcion:'3 canchas. Torneos nocturnos los viernes.' },
  { nombre:'Padel Spot Jesús María', distrito:'Jesús María', direccion:'Calle Santa Rosa 340', superficie:'INDOOR', tamano:'PADEL', precio:100, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'963777002', descripcion:'2 canchas bien mantenidas en zona céntrica.' },

  // LINCE
  { nombre:'Padel House Lince', distrito:'Lince', direccion:'Av. Arequipa 3200', superficie:'INDOOR', tamano:'PADEL', precio:100, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'963888001', descripcion:'2 canchas centrales. Open nights todos los jueves.' },

  // BARRANCO
  { nombre:'Bohemia Padel Barranco', distrito:'Barranco', direccion:'Av. San Martín 300', superficie:'INDOOR', tamano:'PADEL', precio:110, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'963999001', descripcion:'Cancha única en Barranco. Ambiente relajado y cultural.' },

  // MAGDALENA
  { nombre:'Padel & Sport Magdalena', distrito:'Magdalena del Mar', direccion:'Av. Javier Prado Oeste 4500', superficie:'INDOOR', tamano:'PADEL', precio:105, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'964000001', descripcion:'3 canchas cerca del mar. Muy buena ventilación.' },
  { nombre:'Club Neptuno Padel', distrito:'Magdalena del Mar', direccion:'Jr. Leoncio Prado 680', superficie:'INDOOR', tamano:'PADEL', precio:100, techada:true, iluminacion:true, vestuarios:true, estacionamiento:false, telefono:'964000002', descripcion:'2 canchas. Descuentos para socios y grupos.' },

  // LOS OLIVOS
  { nombre:'Norte Padel Los Olivos', distrito:'Los Olivos', direccion:'Av. Carlos Izaguirre 1200', superficie:'INDOOR', tamano:'PADEL', precio:90, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'964111001', descripcion:'4 canchas en el cono norte. Precios accesibles.' },
  { nombre:'Padel 5 Los Olivos', distrito:'Los Olivos', direccion:'Av. Universitaria Norte 2600', superficie:'INDOOR', tamano:'PADEL', precio:85, techada:true, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'964111002', descripcion:'2 canchas económicas. Ideal para aprendices.' },

  // ATE
  { nombre:'Padel East Lima', distrito:'Ate', direccion:'Av. Javier Prado Este 4800', superficie:'INDOOR', tamano:'PADEL', precio:95, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'964222001', descripcion:'3 canchas en zona este. Liga mensual interna.' },

  // SAN JUAN DE LURIGANCHO
  { nombre:'SJL Padel Club', distrito:'San Juan de Lurigancho', direccion:'Av. Gran Chimú 890', superficie:'INDOOR', tamano:'PADEL', precio:80, techada:true, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'964333001', descripcion:'Primera cancha de pádel en SJL. Muy popular.' },
  { nombre:'Arena Padel Zarate', distrito:'San Juan de Lurigancho', direccion:'Jr. Zarate 1100', superficie:'INDOOR', tamano:'PADEL', precio:75, techada:true, iluminacion:true, vestuarios:false, estacionamiento:false, telefono:'964333002', descripcion:'2 canchas económicas para iniciarse en el pádel.' },

  // SANTIAGO DE SURCO (extra)
  { nombre:'Match Point Surco', distrito:'Santiago de Surco', direccion:'Av. Caminos del Inca 1900', superficie:'INDOOR', tamano:'PADEL', precio:120, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963222005', descripcion:'5 canchas de alta gama. Torneos FPP homologados.' },
  { nombre:'Padel Indoor Las Casuarinas', distrito:'Santiago de Surco', direccion:'Calle Las Casuarinas 890', superficie:'INDOOR', tamano:'PADEL', precio:130, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'963222006', descripcion:'Club exclusivo en zona residencial.' },

  // CHORRILLOS
  { nombre:'Padel Sol y Mar', distrito:'Chorrillos', direccion:'Av. Alameda Sur 560', superficie:'INDOOR', tamano:'PADEL', precio:90, techada:true, iluminacion:true, vestuarios:true, estacionamiento:true, telefono:'964444001', descripcion:'3 canchas con ambiente familiar. Cerca a la playa.' },
]
