import { onboarding } from '@/analytics/posthog'

import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import { StepBody } from '@/components/layout/step-shell'
import { PularMatchButton } from '@/components/local/pular-match-button'
import { OptionCard } from '@/components/local/option-card'

import { useMatch } from '../match-provider'
import { TEMAS } from '../opcoes'
import { useStepNavigation } from '../use-step-navigation'

/**
 * Step 2 — nodes 3283:16761 (mobile, com seleção), 3283:16905 (mobile, vazio) and
 * 1133:1393 (desktop).
 *
 * The two frames list completely different themes: desktop offers "Não sei ainda",
 * "Ansiedade / preocupação constante", "Tristeza / desânimo", "Relacionamento(s)",
 * "Luto ou perda" and "Outros". One app cannot render both without the selection breaking
 * on resize, so the mobile list is used, per the rule agreed for this flow. The desktop
 * list is logged in the DS-GAPS annex.
 */

export function OQueTeTrazScreen() {
  const { goNext } = useStepNavigation('o-que-te-traz')
  const { data, toggle } = useMatch()

  const hasSelection = data.temas.length > 0

  return (
    <StepBody
      title={
        <>
          Temas
          <br />
          para a sessão
        </>
      }
      // Reproduzido como o arquivo escreve (3283:16777) — a frase junta duas versões ("que
      // mais fazem sentido" e "que gostaria de levar"). Ver SYNC-FIGMA.md.
      subtitle="Marque os temas que mais fazem sentido que gostaria de levar para a sessão. Tudo bem se não souber agora"
      rolavel
      footer={
        <>
          {/* Os dois estados do arquivo: "Escolher temas" com algo marcado, "Não sei ainda" sem. */}
          {hasSelection ? (
            <Button
              variant="contained"
              className="w-full"
              onClick={goNext}
              trailingIcon={<ArrowRightIcon className="size-[18px]" />}
            >
              Escolher temas
            </Button>
          ) : (
            <Button variant="outlined" className="w-full" onClick={() => {
              onboarding.stepCompleted('/match/o-que-te-traz', 'skip_optional')
              goNext()
            }}>
              Não sei ainda
            </Button>
          )}

          <PularMatchButton />
        </>
      }
    >
      <div className="flex flex-col gap-2 pb-6">
        {TEMAS.map((tema) => (
          <OptionCard
            key={tema}
            id={`tema-${tema}`}
            label={tema}
            checked={data.temas.includes(tema)}
            onCheckedChange={() => toggle('temas', tema)}
          />
        ))}
      </div>
    </StepBody>
  )
}
