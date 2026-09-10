import type { ReactNode } from 'react'

import { Badge, IconButton, ProgressBar, cn } from '@guia-da-alma/ds'
import { ArrowLeftIcon } from 'lucide-react'
import { useLocation } from 'react-router'

import { GuiaLockup } from '@/components/local/guia-lockup'
import { useAdvancingProgress } from '@/lib/use-advancing-progress'

import { StepFooter, useChromeProgress, useFooterSlot, usePublishProgress } from './step-chrome'

import { useScreenSurface } from '@/lib/use-screen-surface'

type StepShellProps = {
  /** Text beside the progress bar. Taken from the rendered copy, not the layer name. */
  stepLabel: string
  /** The step's own percentage; a screen can override it through `StepBody`. */
  progress: number
  onBack?: () => void
  /**
   * Widens the desktop column from 450px to the container's full 1000px. Only the Match
   * results screen uses it: its grid needs the room, which is why its desktop progress
   * track is 934px where every other screen draws 384px.
   */
  wide?: boolean
  /** The part that transitions between steps. */
  children?: ReactNode
}

/**
 * Progress-header chrome — the `mobile-match` (1105:10742) and `desktop-match`
 * (1130:1263) symbols in Figma, whose inner `[mobile]-reference-screen` (1105:10666) is
 * shared by the Match questionnaire (steps 2–5, 7) and the Agendamento flow (steps 2–4).
 * The "match" in the Figma names is the symbol's name, not a flow's — hence `StepShell`.
 *
 * Rendered by the flow's **layout route**, not by the screens, so the lockup, the back
 * button, the progress bar and the footer bar stay still while only the page content
 * slides between steps. What each screen puts inside those fixed parts arrives through
 * `step-chrome`.
 *
 * A sibling of `SignUpShell` rather than a variant of it: the Figma symbols are separate,
 * and three things genuinely differ — the title stays Heading L (32/40) on *both*
 * breakpoints instead of growing from Display S to Heading XXL; the header row is
 * centre-aligned on mobile and bottom-aligned on desktop; and the footer keeps its top
 * border and 32px bottom padding on desktop, where the sign-up footer drops both.
 *
 * DS-GAP: same `ProgressBar` track and `Badge` divergences as `SignUpShell` — left as the
 * design system renders them rather than patched over with className. See DS-GAPS.md.
 */
export function StepShell({
  stepLabel,
  progress,
  onBack,
  wide = false,
  children,
}: StepShellProps) {
  useScreenSurface('surface-base')

  // The flow name is the first path segment, so the bar of each flow animates from its own
  // previous step and never from another flow's.
  const flow = useLocation().pathname.split('/')[1] ?? 'app'
  const override = useChromeProgress()
  const alvo = override ?? progress
  const progressoAnimado = useAdvancingProgress(flow, alvo)
  const setFooterNode = useFooterSlot()

  return (
    <div className="bg-surface-base pt-safe px-safe flex min-h-dvh flex-col gap-3 lg:gap-0">
      <header className="hidden w-full px-8 py-8 lg:block">
        <GuiaLockup height={18} className="text-fg-default" />
      </header>

      <div className="flex flex-1 flex-col lg:items-center lg:px-9">
        <div
          className={cn(
            'flex w-full flex-1 flex-col',
            wide ? 'lg:max-w-[1000px]' : 'lg:max-w-[450px]',
          )}
        >
          <div
            className="bg-surface-base sticky top-0 z-10 flex items-center gap-6 px-6 py-4 lg:static lg:items-end lg:px-0 lg:pt-5 lg:pb-12"
          >
            <IconButton
              icon={<ArrowLeftIcon className="size-[18px]" />}
              aria-label="Voltar"
              onClick={onBack}
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <ProgressBar value={progressoAnimado} />
              <div className="flex items-end justify-between pt-2 lg:items-center">
                <p className="text-body-s text-fg-subtle lg:text-body-m whitespace-nowrap">
                  {stepLabel}
                </p>
                <Badge variant="success">{alvo}%</Badge>
              </div>
            </div>
          </div>

          {children}

          {/*
            `min-h-[76px]` holds the bar's height through the single frame between the
            outgoing screen unmounting and the incoming one filling the portal, so the
            layout does not jump at the handover.
          */}
          <footer
            ref={setFooterNode}
            className="bg-surface-base border-outline-subtle pb-safe flex w-full flex-col border-t px-6 lg:px-0 min-h-[76px] gap-4 pt-3 [--pb-safe:1rem]"
          />
        </div>
      </div>
    </div>
  )
}

type StepBodyProps = {
  title?: ReactNode
  subtitle?: ReactNode
  /** Rendered into the shell's fixed footer bar. */
  footer?: ReactNode
  /** Only where the bar moves with the answer; otherwise the step's own value stands. */
  progress?: number
  children?: ReactNode
}

/**
 * The part of a step that slides: its title and its content. Rendered by the screen,
 * inside the layout's transition. The footer it declares is portalled into the fixed bar,
 * so the buttons keep the screen's own state while the bar itself never moves.
 */
export function StepBody({ title, subtitle, footer, progress, children }: StepBodyProps) {
  usePublishProgress(progress ?? null)

  return (
    <>
      {title ? (
        <div className="flex flex-col gap-4 p-6 lg:px-0 lg:py-6">
          {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
          <h1 className="font-display text-heading-l text-fg-default">{title}</h1>
          {subtitle ? <p className="text-body-s text-fg-subtle">{subtitle}</p> : null}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col px-6 lg:px-0">{children}</div>

      <StepFooter>{footer}</StepFooter>
    </>
  )
}
