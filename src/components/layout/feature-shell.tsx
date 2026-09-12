import type { ElementType, ReactNode } from 'react'

import { FeaturedIcon, GuiaDaAlmaSymbol } from '@guia-da-alma/ds'

import { useScreenSurface } from '@/lib/use-screen-surface'

type FeatureShellProps = {
  icon: ElementType
  /**
   * Small line above the headline, in `category/green/text`. Omitted on "Sessão agendada"
   * (1236:11034), which drops it and shows the headline alone.
   */
  eyebrow?: string
  title: ReactNode
  footer: ReactNode
}

/**
 * Full-bleed celebratory screens on the lime surface — steps 3 (Empresa encontrada) and
 * 8 (Perfil aprovado). Built from nodes 670:606 / 670:616 and 275:2195 / 346:108.
 *
 * Unlike `SignUpShell`, the desktop header here is the Guia da Alma *symbol* (38×33),
 * not the full lockup, and the content column sits bottom-aligned rather than centred.
 *
 * DS-GAP: `FeaturedIcon size="xxl"` gives the right 80px container but a 40px glyph
 * where Figma draws 36px — xxl is the largest size the component offers.
 */
export function FeatureShell({ icon, eyebrow, title, footer }: FeatureShellProps) {
  useScreenSurface('category-green-surface')

  return (
    <div className="bg-category-green-surface pt-safe px-safe flex min-h-dvh flex-col">
      {/* No status bar on these two screens — the design just opens with 48px of air. */}
      <header className="hidden w-full px-8 py-8 lg:block">
        <GuiaDaAlmaSymbol className="text-category-green-text h-[33px] w-[38px]" />
      </header>

      <div className="flex flex-1 flex-col pt-12 lg:items-center lg:pt-0">
        <div className="flex w-full flex-1 flex-col px-6 py-12 lg:max-w-[450px] lg:px-0">
          <div className="relative flex flex-1 flex-col">
            {/*
              Absolutely centred rather than laid out above the copy: "in the middle of the
              screen" has to hold on every viewport, and a flex band only centres inside
              whatever space the copy leaves it — which lands the mark around a third of
              the way down instead of halfway. Figma draws it at 44.6% of the frame, so
              dead centre of the content area is the closest honest reading. Review
              decision, applies to every feedback screen.
            */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <FeaturedIcon icon={icon} size="xxl" color="positive-accent" />
            </div>

            <div className="mt-auto flex flex-col items-start gap-3">
              {eyebrow ? (
                <p className="text-body-m text-category-green-text w-full">{eyebrow}</p>
              ) : null}

              <h1 className="font-display text-display-m text-category-green-text w-full">
                {title}
              </h1>
            </div>
          </div>
        </div>

        {/* `flex-col gap-3` so a screen can stack a secondary action under the primary. */}
        <div className="pb-safe flex w-full flex-col gap-3 px-6 pt-3 [--pb-safe:2.5rem] lg:max-w-[450px] lg:px-0">
          {footer}
        </div>
      </div>
    </div>
  )
}
