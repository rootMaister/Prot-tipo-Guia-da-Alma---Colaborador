import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { lerOrigem } from '@/lib/origem'

import { getNextStep, getPreviousStep, type StepSlug } from './steps'

/**
 * Moves between steps, carrying any query string along — which is also how `origem`
 * survives the hops. Running off the start of the flow returns to whatever opened it, and
 * only falls back to the prototype index when nothing did. See `lib/origem.ts`.
 */
export function useStepNavigation(slug: StepSlug) {
  const navigate = useNavigate()
  const { search } = useLocation()

  const goTo = useCallback(
    (target: StepSlug | null) => {
      navigate(target ? `/agendamento/${target}${search}` : lerOrigem(search, '/'))
    },
    [navigate, search],
  )

  const goNext = useCallback(() => {
    goTo(getNextStep(slug)?.slug ?? null)
  }, [goTo, slug])

  const goBack = useCallback(() => {
    goTo(getPreviousStep(slug)?.slug ?? null)
  }, [goTo, slug])

  return { goTo, goNext, goBack }
}
