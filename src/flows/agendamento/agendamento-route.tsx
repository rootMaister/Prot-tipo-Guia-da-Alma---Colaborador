import { Navigate, useLocation, useNavigate } from 'react-router'

import { StepChromeProvider } from '@/components/layout/step-chrome'
import { NavRail } from '@/components/layout/nav-shell'
import { lerOrigem, slugDeOrigem, veioDoApp } from '@/lib/origem'
import { StepShell } from '@/components/layout/step-shell'
import { StepTransition, useStepDirection } from '@/components/layout/step-transition'

import { AgendamentoProvider } from './agendamento-provider'
import { ResumoAgendamento } from './resumo-agendamento'
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
export function AgendamentoLayout() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  const slug = pathname.split('/')[2] ?? ''
  const step = findStep(slug)
  const direction = useStepDirection(step ? getStepIndex(step.slug) : 0)

  const comMenu = veioDoApp(search)

  const goBack = () => {
    const anterior = step ? getPreviousStep(step.slug) : undefined
    navigate(anterior ? `/agendamento/${anterior.slug}${search}` : lerOrigem(search, '/'))
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
    return <Navigate to="/agendamento/detalhes" replace />
  }

  return (
    <AgendamentoProvider>
      <StepChromeProvider>
        {/*
          Aberto de dentro do app, o fluxo mantém a régua — é o que os frames "com menu"
          desenham, e o que a revisão pediu. Ela é `fixed` e só aparece no desktop, então no
          mobile nada muda: lá agendar continua sendo tarefa em tela cheia.
        */}
        {comMenu ? <NavRail slugAtivo={slugDeOrigem(search)} /> : null}

        {step?.progress === null || !step ? (
          conteudo
        ) : (
          <StepShell
            stepLabel={step.stepLabel!}
            progress={step.progress}
            onBack={goBack}
            aside={step.split ? <ResumoAgendamento /> : undefined}
            comMenu={comMenu}
          >
            {conteudo}
          </StepShell>
        )}
      </StepChromeProvider>
    </AgendamentoProvider>
  )
}
