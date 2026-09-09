import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { getNextStep, getPreviousStep, type StepSlug } from './steps'

/** Moves between steps, carrying any query string along. */
export function useStepNavigation(slug: StepSlug) {
  const navigate = useNavigate()
  const { search } = useLocation()

  const goTo = useCallback(
    (target: StepSlug | null) => {
      navigate(target ? `/cadastro/${target}${search}` : `/${search}`)
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
