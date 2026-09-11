import type { ReactNode } from 'react'

import { cn } from '@guia-da-alma/ds'
import { NavLink, useLocation } from 'react-router'

import { GuiaLockup } from '@/components/local/guia-lockup'
import { useScreenSurface } from '@/lib/use-screen-surface'
import { destinos, type Destino } from '@/shell/destinos'

/**
 * The permanent navigation of the app proper — everything after the onboarding flows.
 *
 * Two different designs, not one reflow: mobile draws `bottom-nav-bar` (28150:1265), a dark
 * pill floating over the content with **three** destinations; desktop draws
 * `desktop-navigation` (1526:900), a 280px rail with the lockup and **five**. Which
 * destinations each one shows is declared in `shell/destinos.ts`, the way `steps.ts` declares
 * a flow's order.
 *
 * Rendered by the **layout route**, so the bar and the rail stay mounted while only the
 * destination's content swaps — the same reason `StepShell` lives in a flow's layout route.
 *
 * DS-GAP: the design system has a `NavBar`, and it cannot be used here for two independent
 * reasons. It is absent from the barrel (so it is not even in the published bundle —
 * `grep NavBar dist/index.js` finds nothing), and `NavBarProps` has no items prop: the
 * destinations are hardcoded, and they are the *professional's* app (`atendimentos`,
 * `prontuarios`, `servicos`). The fix is for it to take its items as data. See DS-GAPS.md.
 */
export function NavShell({ children }: { children: ReactNode }) {
  useScreenSurface('surface-base')

  const slugAtivo = useLocation().pathname.split('/')[2] ?? ''

  return (
    <div className="bg-surface-base pt-safe px-safe flex min-h-dvh flex-col lg:flex-row">
      <MenuLateral slugAtivo={slugAtivo} />

      {/*
        The 1000px column is **centred** in what the rail leaves, not flush against it.
        1440 = 280 (rail) + 1160, and the newest desktop grid in the file — the "Com
        navegação" section, e.g. 1617:4660 — insets its content by 80 on each side of that
        1160, which is exactly `lg:px-20` here. The oldest one, the Home at 590:9086,
        centres too (406 of gutter on each side of a 628px column).

        Busca (1526:908) and Meus agendamentos (1558:1876) are the two frames that do not:
        they put the column at x=280, flush against the rail, with all 160px of "Respiro
        lateral" on the right. Following those two left every desktop screen visibly pulled
        to the left, and worse the wider the viewport. See SYNC-FIGMA.md.
      */}
      <main className="flex w-full flex-1 flex-col pb-[108px] lg:items-center lg:px-20 lg:pb-0">
        <div className="flex w-full flex-1 flex-col lg:max-w-[1000px]">{children}</div>
      </main>

      <BarraInferior slugAtivo={slugAtivo} />
    </div>
  )
}

const caminho = (destino: Destino) => `/app/${destino.slug}`

const destinosMobile = destinos.filter((destino) => destino.noMobile)

/**
 * `bottom-nav-bar` — a wrapper with 8px of side padding and 24px above and below, holding a
 * `nav/bg` pill of 4px padding. The active item keeps its own width and the others share
 * what is left. Fixed rather than absolute so it stays put while the destination scrolls,
 * which is how the design reads it: the frame draws it pinned to the bottom of the screen,
 * over the content.
 *
 * The active pill is given a fixed width in Figma, and a different one on each screen — 98px
 * for Início, 120 for Buscar, 144 for Agendamentos — which is not a constant padding around
 * any of the three labels. It hugs its label here instead. See SYNC-FIGMA.md.
 */
function BarraInferior({ slugAtivo }: { slugAtivo: string }) {
  return (
    <nav
      aria-label="Navegação principal"
      className="pb-safe px-safe fixed inset-x-0 bottom-0 z-20 pt-6 lg:hidden [--pb-safe:1.5rem] [--px-safe:0.5rem]"
    >
      <div className="bg-nav-bg flex items-center rounded-full p-1">
        {destinosMobile.map((destino) => {
          const Icone = destino.icone
          const ativo = destino.slug === slugAtivo

          return (
            <NavLink
              key={destino.slug}
              to={caminho(destino)}
              className={cn(
                'text-label-s flex flex-col items-center gap-1 rounded-full py-1.5 font-semibold',
                'transition-colors duration-150 ease-out',
                ativo
                  ? // DS-GAP: the design system's `nav-bg-active` / `nav-text-active` pair is
                    // inverted against this design — it paints a light chip (#ECFACA) with dark
                    // text, where Figma binds `navigation/background-item/active` to #5A8200 and
                    // `navigation/icon/active` to #F0FCDD. Those two colours do exist in the DS,
                    // but only as Tier-1 primitives: `primitives.css` declares them on `:root`
                    // rather than in an `@theme` block, so there is no `bg-brand-lime-600`
                    // utility to reach them with either. Hence the variables by name — the token
                    // is still the source, and no hex is hard-coded. `text-[color:var(…)]` needs the
                    // `color:` hint — a bare `var()` is ambiguous and Tailwind reads it as a font size.
                    // See DS-GAPS.md.
                    'shrink-0 bg-[var(--color-brand-lime-600)] px-7 text-[color:var(--color-brand-lime-medium-25)]'
                  : 'text-nav-text hover:text-nav-text-hover min-w-px flex-1',
              )}
            >
              <Icone className="size-4" aria-hidden />
              {destino.rotulo}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

/**
 * `desktop-navigation` (1526:900). Drawn 385px wide as a component but placed at **280** in
 * every screen that uses it, which is the width that counts.
 *
 * Diário and Meu progresso are in the design but have no screens in this prototype, so they
 * render exactly as drawn and simply do not navigate — hiding them would misreport the menu.
 */
function MenuLateral({ slugAtivo }: { slugAtivo: string }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[280px] shrink-0 flex-col lg:flex">
      <div className="p-8">
        <GuiaLockup height={19} className="text-fg-default" />
      </div>

      <nav aria-label="Navegação principal" className="flex flex-col gap-8 px-8 py-16">
        {destinos.map((destino) => {
          const Icone = destino.icone
          const ativo = destino.slug === slugAtivo

          // Label M (16/24) against Figma's unbound Inter 16/22 — the rail's labels are the one
          // place in the file where the text is not bound to the typography token. See SYNC-FIGMA.md.
          const classe = cn(
            'text-label-m flex w-fit items-center gap-4 rounded-full px-4 py-3 font-semibold',
            'transition-colors duration-150 ease-out',
            ativo
              ? 'bg-action-primary text-action-accent'
              : 'text-fg-default hover:bg-surface-subtle',
          )

          if (!destino.disponivel) {
            return (
              <span
                key={destino.slug}
                aria-disabled="true"
                title="Ainda não desenhado neste protótipo"
                className={cn(classe, 'cursor-not-allowed hover:bg-transparent')}
              >
                <Icone className="size-6" aria-hidden />
                {destino.rotulo}
              </span>
            )
          }

          return (
            <NavLink key={destino.slug} to={caminho(destino)} className={classe}>
              <Icone className="size-6" aria-hidden />
              {destino.rotulo}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
