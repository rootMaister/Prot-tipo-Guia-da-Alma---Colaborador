import type { ElementType, ReactNode } from 'react'

import { cn, FeaturedIcon, GuiaDaAlmaSymbol } from '@guia-da-alma/ds'

import { useScreenSurface } from '@/lib/use-screen-surface'

/**
 * O verde-lima é o sucesso (Empresa encontrada, Perfil aprovado, Sessão agendada); o
 * sunflower é o "Acesso recusado" (3689:699 / 3689:709), o mesmo layout com a notícia
 * contrária. Cada tom leva a cor do fundo, do texto e a do `FeaturedIcon` — no sunflower o
 * círculo do ícone tem a cor do próprio fundo, então só o glifo aparece (Color=Carefull no
 * arquivo, `warning` no DS).
 */
const tons = {
  green: {
    superficie: 'category-green-surface',
    fundo: 'bg-category-green-surface',
    texto: 'text-category-green-text',
    icone: 'positive-accent',
  },
  sunflower: {
    superficie: 'category-sunflower-surface',
    fundo: 'bg-category-sunflower-surface',
    texto: 'text-category-sunflower-text',
    icone: 'warning',
  },
} as const

type FeatureShellProps = {
  icon: ElementType
  tom?: keyof typeof tons
  /**
   * Small line above the headline, in `category/green/text`. Omitted on "Sessão agendada"
   * (1236:11034), which drops it and shows the headline alone.
   */
  eyebrow?: string
  title: ReactNode
  /**
   * Linha abaixo do título — a de "Sessão agendada" (3306:3344), que diz onde a sessão
   * acontece. Label S; o arquivo pinta em `text/default` (#262626), que o DS não tem como
   * token semântico, então vai em `fg/default`.
   */
  descricao?: ReactNode
  /**
   * Frase em Body M na cor do tom — a do "Acesso recusado". O arquivo a põe **abaixo** do
   * título no mobile e **acima** no desktop, como o `eyebrow`; aqui é um nó só, reordenado
   * no desktop, para o leitor de tela ler título e frase sempre na mesma ordem.
   */
  legenda?: ReactNode
  footer: ReactNode
}

/**
 * Full-bleed celebratory screens on the lime surface — steps 3 (Empresa encontrada) and
 * 8 (Perfil aprovado). Built from nodes 670:606 / 670:616 and 275:2195 / 346:108. Also
 * 8b (Acesso recusado), the same frame in sunflower — see `tons`.
 *
 * Unlike `SignUpShell`, the desktop header here is the Guia da Alma *symbol* (38×33),
 * not the full lockup, and the content column sits bottom-aligned rather than centred.
 *
 * DS-GAP: `FeaturedIcon size="xxl"` gives the right 80px container but a 40px glyph
 * where Figma draws 36px — xxl is the largest size the component offers.
 */
export function FeatureShell({
  icon,
  tom = 'green',
  eyebrow,
  title,
  descricao,
  legenda,
  footer,
}: FeatureShellProps) {
  const cores = tons[tom]
  useScreenSurface(cores.superficie)

  return (
    <div className={cn(cores.fundo, 'pt-safe px-safe flex min-h-dvh flex-col')}>
      {/* No status bar on these two screens — the design just opens with 48px of air. */}
      <header className="hidden w-full px-8 py-8 lg:block">
        {/* O símbolo fica verde nos dois tons — o arquivo não o recolore no sunflower. */}
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
              <FeaturedIcon icon={icon} size="xxl" color={cores.icone} />
            </div>

            <div className="mt-auto flex flex-col items-start gap-3">
              {eyebrow ? (
                <p className={cn('text-body-m w-full', cores.texto)}>{eyebrow}</p>
              ) : null}

              <h1 className={cn('font-display text-display-m w-full', cores.texto)}>{title}</h1>

              {legenda ? (
                <p className={cn('text-body-m w-full lg:-order-1', cores.texto)}>{legenda}</p>
              ) : null}

              {descricao ? (
                // 24px abaixo do título, o `space/component/xxl` do frame; o `gap-3` dá 12.
                <p className="text-label-s text-fg-default w-full pt-3">{descricao}</p>
              ) : null}
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
