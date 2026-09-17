import { useEffect, type CSSProperties, type ReactNode } from 'react'

import { IconButton } from '@guia-da-alma/ds'
import { ArrowLeftIcon } from 'lucide-react'

import { ProgressoPerguntas } from '@/components/local/progresso-perguntas'
import { useScreenSurface } from '@/lib/use-screen-surface'

import { StepFooter, useFooterSlot } from './step-chrome'

type FeedbackShellProps = {
  /** Also used by the mood diary experiment, with its own label and surface. */
  label?: string
  surface?: string
  /** Decorative layer confined to the page/mobile or the desktop modal. */
  decoration?: ReactNode
  /** The question number, or null on the screens without the header. */
  pergunta: number | null
  totalPerguntas: number
  onBack: () => void
  /** Escape on desktop, where the flow is a modal and has no other way out drawn. */
  onFechar: () => void
  /**
   * What the desktop modal sits over — the app screen the flow was opened from. Rendered
   * only on desktop, and inert: it is scenery, not something to use.
   */
  fundo?: ReactNode
  /** The part that transitions between steps. */
  children?: ReactNode
}

/**
 * The Avaliação flow's chrome. Named after the frames' own groups, "Feedback / conteúdo" and
 * "Feedback / ações".
 *
 * Two different designs, not one reflow:
 *
 * - **mobile** is a full-screen page: back button and "Pergunta N de 4" on top, the actions
 *   stacked at the bottom with the primary first;
 * - **desktop** is `modal-centered / Avaliação pós-sessão` (2294:3502) — 560px, 24px of
 *   padding, over a blurred 30% scrim, on top of the app screen it was opened from. No back
 *   button, and the actions side by side with the primary on the **right**.
 *
 * Rendered by the layout route, like `StepShell`, so the header and the footer bar stay put
 * while only the step's content slides. The footer arrives by portal (`StepFooter`); the
 * screens put the primary action first and `flex-row-reverse` moves it right on desktop.
 *
 * DS-GAP: `DialogContent` is `max-w-lg` (512px) with an ✕ baked in, and the file draws a
 * 560px card with none. Same gap as item 34 of DS-GAPS.md. The card's 24px radius has no
 * token either (items 9 and 19) and is drawn at `rounded-2xl`.
 */
export function FeedbackShell({
  label = 'Avaliação da sessão',
  surface = 'surface-base',
  decoration,
  pergunta,
  totalPerguntas,
  onBack,
  onFechar,
  fundo,
  children,
}: FeedbackShellProps) {
  useScreenSurface(surface)
  const setFooterNode = useFooterSlot()

  useEffect(() => {
    const onKey = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onFechar])

  return (
    <>
      {fundo ? (
        <div inert aria-hidden className="hidden lg:block">
          {fundo}
        </div>
      ) : null}

      {/*
        On desktop this root turns into the scrim. The padding goes through the `--*-safe`
        variables, not `lg:p-*`: `.pt-safe`/`.px-safe` are written after Tailwind and would
        win over it. See the note in CLAUDE.md.
      */}
      <div
        style={{ '--feedback-surface': `var(--color-${surface})` } as CSSProperties}
        className={[
          'bg-[var(--feedback-surface)] pt-safe px-safe flex min-h-dvh flex-col',
          'lg:fixed lg:inset-0 lg:z-40 lg:min-h-0 lg:items-center lg:overflow-y-auto',
          'lg:bg-black/30 lg:backdrop-blur-xs lg:[--pt-safe:1.5rem] lg:[--px-safe:1.5rem]',
        ].join(' ')}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className={[
            'relative isolate flex w-full flex-1 flex-col',
            'lg:bg-[var(--feedback-surface)] lg:border-outline-subtle lg:my-auto lg:max-w-[560px] lg:flex-none',
            'lg:gap-6 lg:rounded-2xl lg:border lg:p-6',
          ].join(' ')}
        >
          {decoration}
          {pergunta === null ? null : (
            // Sticky on mobile, like the step header of the other flows.
            <div className="bg-[var(--feedback-surface)] sticky top-0 z-10 flex flex-col gap-3 px-6 pt-2 pb-2 lg:static lg:px-0 lg:pt-0 lg:pb-0">
              <IconButton
                icon={<ArrowLeftIcon className="size-[18px]" />}
                aria-label="Voltar"
                onClick={onBack}
                className="self-start lg:hidden"
              />
              <ProgressoPerguntas atual={pergunta} total={totalPerguntas} />
            </div>
          )}

          {children}

          {/*
            `min-h-[76px]` on mobile holds the bar's height through the frame between the
            outgoing screen unmounting and the incoming one filling the portal.
            `--pb-safe` has to sit on the element that reads it.
          */}
          <div
            ref={setFooterNode}
            className={[
              decoration ? 'bg-transparent' : 'bg-[var(--feedback-surface)]',
              'pb-safe flex w-full flex-col gap-3 px-6 pt-4 [--pb-safe:2rem]',
              'min-h-[76px] lg:min-h-0 lg:flex-row-reverse lg:px-0 lg:pt-0 lg:[--pb-safe:0px]',
            ].join(' ')}
          />
        </div>
      </div>
    </>
  )
}

type FeedbackBodyProps = {
  title?: ReactNode
  subtitle?: ReactNode
  /** Rendered into the shell's footer bar. */
  footer?: ReactNode
  children?: ReactNode
}

/**
 * The sliding part of an Avaliação question: its title and its answers. The footer it
 * declares is portalled into the shell's bar. The title sits 32px under the progress
 * segments and the answers 12px under the title, on both breakpoints.
 */
export function FeedbackBody({ title, subtitle, footer, children }: FeedbackBodyProps) {
  return (
    <>
      <div className="flex flex-1 flex-col gap-3 px-6 pt-6 pb-6 lg:px-0 lg:pt-2 lg:pb-0">
        {title ? (
          // No weight utility: Calma Serif ships Regular only — see styles/index.css.
          <h1 className="font-display text-heading-l text-fg-default">{title}</h1>
        ) : null}
        {subtitle ? <p className="text-body-s text-fg-muted">{subtitle}</p> : null}
        {children}
      </div>

      <StepFooter>{footer}</StepFooter>
    </>
  )
}
