import { useEffect } from 'react'

import { Button } from '@guia-da-alma/ds'

import { StatusShell } from '@/components/layout/status-shell'
import { AssinaturaConsciente } from '@/components/local/assinatura-consciente'

import { useStepNavigation } from '../use-step-navigation'

/** Mocked HR review. Long enough to read the screen, short enough to keep a walkthrough moving. */
const REVIEW_DELAY_MS = 4000

export function AnaliseScreen() {
  const { goNext } = useStepNavigation('analise')

  useEffect(() => {
    const timer = window.setTimeout(goNext, REVIEW_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [goNext])

  return (
    <StatusShell
      illustration={<AssinaturaConsciente />}
      title="Em análise"
      body="Sua empresa está identificando seu cadastro, vamos te notificar quando você for aprovado. Contate o responsável da sua empresa para mais informações."
      footer={
        <>
          <p className="text-body-m text-fg-subtle">Precisa de ajuda?</p>
          {/*
            DS-GAP: Figma draws this as `fg/subtle` (#6e6e6e) semibold; the closest DS
            variant, `text-neutral`, is `action/neutral` (#434343) bold.
          */}
          <Button variant="text-neutral" size="small">
            Acesse a central de ajuda
          </Button>
        </>
      }
    />
  )
}
