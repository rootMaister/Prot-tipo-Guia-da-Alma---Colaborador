import { Button } from '@guia-da-alma/ds'

import { StepBody } from '@/components/layout/step-shell'
import { PularMatchButton } from '@/components/local/pular-match-button'
import { OptionCard } from '@/components/local/option-card'

import { useMatch } from '../match-provider'
import { TEMAS } from '../opcoes'
import { useStepNavigation } from '../use-step-navigation'

/**
 * Step 2 — nodes 1105:10872 (mobile) and 1133:1393 (desktop).
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
      title="Seu momento"
      subtitle="Marque os temas que você gostaria de levar para a sessão. Tudo bem se não souber agora"
      rolavel
      footer={
        <>
          {/*
            Copy not in the design: neither frame draws a primary action here, not even the
            desktop one with two themes ticked, which leaves no way forward once you have
            chosen something. Added so the flow stays walkable. See DS-GAPS.md.
          */}
          {hasSelection ? (
            <Button variant="contained" className="w-full" onClick={goNext}>
              Continuar
            </Button>
          ) : (
            <Button variant="outlined" className="w-full" onClick={goNext}>
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
