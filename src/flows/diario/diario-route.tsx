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

import { DiarioProvider } from './diario-provider'
import { screenComponents } from './screens/registry'
import { findStep, getPreviousStep, getStepIndex } from './steps'

/** Para onde o fluxo devolve a pessoa quando não veio de lugar nenhum. */
export const ORIGEM_PADRAO = '/app/diario'

/**
 * Registro de humor — mesma forma dos fluxos de Avaliação e de Introdução: página inteira no
 * mobile, modal de 560px sobre a tela do app no desktop. O arquivo pede isso em voz alta, num
 * bilhete ao lado dos frames: "Criar essas telas em modal no desktop" (`2823:21063`).
 *
 * Duas diferenças em relação aos outros dois:
 *
 * - não há "Pergunta N de N" nem segmentos — o cabeçalho do shell fica de fora
 *   (`pergunta={null}`) e cada tela desenha o seu botão de voltar quando o frame tem um;
 * - o primeiro passo é desenhado sobre `surface/muted`, e os outros sobre o branco. A
 *   superfície vem do `steps.ts`, como tudo que muda de passo para passo.
 */
export function DiarioLayout() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const noDesktop = useMediaQuery(DESKTOP)

  const slug = pathname.split('/')[2] ?? ''
  const step = findStep(slug)
  const direction = useStepDirection(step ? getStepIndex(step.slug) : 0)

  const origem = lerOrigem(search, ORIGEM_PADRAO)
  const destino = (origem.startsWith('/app/') ? origem.split('/')[2] : 'diario') as DestinoSlug
  const Fundo = destinoComponents[destino] ?? destinoComponents.diario

  const fechar = useCallback(() => navigate(origem), [navigate, origem])

  if (!step) {
    return <Navigate to="/diario/humor" replace />
  }

  const voltar = () => {
    const anterior = getPreviousStep(step.slug)
    navigate(anterior ? `/diario/${anterior.slug}${search}` : origem)
  }

  const Screen = screenComponents[step.slug]

  return (
    <DiarioProvider>
      <StepChromeProvider>
        <FeedbackShell
          label="Registro de humor"
          surface={step.superficie}
          pergunta={null}
          totalPerguntas={0}
          onBack={voltar}
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
    </DiarioProvider>
  )
}
