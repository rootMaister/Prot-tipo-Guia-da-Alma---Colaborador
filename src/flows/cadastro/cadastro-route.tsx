import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router'

import { SignUpShell } from '@/components/layout/sign-up-shell'
import { StepChromeProvider } from '@/components/layout/step-chrome'
import { StepTransition, useStepDirection } from '@/components/layout/step-transition'
import { useKeyboardOpen } from '@/lib/use-keyboard-open'

import { CadastroProvider } from './cadastro-provider'
import { screenComponents } from './screens/registry'
import { findStep, getPreviousStep, getStepIndex } from './steps'

/**
 * Layout route: holds the flow state so it survives navigation between steps, and — since
 * React Router keeps it mounted across them — owns the chrome too. The header, back
 * button, progress bar and footer bar live here and stay still; only the `<Outlet/>`
 * slides. A cold deep-link into any single step still mounts with the provider's mock
 * defaults.
 */
export function CadastroLayout() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  const slug = pathname.split('/')[2] ?? ''
  const step = findStep(slug)
  const direction = useStepDirection(step ? getStepIndex(step.slug) : 0)
  const tecladoAberto = useKeyboardOpen()

  const goBack = () => {
    const anterior = step ? getPreviousStep(step.slug) : undefined
    navigate(anterior ? `/cadastro/${anterior.slug}${search}` : `/${search}`)
  }

  const conteudo = (
    <StepTransition
      stepKey={slug}
      direction={direction}
      wrapperClassName={tecladoAberto ? 'flex flex-col' : 'flex min-h-0 flex-1 flex-col'}
      className={
        tecladoAberto
          ? 'flex flex-col lg:-mx-1.5 lg:px-1.5'
          : 'flex min-h-0 flex-1 flex-col overflow-y-auto lg:-mx-1.5 lg:px-1.5'
      }
    >
      <Outlet />
    </StepTransition>
  )

  return (
    <CadastroProvider>
      <StepChromeProvider>
        {step?.progress === null || !step ? (
          conteudo
        ) : (
          <SignUpShell
            stepLabel={step.stepLabel!}
            progress={step.progress}
            onBack={goBack}
            keyboardOpen={tecladoAberto}
          >
            {conteudo}
          </SignUpShell>
        )}
      </StepChromeProvider>
    </CadastroProvider>
  )
}

export function CadastroStepRoute() {
  const { step: slug } = useParams()
  const step = slug ? findStep(slug) : undefined

  if (!step) {
    return <Navigate to="/cadastro/splash" replace />
  }

  const Screen = screenComponents[step.slug]

  return <Screen />
}
