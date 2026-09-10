import { Button, GuiaDaAlmaSymbol } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import { GradientBackdrop } from '@/components/local/gradient-backdrop'
import { GuiaLockup } from '@/components/local/guia-lockup'

import { useStepNavigation } from '../use-step-navigation'

import { useScreenSurface } from '@/lib/use-screen-surface'

/**
 * Entry screen — nodes 779:415 (mobile) and 826:3114 (desktop).
 *
 * The two breakpoints are different designs, not one design reflowed: mobile stacks the
 * headline and buttons over the gradient on a light ground, while desktop splits into a
 * gradient card on the left and an inverted dark panel on the right, where the primary
 * button flips from dark to lime.
 *
 * "Entre na sua conta" is rendered but inert — Login is a later slice of the prototype.
 */
export function WelcomeScreen() {
  useScreenSurface('surface-brand-strong')

  const { goNext } = useStepNavigation('welcome')

  return (
    <>
      {/* Mobile */}
      <div className="pt-safe px-safe relative isolate flex min-h-app flex-col justify-end bg-surface-brand-strong lg:hidden">
        <GradientBackdrop variant="mobile" className="z-0" />

        <div className="pb-safe relative z-10 flex w-full flex-col gap-8 px-6 pt-3 [--pb-safe:1rem]">
          <div className="flex flex-col justify-center gap-6">
            <GuiaDaAlmaSymbol className="h-[60px] w-[70px] text-fg-default" />
            <h1 className="font-display text-heading-m text-fg-default">
              Sua jornada
              <br />
              de bem-estar,
              <br />
              começa aqui
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            <Button variant="contained" className="w-full" onClick={goNext}>
              Iniciar jornada
            </Button>
            <Button variant="text" className="w-full">
              Entre na sua conta
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="bg-surface-subtle pt-safe px-safe hidden min-h-app items-stretch lg:flex">
        <div className="flex min-w-0 flex-1 items-center bg-surface-brand-strong p-4">
          <div className="relative flex h-full max-h-[928px] w-full flex-col gap-2.5 overflow-hidden rounded-2xl px-12 py-24">
            <GradientBackdrop variant="desktop" className="z-0" />

            <div className="relative z-10 flex w-full flex-col gap-4">
              <GuiaLockup height={33} className="text-fg-default" />
            </div>

            <div className="relative z-10 flex w-full flex-1 flex-col justify-end">
              <h1 className="font-display text-heading-xxl text-fg-default">
                Sua jornada
                <br />
                de bem-estar,
                <br />
                começa aqui
              </h1>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-12 bg-surface-brand-strong px-8 pt-24">
          <div className="flex w-[378px] max-w-full flex-col justify-center gap-12">
            <div className="flex w-full flex-col gap-6">
              <p className="text-label-l text-fg-on-action font-semibold">
                Vamos conectar você aos melhores profissionais de saúde mental de forma
                personalizada
              </p>

              <div className="flex w-full flex-col gap-6 border-t border-black/3 pt-3 pb-8">
                <Button
                  variant="lime"
                  className="w-full"
                  onClick={goNext}
                  trailingIcon={<ArrowRightIcon className="size-[18px]" />}
                >
                  Iniciar jornada
                </Button>

                {/*
                  DS-GAP: Figma draws this as `fg/on-action` (#ecfaca) on the dark panel,
                  but no Button variant renders light text on a dark ground — `text` is
                  `action/tertiary` (#1c2e17), which would be invisible here. This is the
                  one place I overrode a DS colour with className, because the honest
                  alternative renders an unreadable button. See DS-GAPS.md.
                */}
                <Button variant="text" className="text-fg-on-action w-full">
                  Entre na sua conta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
