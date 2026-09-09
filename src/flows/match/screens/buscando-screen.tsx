import { useEffect } from 'react'

import { GuiaOrb } from '@/components/local/guia-orb'

import { useStepNavigation } from '../use-step-navigation'

/** Mocked matching run. Long enough to see the orb turn, short enough to keep moving. */
const SEARCH_DELAY_MS = 4000

/**
 * Step 6 — nodes 861:4096 (mobile) and 861:4072 (desktop).
 *
 * Figma numbers two frames "6.": this one and "Buscando profissionais" (805:2472 /
 * 861:3898), which is the same screen with the copy "Buscando os melhores profissionais".
 * They are alternates, not consecutive steps, and this is the one that leads into step 7's
 * list of sessions. The other pair is recorded in `steps.ts`.
 *
 * The orb carries its halos on both breakpoints here, unlike on step 1 where only the
 * desktop frame has them.
 */
export function BuscandoScreen() {
  const { goNext } = useStepNavigation('buscando')

  useEffect(() => {
    const timer = window.setTimeout(goNext, SEARCH_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [goNext])

  return (
    <div className="bg-surface-brand-strong flex min-h-dvh flex-col items-center justify-center gap-16 px-6">
      <GuiaOrb halo />

      <p className="text-label-s text-fg-on-action max-w-[280px] text-center">
        Buscando as melhores sessões para o seu perfil
      </p>
    </div>
  )
}
