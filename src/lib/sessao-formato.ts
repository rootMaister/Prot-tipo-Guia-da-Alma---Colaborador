/**
 * How a booked session's date and time are written across the app.
 *
 * It lives here, not in the Agendamento flow, because the same session is written by
 * screens on both sides of the seam: the flow books it, and `card-sessao` and
 * `detalhes-sessao` — shared components of the app — render it. A shared component
 * importing from a flow would point the dependency the wrong way.
 */

/** Every session in the prototype is the 45-minute one the Agendamento flow is drawn around. */
export const DURACAO_MIN = 45

const diaDaSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
const dataLonga = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
const diaEMes = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' })

/**
 * "5 de agosto • 14:00" — the lime date badge on a booked session's card (1568:2128 on
 * Meus agendamentos, 1789:145 on the desktop frame).
 *
 * The Home draws the same badge of the same component as "Hoje, 24 de Ago ás 19:00". One
 * format serves both, since one session feeds both screens. See SYNC-FIGMA.md.
 */
export const badgeSessao = (data: Date, horario: string): string =>
  `${diaEMes.format(data)} • ${horario}`

/** "Qua, 5 de agosto de 2026" — the "Data e horário" block of `Detalhes da sessão` (1776:50). */
export function dataPorExtenso(data: Date): string {
  // pt-BR abbreviates with a trailing dot ("qua."); the design writes "Qua,".
  const dia = diaDaSemana.format(data).replace('.', '')

  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)}, ${dataLonga.format(data)}`
}

/** "14:00 – 14:45" — start and end, with the en dash the design uses. */
export function faixaHorario(horario: string, duracaoMin = DURACAO_MIN): string {
  const [hora, minuto] = horario.split(':').map(Number)
  const fim = new Date(2000, 0, 1, hora, minuto + duracaoMin)
  const dois = (valor: number) => String(valor).padStart(2, '0')

  return `${horario} – ${dois(fim.getHours())}:${dois(fim.getMinutes())}`
}
