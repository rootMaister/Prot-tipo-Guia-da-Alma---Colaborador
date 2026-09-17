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

import { AvaliacaoProvider } from './avaliacao-provider'
import { screenComponents } from './screens/registry'
import { TOTAL_PERGUNTAS, findStep, getPreviousStep, getStepIndex } from './steps'
import { ORIGEM_PADRAO } from './use-avaliacao-navigation'

/**
 * Layout route, in the same shape as the other flows: it holds the answers so they survive
 * the steps, owns the chrome, and resolves the screen through the registry rather than an
 * `<Outlet/>` — see the note in CLAUDE.md.
 *
 * On desktop the flow is a modal over the app, so this also renders the app screen it was
 * opened from behind it, with its rail. That is a real screen, mounted and inert, rather
 * than a picture of one — it is only mounted on desktop, which is why the breakpoint is read
 * in JS here: rendering a whole second page hidden on mobile would be pure waste.
 */
export function AvaliacaoLayout() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const noDesktop = useMediaQuery(DESKTOP)

  const slug = pathname.split('/')[2] ?? ''
  const step = findStep(slug)
  const direction = useStepDirection(step ? getStepIndex(step.slug) : 0)

  const origem = lerOrigem(search, ORIGEM_PADRAO)
  // The app screen behind the modal: the destination the flow came from, or the one the
  // frames draw when it came from anywhere else.
  const destino = (origem.startsWith('/app/') ? origem.split('/')[2] : 'agendamentos') as DestinoSlug
  const Fundo = destinoComponents[destino] ?? destinoComponents.agendamentos

  const fechar = useCallback(() => navigate(origem), [navigate, origem])

  if (!step) {
    return <Navigate to="/avaliacao/realizada" replace />
  }

  const goBack = () => {
    const anterior = getPreviousStep(step.slug)
    navigate(anterior ? `/avaliacao/${anterior.slug}${search}` : origem)
  }

  const Screen = screenComponents[step.slug]

  return (
    <AvaliacaoProvider>
      <StepChromeProvider>
        <FeedbackShell
          pergunta={step.pergunta}
          totalPerguntas={TOTAL_PERGUNTAS}
          onBack={goBack}
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
    </AvaliacaoProvider>
  )
}
