import { useMemo } from 'react'

import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import { StepBody } from '@/components/layout/step-shell'
import { ChoiceChip } from '@/components/local/choice-chip'
import { MonthCalendar } from '@/components/local/month-calendar'

import { formatarQuando, HOJE, useAgendamento } from '../agendamento-provider'
import { diaIndisponivel, horariosDoDia } from '../disponibilidade'
import { useStepNavigation } from '../use-step-navigation'

/**
 * Step 2 — nodes 1202:715 (mobile, nothing picked) and 1203:1108 (a time picked); desktop
 * 1279:14636 and 1279:13985.
 *
 * Two things change when a time is chosen, both drawn in the file: the badge moves 50% →
 * 60%, and a footer appears with the chosen slot spelled out above the primary action.
 * With nothing chosen there is no footer at all, not an empty bar.
 */

const diaMes = (data: Date): string =>
  `${data.getDate()}/${String(data.getMonth() + 1).padStart(2, '0')}`

export function HorarioScreen() {
  const { goNext } = useStepNavigation('horario')
  const { data, update } = useAgendamento()

  const dataEscolhida = data.data ?? HOJE
  const temHorario = data.horario !== null
  /*
    The slot the card advertised is pre-selected, but the varied availability below is
    generated independently and might not contain it. Merging it back in keeps the chip
    visible, so the footer never names a time with no chip to match.
  */
  const horarios = useMemo(() => {
    const doDia = horariosDoDia(dataEscolhida)

    if (data.horario && !doDia.includes(data.horario)) {
      return [...doDia, data.horario].sort()
    }

    return doDia
  }, [dataEscolhida, data.horario])

  return (
    <StepBody
      progress={temHorario ? 60 : 50}
      footer={
        temHorario ? (
          <>
            <p className="text-label-s text-fg-default w-full text-center">
              {formatarQuando(dataEscolhida, data.horario as string)}
            </p>

            <Button
              variant="contained"
              className="w-full"
              onClick={goNext}
              trailingIcon={<ArrowRightIcon className="size-[18px]" />}
            >
              Confirmar informações
            </Button>
          </>
        ) : null
      }
    >
      <div className="flex flex-col gap-6 pt-6 pb-6">
        <MonthCalendar
          month={HOJE}
          selected={data.data}
          isDisabled={diaIndisponivel(HOJE)}
          onSelect={(date) => update({ data: date, horario: null })}
        />

        <p className="text-label-s text-fg-default">Horários disponíveis — {diaMes(dataEscolhida)}</p>

        <div className="flex flex-wrap gap-2">
          {horarios.map((horario) => (
            <ChoiceChip
              key={horario}
              label={horario}
              selected={data.horario === horario}
              onToggle={() => update({ horario: data.horario === horario ? null : horario })}
            />
          ))}
        </div>
      </div>
    </StepBody>
  )
}
