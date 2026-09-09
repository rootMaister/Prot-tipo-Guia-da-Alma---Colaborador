/**
 * Mocked availability for the scheduling step.
 *
 * The Figma frame draws one fixed set of four slots against 4 August, which makes every
 * day look identical and reads as placeholder. This varies the grid deterministically —
 * same date always yields the same slots, so walking back and forth in the flow never
 * shuffles the screen under the reviewer.
 */

const TODOS_OS_SLOTS = ['08:00', '09:00', '10:30', '14:00', '15:30', '16:30', '18:00', '19:00']

/** Small deterministic hash, so "random" availability is stable per date. */
const semente = (data: Date): number => {
  const chave = data.getFullYear() * 10000 + (data.getMonth() + 1) * 100 + data.getDate()
  return (chave * 2654435761) % 4294967296
}

const inicioDoDia = (data: Date): number =>
  new Date(data.getFullYear(), data.getMonth(), data.getDate()).getTime()

/**
 * Slots offered on a given day. Sundays are closed, Saturdays run a short morning, and
 * weekdays keep a rotating subset so no two days look the same.
 */
export const horariosDoDia = (data: Date): string[] => {
  const diaDaSemana = data.getDay()

  if (diaDaSemana === 0) {
    return []
  }

  if (diaDaSemana === 6) {
    return ['09:00', '10:30']
  }

  const s = semente(data)

  // Drop one to three slots, picked by the hash, and keep the order stable.
  const descartar = new Set<number>()
  const quantos = 1 + (s % 3)
  for (let i = 0; i < quantos; i += 1) {
    descartar.add(Math.floor(s / (i + 1)) % TODOS_OS_SLOTS.length)
  }

  return TODOS_OS_SLOTS.filter((_, indice) => !descartar.has(indice))
}

/** A day is pickable when it is not in the past and actually has slots. */
export const diaIndisponivel =
  (hoje: Date) =>
  (data: Date): boolean =>
    inicioDoDia(data) < inicioDoDia(hoje) || horariosDoDia(data).length === 0

/**
 * Reads a card's availability line — "Disponível hoje às • 18:00", "Disponível amanhã às
 * • 14:00", "Disponível sexta às • 09:00" — into the date and time the scheduling step
 * should open on, so the flow arrives with the slot the reviewer clicked already picked.
 *
 * Anything it cannot parse returns null, and the caller falls back to its own default.
 */
export const lerDisponibilidade = (
  texto: string,
  hoje: Date,
): { data: Date; horario: string } | null => {
  const horario = texto.match(/(\d{2}:\d{2})/)?.[1]

  if (!horario) {
    return null
  }

  const normalizado = texto.toLowerCase()
  const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())

  if (normalizado.includes('amanhã')) {
    data.setDate(data.getDate() + 1)
  } else if (!normalizado.includes('hoje')) {
    const nomes = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
    const alvo = nomes.findIndex((nome) => normalizado.includes(nome))

    if (alvo >= 0) {
      const avanco = (alvo - data.getDay() + 7) % 7 || 7
      data.setDate(data.getDate() + avanco)
    }
  }

  return { data, horario }
}
