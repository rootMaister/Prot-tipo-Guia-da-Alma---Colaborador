import { Button } from '@guia-da-alma/ds'

import { StepBody } from '@/components/layout/step-shell'
import { ProfissionalResumo } from '@/components/local/profissional-resumo'

import { formatarQuando, HOJE, SESSAO, useAgendamento } from '../agendamento-provider'
import { useStepNavigation } from '../use-step-navigation'

/**
 * Step 4 — nodes 1236:10804 (mobile) and 1279:15578 (desktop).
 *
 * A read-back of everything chosen so far. "Data de horário" is how the file labels the
 * slot — reproduced as drawn, along with the "ás" in the line below it.
 */
export function ConfirmarScreen() {
  const { goNext } = useStepNavigation('confirmar')
  const { data } = useAgendamento()

  const quando = formatarQuando(data.data ?? HOJE, data.horario ?? '19:00')

  return (
    <StepBody
      footer={
        <Button variant="contained" className="w-full" onClick={goNext}>
          Agendar
        </Button>
      }
    >
      <div className="flex flex-col gap-6 pt-2 pb-6">
        <p className="text-label-l text-fg-default">{SESSAO.titulo}</p>

        <ProfissionalResumo {...SESSAO.profissional} />

        <Campo rotulo="Data de horário" valor={quando} />

        <p className="text-caption text-fg-subtle">Seus dados</p>

        <Campo rotulo="CPF" valor={data.cpf || '123.123.123-12'} />
        <Campo rotulo="WhatsApp" valor={data.whatsapp} />
      </div>
    </StepBody>
  )
}

type CampoProps = {
  rotulo: string
  valor: string
}

function Campo({ rotulo, valor }: CampoProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption text-fg-subtle">{rotulo}</p>
      <p className="text-label-m text-fg-default">{valor}</p>
    </div>
  )
}
