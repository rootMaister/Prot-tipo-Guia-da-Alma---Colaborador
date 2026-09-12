import { Navigate, useLocation, useNavigate } from 'react-router'

import { StepChromeProvider } from '@/components/layout/step-chrome'
import { lerOrigem } from '@/lib/origem'
import { StepShell } from '@/components/layout/step-shell'
import { StepTransition, useStepDirection } from '@/components/layout/step-transition'

import { MatchProvider } from './match-provider'
import { screenComponents } from './screens/registry'
import { findStep, getPreviousStep, getStepIndex } from './steps'

/**
 * Layout route: holds the flow state so it survives navigation between steps, and — since
 * React Router keeps it mounted across them — owns the chrome too. The header, back
 * button, progress bar and footer bar live here and stay still; só o conteúdo do passo
 * desliza. Um deep-link frio em qualquer passo monta com os defaults mockados do provider.
 *
 * A tela é resolvida **aqui**, pelo registry, e não por um `<Outlet/>`: o `AnimatePresence`
 * guarda o elemento que está saindo e o re-renderiza durante a saída, e um `Outlet` lê a
 * rota atual nessa hora — então o elemento que devia estar saindo passava a mostrar a tela
 * nova. O efeito era a tela aparecer, sair e aparecer de novo. Ver a nota em CLAUDE.md.
 */
export function MatchLayout() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  const slug = pathname.split('/')[2] ?? ''
  const step = findStep(slug)
  const direction = useStepDirection(step ? getStepIndex(step.slug) : 0)

  const goBack = () => {
    const anterior = step ? getPreviousStep(step.slug) : undefined
    navigate(anterior ? `/match/${anterior.slug}${search}` : lerOrigem(search, '/'))
  }

  const Screen = step ? screenComponents[step.slug] : undefined

  const conteudo = (
    <StepTransition
      stepKey={slug}
      direction={direction}
      wrapperClassName="flex flex-1 flex-col"
      className="flex flex-1 flex-col"
    >
      {Screen ? <Screen /> : null}
    </StepTransition>
  )

  if (!step) {
    return <Navigate to="/match/inicio" replace />
  }

  return (
    <MatchProvider>
      <StepChromeProvider>
        {step?.progress === null || !step ? (
          conteudo
        ) : (
          <StepShell
            stepLabel={step.stepLabel!}
            progress={step.progress}
            onBack={goBack}
            wide={step.wide}
          >
            {conteudo}
          </StepShell>
        )}
      </StepChromeProvider>
    </MatchProvider>
  )
}
