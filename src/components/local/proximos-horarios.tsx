import type { ReactNode } from 'react'

import { Button } from '@guia-da-alma/ds'

export type HorarioSugerido = {
  /** As the file writes it: "Quinta, 13 ago · 14h". */
  rotulo: string
  data: Date
  horario: string
}

/**
 * The three slots every ending of the Avaliação offers. Fixed, because the file draws the
 * same three on all six frames — and they do fall on the weekdays they name in the
 * prototype's August 2026, where "today" is the 4th.
 */
export const HORARIOS_SUGERIDOS: readonly HorarioSugerido[] = [
  { rotulo: 'Quinta, 13 ago · 14h', data: new Date(2026, 7, 13), horario: '14:00' },
  { rotulo: 'Sexta, 14 ago · 10h', data: new Date(2026, 7, 14), horario: '10:00' },
  { rotulo: 'Segunda, 17 ago · 16h', data: new Date(2026, 7, 17), horario: '16:00' },
]

type ProximosHorariosProps = {
  /** The heading above the slots — its wording and size change between the endings. */
  cabecalho: ReactNode
  onEscolher: (horario: HorarioSugerido) => void
  onVerOutros: () => void
}

/**
 * "Próximos horários / Daniele" (2288:12319): the next slots of the same professional as
 * full-width outlined buttons, and "Ver outros horários" under them.
 *
 * That last one is a text button on mobile and a fourth outlined button in the desktop
 * modal (2296:11072) — a different design per breakpoint, so both are rendered and CSS picks.
 */
export function ProximosHorarios({ cabecalho, onEscolher, onVerOutros }: ProximosHorariosProps) {
  return (
    <section className="flex w-full flex-col gap-3">
      {cabecalho}

      {HORARIOS_SUGERIDOS.map((horario) => (
        <Button
          key={horario.rotulo}
          variant="outlined"
          className="w-full"
          onClick={() => onEscolher(horario)}
        >
          {horario.rotulo}
        </Button>
      ))}

      <Button variant="text-neutral" className="w-full lg:hidden" onClick={onVerOutros}>
        Ver outros horários
      </Button>
      <Button variant="outlined" className="hidden w-full lg:inline-flex" onClick={onVerOutros}>
        Ver outros horários
      </Button>
    </section>
  )
}
