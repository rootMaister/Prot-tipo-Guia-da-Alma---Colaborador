import { Navigate, Outlet, useLocation, useParams } from 'react-router'

import { NavShell } from '@/components/layout/nav-shell'
import { StepTransition, useStepDirection } from '@/components/layout/step-transition'

import { destinos, findDestino } from './destinos'
import { screenComponents } from './screens/registry'

/**
 * Layout route for the app's destinations, mirroring what each flow's layout route does:
 * React Router keeps it mounted while the `<Outlet/>` changes, so the navigation stays put
 * and only the destination's content moves.
 *
 * The slide follows the menu's own order — moving to a destination further down the list
 * comes in from the right, back up from the left — which is what a tab bar leads a reader
 * to expect. The flows use the same transition for their steps.
 */
export function ShellLayout() {
  const slug = useLocation().pathname.split('/')[2] ?? ''
  const indice = destinos.findIndex((destino) => destino.slug === slug)
  const direction = useStepDirection(indice < 0 ? 0 : indice)

  return (
    <NavShell>
      <StepTransition
        stepKey={slug}
        direction={direction}
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
