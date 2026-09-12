import { Navigate, Outlet, useLocation, useParams } from 'react-router'

import { NavShell } from '@/components/layout/nav-shell'
import { StepTransition, useStepDirection } from '@/components/layout/step-transition'
import { DESKTOP, useMediaQuery } from '@/lib/use-media-query'

import { destinos, findDestino } from './destinos'
import { screenComponents } from './screens/registry'

/**
 * Layout route for the app's destinations, mirroring what each flow's layout route does:
 * React Router keeps it mounted while the `<Outlet/>` changes, so the navigation stays put
 * and only the destination's content moves.
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

  return (
    <NavShell>
      <StepTransition
        stepKey={slug}
        direction={direction}
        eixo={noDesktop ? 'y' : 'x'}
        wrapperClassName="flex flex-1 flex-col"
        className="flex flex-1 flex-col"
      >
        <Outlet />
      </StepTransition>
    </NavShell>
  )
}

export function ShellDestinoRoute() {
  const { destino: slug } = useParams()
  const destino = slug ? findDestino(slug) : undefined
  const Screen = destino ? screenComponents[destino.slug] : undefined

  if (!Screen) {
    return <Navigate to="/app/inicio" replace />
  }

  return <Screen />
}
