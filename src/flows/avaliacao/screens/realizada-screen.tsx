import { Badge, Button } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import ilustracao from '@/assets/avaliacao/sessao-realizada.svg'
import { StepFooter } from '@/components/layout/step-chrome'

import { useAvaliacaoNavigation } from '../use-avaliacao-navigation'

/**
 * Step 1 — nodes 2288:12031 (mobile) and 2296:10831 (desktop).
 *
 * The invitation, not a question: evaluating is optional, and "Agora não" skips straight to
 * booking the next session. Mobile left-aligns the copy under an illustration centred in the
 * free space; the desktop modal centres everything and shrinks the illustration.
 *
 * The illustration is the "Assinatura consciente" drawing of the Cadastro, redrawn with a
 * pen and a glow — a static asset here, not the animated `assinatura-consciente`.
 *
 * "+ 40 Calmas" is copy only: nothing is credited to the account.
 */
export function RealizadaScreen() {
  const { irPara } = useAvaliacaoNavigation()

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 px-6 pt-2 pb-8 lg:p-0 lg:pb-6">
        <div className="flex flex-1 items-center justify-center lg:h-[230px] lg:flex-none">
          <img
            src={ilustracao}
            alt=""
            className="h-[239px] w-[296px] lg:h-[165px] lg:w-[204px]"
          />
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-center lg:text-center">
          {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
          <h1 className="font-display text-heading-xl text-fg-default">Sessão realizada</h1>

          <div className="flex flex-col items-start gap-2 lg:items-center">
            <p className="text-body-s text-fg-muted">
              Por dedicar esse tempo ao seu cuidado você recebeu:
            </p>
            <Badge variant="success">+ 40 Calmas</Badge>
          </div>
        </div>
      </div>

      <StepFooter>
        <Button
          variant="contained"
          className="w-full lg:flex-1"
          trailingIcon={<ArrowRightIcon className="size-[18px]" />}
          onClick={() => irPara('acolhimento')}
        >
          Avalie sua experiência
        </Button>
        <Button variant="text-neutral" className="w-full lg:flex-1" onClick={() => irPara('proxima')}>
          Agora não
        </Button>
      </StepFooter>
    </>
  )
}
