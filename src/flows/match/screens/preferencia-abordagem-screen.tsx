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
      // "preferencia" is unaccented in the file. Copy is the designer's call, so the
      // rendered text is reproduced as drawn and logged instead of corrected.
      subtitle="Sua preferencia por especialidade"
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
              Escolher horário das sessões
            </Button>
          ) : (
            <Button variant="outlined" className="w-full" onClick={goNext}>
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
