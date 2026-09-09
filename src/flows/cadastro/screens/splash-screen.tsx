import { useEffect } from 'react'


import { GuiaLockup } from '@/components/local/guia-lockup'

import { useStepNavigation } from '../use-step-navigation'

import { useScreenSurface } from '@/lib/use-screen-surface'

/** Launch screens are brief by nature; long enough to read the mark, short enough not to annoy. */
const SPLASH_DURATION_MS = 1800

/**
 * Launch screen (node 783:487 — the frame is literally named " " in Figma).
 *
 * Mobile-only in the design: the desktop flow opens straight on Welcome. Rendered at every
 * width here anyway, since it is the entry point of the prototype.
 *
 * DS-GAP-DESIGN: the lockup is bound to the primitive `Primária/Off White` (#F5F4F1) rather
 * than a semantic foreground token, and no `fg/*` token carries that value — `fg/on-brand` is
 * #ffffff. Using the semantic token; the difference is imperceptible on the dark ground.
 */
export function SplashScreen() {
  useScreenSurface('surface-brand-strong')

  const { goNext } = useStepNavigation('splash')

  useEffect(() => {
    const timer = window.setTimeout(goNext, SPLASH_DURATION_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [goNext])

  return (
    <div className="bg-surface-brand-strong pt-safe px-safe flex min-h-app items-center justify-center">
      <GuiaLockup height={26} className="text-fg-on-brand" />
    </div>
  )
}
