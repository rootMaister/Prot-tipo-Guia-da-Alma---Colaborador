import { Navigate, useLocation } from 'react-router'

import { NavShell } from '@/components/layout/nav-shell'
import { StepTransition, useStepDirection } from '@/components/layout/step-transition'
import { DESKTOP, useMediaQuery } from '@/lib/use-media-query'

import { destinos, findDestino } from './destinos'
import { screenComponents } from './screens/registry'

/**
 * Layout route for the app's destinations, mirroring what each flow's layout route does:
 * React Router keeps it mounted while the destination changes, so the navigation stays put
 * and only the content moves.
 *
 * A tela é resolvida aqui, pelo registry, e não por um `<Outlet/>` — ver a nota no
 * `cadastro-route.tsx` e em CLAUDE.md.
 *
 * O deslize segue a ordem do menu, e o **eixo segue a forma do menu**: no desktop, onde a
 * régua é vertical, ir para um destino mais abaixo entra por baixo; no mobile, onde a barra
 * é horizontal, entra pela direita. Antes era lateral nos dois, o que contradizia a direção
 * do clique no desktop — corrigido na revisão de 11/09/2026.
 */
export function ShellLayout() {
  const slug = useLocation().pathname.split('/')[2] ?? ''
  const indice = destinos.findIndex((destino) => destino.slug === slug)
  const direction = useStepDirection(indice < 0 ? 0 : indice)
  const noDesktop = useMediaQuery(DESKTOP)

  const destino = findDestino(slug)
  const Screen = destino ? screenComponents[destino.slug] : undefined

  if (!Screen) {
    return <Navigate to="/app/inicio" replace />
  }

  return (
    <NavShell>
      <StepTransition
        stepKey={slug}
        direction={direction}
        eixo={noDesktop ? 'y' : 'x'}
        wrapperClassName="flex flex-1 flex-col"
        className="flex flex-1 flex-col"
      >
        <Screen />
      </StepTransition>
    </NavShell>
  )
}
