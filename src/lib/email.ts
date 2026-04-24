let resendClient: import('resend').Resend | null = null

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  if (!resendClient) {
    const { Resend } = require('resend')
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

const FROM = 'Pichanga <noreply@pichanga.pe>'

export async function sendSolicitudAceptada(to: string, nombre: string, partidoTitulo: string, neto: number) {
  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: `✅ ¡Tu solicitud fue aceptada! — ${partidoTitulo}`,
    html: `<p>Hola ${nombre},</p>
<p>¡Tu solicitud para <strong>${partidoTitulo}</strong> fue aceptada!</p>
<p>Recibirás <strong>S/${neto.toFixed(2)}</strong> al completarse el partido.</p>
<p>Ingresá a tu <a href="https://pichanga.pe/dashboard">dashboard</a> para ver los detalles.</p>
<p>¡Buena suerte!</p>
<p>— El equipo de Pichanga</p>`
  }).catch(() => {})
}

export async function sendSolicitudRechazada(to: string, nombre: string, partidoTitulo: string) {
  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Tu solicitud no fue aceptada — ${partidoTitulo}`,
    html: `<p>Hola ${nombre},</p>
<p>Tu solicitud para <strong>${partidoTitulo}</strong> no fue aceptada esta vez.</p>
<p>No te desanimes, hay muchos más partidos disponibles en <a href="https://pichanga.pe/partidos">pichanga.pe</a>.</p>
<p>— El equipo de Pichanga</p>`
  }).catch(() => {})
}

export async function sendSolicitudCancelada(to: string, nombreOrg: string, jugadorNombre: string, partidoTitulo: string) {
  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Un jugador canceló su participación — ${partidoTitulo}`,
    html: `<p>Hola ${nombreOrg},</p>
<p><strong>${jugadorNombre}</strong> canceló su participación en <strong>${partidoTitulo}</strong>.</p>
<p>Podés buscar un reemplazo en <a href="https://pichanga.pe/jugadores">pichanga.pe/jugadores</a>.</p>
<p>— El equipo de Pichanga</p>`
  }).catch(() => {})
}
