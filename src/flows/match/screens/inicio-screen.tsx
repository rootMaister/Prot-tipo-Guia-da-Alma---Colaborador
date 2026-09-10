import { Button } from '@guia-da-alma/ds'

import { GuiaOrb } from '@/components/local/guia-orb'

import { useStepNavigation } from '../use-step-navigation'

import { useScreenSurface } from '@/lib/use-screen-surface'

/**
 * Opening screen of the Match flow — nodes 478:6794 (mobile) and 861:4122 (desktop).
 * Picks up straight from the last Cadastro screen, "Perfil aprovado".
 *
 * Both breakpoints are the same dark composition; desktop centres it in a 450px column
 * and wraps the orb in two counter-rotating halos the mobile frame does not have.
 *
 * The subtitle differs between the frames — mobile credits "a IA do Guia", desktop just
 * says "vamos indicar". Mobile is the canonical copy for this flow, so it is used on both.
 *
 * "Quero explorar a plataforma" is `action/primary` on an `action/primary` ground, so the
 * button reads as a bare lime label. That is what the file draws, and `variant="contained"`
 * reproduces it exactly — not a gap, just an unusual pairing.
 */
export function InicioScreen() {
  useScreenSurface('surface-brand-strong')

  const { goNext } = useStepNavigation('inicio')

  return (
    <div className="bg-surface-brand-strong pt-safe px-safe flex min-h-app flex-col lg:items-center lg:[--px-safe:2.25rem]">
      <div className="flex w-full flex-1 flex-col lg:max-w-[450px]">
        <div className="flex flex-1 flex-col items-center justify-end gap-6 px-6 py-12 lg:justify-center lg:gap-24 lg:px-0">
          <div className="flex flex-1 items-center justify-center lg:flex-none">
            <GuiaOrb className="lg:hidden" />
            <GuiaOrb halo className="hidden lg:block" />
          </div>

          <div className="text-fg-on-action flex w-full flex-col gap-4">
            {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
            <h1 className="font-display text-heading-l">
              Vamos encontrar o melhor profissional para você
            </h1>
            <p className="text-body-s">
              Com base nas suas respostas, a IA do Guia irá indicar o melhor profissional para te
              atender
            </p>
          </div>
        </div>

        <div className="pb-safe flex w-full flex-col gap-3 border-t border-black/3 px-6 pt-3 [--pb-safe:1rem]">
          <Button variant="lime" className="w-full" onClick={goNext}>
            Continuar
          </Button>
          <Button variant="contained" className="w-full">
            Quero explorar a plataforma
          </Button>
        </div>
      </div>
    </div>
  )
}
