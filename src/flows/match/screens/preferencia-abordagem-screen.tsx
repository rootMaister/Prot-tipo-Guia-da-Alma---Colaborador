import { onboarding } from '@/analytics/posthog'

import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import { StepBody } from '@/components/layout/step-shell'
import { PularMatchButton } from '@/components/local/pular-match-button'
import { OptionCard } from '@/components/local/option-card'

import { useMatch } from '../match-provider'
import { ESPECIALIDADES } from '../opcoes'
import { useStepNavigation } from '../use-step-navigation'

/**
 * Step 4 — nodes 1105:11678 (mobile) and 1134:2358 (desktop). 1105:11680 is the same
 * mobile screen scrolled and filled, and is where the primary action's copy comes from.
 */

export function PreferenciaAbordagemScreen() {
  const { goNext } = useStepNavigation('preferencia-abordagem')
  const { data, toggle } = useMatch()

  const hasSelection = data.especialidades.length > 0

  return (
    <StepBody
      title="Especialidade"
      // O arquivo escrevia "preferencia" sem acento, e o protótipo reproduzia; o acento veio
      // na revisão de 23/09/2026.
      subtitle="Sua preferência por especialidade"
      rolavel
      footer={
        <>
          {hasSelection ? (
            <Button
              variant="contained"
              className="w-full"
              onClick={goNext}
              trailingIcon={<ArrowRightIcon className="size-[18px]" />}
            >
              Escolher especialidades
            </Button>
          ) : (
            <Button variant="outlined" className="w-full" onClick={() => {
              onboarding.stepCompleted('/match/preferencia-abordagem', 'skip_optional')
              goNext()
            }}>
              Não tenho preferência
            </Button>
          )}

          <PularMatchButton />
        </>
      }
    >
      <div className="flex flex-col gap-2 pb-6">
        {ESPECIALIDADES.map((especialidade) => (
          <OptionCard
            key={especialidade}
            id={`especialidade-${especialidade}`}
            label={especialidade}
            checked={data.especialidades.includes(especialidade)}
            onCheckedChange={() => toggle('especialidades', especialidade)}
          />
        ))}
      </div>
    </StepBody>
  )
}
