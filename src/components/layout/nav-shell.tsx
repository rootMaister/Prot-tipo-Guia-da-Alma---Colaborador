import type { ReactNode } from 'react'

import { Avatar, Badge, cn } from '@guia-da-alma/ds'
import { NavLink, useLocation } from 'react-router'

import { GuiaLockup } from '@/components/local/guia-lockup'
import { useScreenSurface } from '@/lib/use-screen-surface'
import { destinosNoMenu, type Destino } from '@/shell/destinos'
import { iniciais, useConta } from '@/state/conta-provider'

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
export function NavShell({
  children,
  slugAtivo: slugFixo,
  barraInferior = true,
}: {
  children: ReactNode
  /**
   * Se a barra inferior do mobile aparece. As páginas de perfil (`peloPerfil` em
   * `destinos.ts`) não a desenham: elas trazem um botão de voltar no lugar.
   */
  barraInferior?: boolean
  /**
   * The item to mark, when the URL is not a destination's — the Avaliação modal draws the
   * app behind it with the destination it was opened from still active.
   */
  slugAtivo?: string
}) {
  useScreenSurface('surface-base')

  const slugDaRota = useLocation().pathname.split('/')[2] ?? ''
  const slugAtivo = slugFixo ?? slugDaRota

  return (
    <div className="bg-surface-base pt-safe px-safe flex min-h-dvh flex-col">
      <NavRail slugAtivo={slugAtivo} />

      {/*
        The column is centred on the **viewport**, not in what the rail leaves over. That is
        how the Home is drawn (590:9086): its content runs 406→1034 of 1440, whose centre is
        720 — dead centre of the frame — with the nav column being simply the left margin
        that happens to hold the menu. The rail is therefore taken out of the flow, so it
        does not shift the centre.

        Width: the designed measure is 1000 (Busca 1526:908, Meus agendamentos 1558:1876),
        and 1000 cannot be centred on a 1440 viewport without sliding under a 280px rail —
        it would start at 220. So centring is the constraint and the width is what gives:
        capped at the designed 1000, floored by staying 24px clear of the rail. At 1440 that
        is 832, at 1608 and up the full 1000. See SYNC-FIGMA.md.
      */}
      <main
        className={cn(
          'flex w-full flex-1 flex-col lg:mx-auto lg:w-[min(1000px,100%-608px)] lg:pb-0',
          // O espaço embaixo é para a barra; sem ela, não há o que desviar.
          barraInferior && 'pb-[108px]',
        )}
      >
        {children}
      </main>

      {barraInferior ? <BarraInferior slugAtivo={slugAtivo} /> : null}
    </div>
  )
}

const caminho = (destino: Destino) => `/app/${destino.slug}`

const destinosMobile = destinosNoMenu.filter((destino) => destino.noMobile)

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
 * Fixed rather than a flex column, so it does not take layout width: the content column
 * centres on the whole viewport, the way the Home frame draws it, and the rail sits in the
 * left margin that centring leaves over.
 *
 * Exportada porque o fluxo de Agendamento também a desenha quando é aberto de dentro do app
 * — os frames "com menu" (1617:4660 e irmãos). Lá ela não é margem: o conteúdo vem depois
 * dela, e quem abre espaço é o `comMenu` do `StepShell`.
 *
 * Diário and Meu progresso are in the design but have no screens in this prototype, so they
 * render exactly as drawn and simply do not navigate — hiding them would misreport the menu.
 */
export function NavRail({ slugAtivo }: { slugAtivo: string }) {
  return (
    <aside className="hidden lg:fixed lg:top-0 lg:left-0 lg:flex lg:h-dvh lg:w-[280px] lg:flex-col">
      <div className="p-8">
        <GuiaLockup height={19} className="text-fg-default" />
      </div>

      <nav aria-label="Navegação principal" className="flex flex-1 flex-col gap-8 px-8 py-16">
        {destinosNoMenu.map((destino) => {
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

      <Usuario />
    </aside>
  )
}

/**
 * Quem está logado, no pé da régua — e a porta de "Meus dados".
 *
 * O bloco entrou na revisão de 11/09/2026 (avatar com iniciais e nome, "para indicar que
 * está logado"), quando o `desktop-navigation` de então (1526:900) tinha só o lockup e os
 * cinco itens. O menu de "Meus dados" (2876:263) desenha o pé: avatar, nome e o nível — e a
 * descrição do componente diz que é por aqui que se chega a ela ("acessada pelo perfil").
 * Daí ser um link, e não um bloco morto. Pontos e Calma Coins também estão na descrição,
 * mas o frame não os desenha; ficam para quando aparecerem. Ver SYNC-FIGMA.md.
 */
function Usuario() {
  const { conta } = useConta()

  return (
    <NavLink
      to="/app/meus-dados"
      className="hover:bg-surface-subtle mx-4 mb-8 flex items-center gap-3 rounded-full px-4 py-2 transition-colors duration-150 ease-out"
    >
      {/* `Avatar` é redondo e sem imagem cai no `fallback` — que aqui é o que queremos. */}
      <Avatar fallback={iniciais(conta)} size="md" variant="primary" />
      <div className="flex min-w-0 flex-col items-start gap-1">
        <p className="text-label-m text-fg-default min-w-0 truncate">
          {conta.nome} {conta.sobrenome}
        </p>
        <Badge variant="neutral">Nível {conta.nivel}</Badge>
      </div>
    </NavLink>
  )
}
