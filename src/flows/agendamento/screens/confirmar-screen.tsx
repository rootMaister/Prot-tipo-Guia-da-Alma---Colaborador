import { onboarding } from '@/analytics/posthog'

import { Button } from '@guia-da-alma/ds'

import { StepBody } from '@/components/layout/step-shell'
import { ProfissionalResumo } from '@/components/local/profissional-resumo'

import { formatarQuando, HOJE, SESSAO, useAgendamento } from '../agendamento-provider'
import { useStepNavigation } from '../use-step-navigation'

/**
 * Step 4 — nodes 1236:10804 (mobile) and 1279:15578 (desktop).
 *
 * A read-back of everything chosen so far: data e horário, formato da sessão e os dados da
 * pessoa. O "Formato da sessão" entrou em 23/09/2026, junto com o aviso de onde fica o link.
 *
 * No desktop o passo virou duas colunas: título e profissional passam para a coluna da
 * esquerda (`ResumoAgendamento`), e aqui somem com `lg:hidden`. O desktop escreve
 * "Confirmar agendamento" e 98% onde o mobile escreve "Agendar" e 95% — vale o mobile. Ver
 * SYNC-FIGMA.md.
 */
export function ConfirmarScreen() {
  const { goNext } = useStepNavigation('confirmar')
  const { data } = useAgendamento()

  const quando = formatarQuando(data.data ?? HOJE, data.horario ?? '19:00')

  return (
    <StepBody
      footer={
        <Button variant="contained" className="w-full" onClick={() => { onboarding.requestBooking(); goNext() }}>
          Agendar
        </Button>
      }
    >
      <div className="flex flex-col gap-6 pt-2 pb-6">
        <p className="text-label-l text-fg-default lg:hidden">{SESSAO.titulo}</p>

        <div className="lg:hidden">
          <ProfissionalResumo {...SESSAO.profissional} semCrp />
        </div>

        {/* 32px entre os blocos, 4px dentro de cada um — o `1236:11033` do arquivo. */}
        <div className="flex flex-col gap-8">
          <Campo rotulo="Data e horário da sessão" valor={quando} />

          <div className="flex flex-col gap-1">
            <p className="text-caption text-fg-subtle">Formato da sessão</p>
            <p className="text-label-m text-fg-default">{SESSAO.formato}</p>
            <p className="text-caption text-fg-subtle">
              O link para acessar fica disponível nos detalhes do agendamento, em Meus
              agendamentos.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <p className="text-caption text-fg-subtle">Seus dados</p>

            {/* O CPF saiu do fluxo na revisão de 21/09/2026 — ver `informacoes-screen`. */}
            <div className="flex flex-col gap-1">
              <p className="text-body-s text-fg-subtle">WhatsApp</p>
              <p className="text-label-m text-fg-default">{data.whatsapp}</p>
            </div>
          </div>
        </div>
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
    <div className="flex flex-col gap-1">
      <p className="text-caption text-fg-subtle">{rotulo}</p>
      <p className="text-label-m text-fg-default">{valor}</p>
    </div>
  )
}
