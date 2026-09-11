import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router'

import { StepChromeProvider } from '@/components/layout/step-chrome'
import { lerOrigem } from '@/lib/origem'
import { StepShell } from '@/components/layout/step-shell'
import { StepTransition, useStepDirection } from '@/components/layout/step-transition'

import { AgendamentoProvider } from './agendamento-provider'
import { screenComponents } from './screens/registry'
import { findStep, getPreviousStep, getStepIndex } from './steps'

/**
 * Layout route: holds the flow state so it survives navigation between steps, and — since
 * React Router keeps it mounted across them — owns the chrome too. The header, back
 * button, progress bar and footer bar live here and stay still; only the `<Outlet/>`
 * slides. A cold deep-link into any single step still mounts with the provider's mock
 * defaults.
 */
export function AgendamentoLayout() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  const slug = pathname.split('/')[2] ?? ''
  const step = findStep(slug)
  const direction = useStepDirection(step ? getStepIndex(step.slug) : 0)

  const goBack = () => {
    const anterior = step ? getPreviousStep(step.slug) : undefined
    navigate(anterior ? `/agendamento/${anterior.slug}${search}` : lerOrigem(search, '/'))
  }

  const conteudo = (
    <StepTransition
      stepKey={slug}
      direction={direction}
      wrapperClassName="flex flex-1 flex-col"
      className="flex flex-1 flex-col"
    >
      <Outlet />
    </StepTransition>
  )

  return (
    <AgendamentoProvider>
      <StepChromeProvider>
        {step?.progress === null || !step ? (
          conteudo
        ) : (
          <StepShell
            stepLabel={step.stepLabel!}
            progress={step.progress}
            onBack={goBack}
          >
            {conteudo}
          </StepShell>
        )}
      </StepChromeProvider>
    </AgendamentoProvider>
  )
}

export function AgendamentoStepRoute() {
  const { step: slug } = useParams()
  const step = slug ? findStep(slug) : undefined

  if (!step) {
    return <Navigate to="/agendamento/detalhes" replace />
  }

  const Screen = screenComponents[step.slug]

  return <Screen />
}
