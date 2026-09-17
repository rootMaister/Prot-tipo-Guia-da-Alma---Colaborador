import { useCallback } from 'react'

import { Navigate, useLocation, useNavigate } from 'react-router'

import { FeedbackShell } from '@/components/layout/feedback-shell'
import { NavShell } from '@/components/layout/nav-shell'
import { StepChromeProvider } from '@/components/layout/step-chrome'
import { StepTransition, useStepDirection } from '@/components/layout/step-transition'
import { lerOrigem } from '@/lib/origem'
import { DESKTOP, useMediaQuery } from '@/lib/use-media-query'
import type { DestinoSlug } from '@/shell/destinos'
import { screenComponents as destinoComponents } from '@/shell/screens/registry'

import { screenComponents } from './screens/registry'
import { findStep, getStepIndex } from './steps'

/** Para onde a introdução devolve a pessoa quando não veio de lugar nenhum. */
export const ORIGEM_PADRAO = '/app/inicio'

/**
 * Introdução à gamificação — mesma forma do fluxo de Avaliação, e pelo mesmo motivo: no
 * mobile é página inteira, no desktop é um modal sobre a tela do app de onde veio (o frame
 * `2856:510` desenha o Início por trás). Daí reaproveitar o `FeedbackShell`.
 *
 * Uma diferença: aqui não há "Pergunta N de 4" nem botão de voltar. Os três segmentos são
 * desenhados dentro do conteúdo, acima do título, então o cabeçalho do shell fica de fora
 * (`pergunta={null}`) e cada tela desenha o seu.
 */
export function IntroducaoLayout() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const noDesktop = useMediaQuery(DESKTOP)

  const slug = pathname.split('/')[2] ?? ''
  const step = findStep(slug)
  const direction = useStepDirection(step ? getStepIndex(step.slug) : 0)

  const origem = lerOrigem(search, ORIGEM_PADRAO)
  const destino = (
    origem.startsWith('/app/') ? origem.split('/')[2] : 'inicio'
  ) as DestinoSlug
  const Fundo = destinoComponents[destino] ?? destinoComponents.inicio

  const fechar = useCallback(() => navigate(origem), [navigate, origem])

  if (!step) {
    return <Navigate to="/introducao/pontos" replace />
  }

  const Screen = screenComponents[step.slug]

  return (
    <StepChromeProvider>
      <FeedbackShell
        label="Introdução à gamificação"
        pergunta={null}
        totalPerguntas={0}
        onBack={fechar}
        onFechar={fechar}
        fundo={
          noDesktop && Fundo ? (
            <NavShell slugAtivo={destino}>
              <Fundo />
            </NavShell>
          ) : undefined
        }
      >
        <StepTransition
          stepKey={slug}
          direction={direction}
          wrapperClassName="flex flex-1 flex-col"
          className="flex flex-1 flex-col"
        >
          <Screen />
        </StepTransition>
      </FeedbackShell>
    </StepChromeProvider>
  )
}
