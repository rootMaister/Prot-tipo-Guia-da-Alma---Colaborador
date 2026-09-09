import type { ReactNode } from 'react'

import { Badge, IconButton, ProgressBar } from '@guia-da-alma/ds'
import { ArrowLeftIcon } from 'lucide-react'
import { motion, type MotionProps } from 'motion/react'
import { useLocation } from 'react-router'

import { GuiaLockup } from '@/components/local/guia-lockup'
import { useAdvancingProgress } from '@/lib/use-advancing-progress'

import { StepFooter, useChromeProgress, useFooterSlot, usePublishProgress } from './step-chrome'

import { useScreenSurface } from '@/lib/use-screen-surface'

type SignUpShellProps = {
  /** Text beside the progress bar. Taken from the rendered copy, not the layer name. */
  stepLabel: string
  /** The step's own percentage; a screen can override it through `SignUpBody`. */
  progress: number
  onBack?: () => void
  /** The part that transitions between steps. */
  children?: ReactNode
}

/**
 * The `desktop-sign-up` symbol from Figma (section 1069:7874), which despite its name has
 * both breakpoints: `1061:7559` wraps `[mobile]-reference-screen` and `1089:9710` wraps
 * `[desktop]-reference-screen` (lockup header + a centred 450px column). Used by Cadastro
 * steps 2, 4, 5 and 6.
 *
 * Rendered by the flow's **layout route**, not by the screens, so the lockup, the back
 * button, the progress bar and the footer bar stay still while only the page content
 * slides between steps. What each screen puts inside those fixed parts arrives through
 * `step-chrome`.
 *
 * The two breakpoints are not the same design scaled: the title drops from Display S
 * (44/52, regular) on mobile to Heading XXL (40/52, semibold) on desktop, and the body and
 * step label step up from 14/20 and 12/18 to 16/24.
 *
 * DS-GAP: `ProgressBar` renders its track in `outline-subtle` (#e5e5e5) while Figma binds
 * it to `surface/muted` (#edebe7), and `Badge` is 12px/bold with 16px padding against
 * Figma's 14px/semibold with 12px. Left as the design system renders them rather than
 * patched over with className. See DS-GAPS.md.
 */
export function SignUpShell({ stepLabel, progress, onBack, children }: SignUpShellProps) {
  useScreenSurface('surface-base')

  const flow = useLocation().pathname.split('/')[1] ?? 'app'
  const override = useChromeProgress()
  const alvo = override ?? progress
  const progressoAnimado = useAdvancingProgress(flow, alvo)
  const setFooterNode = useFooterSlot()

  return (
    <div className="bg-surface-base pt-safe px-safe flex min-h-dvh flex-col">
      <header className="hidden w-full px-8 py-8 lg:block">
        <GuiaLockup height={18} className="text-fg-default" />
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:items-center lg:px-9">
        <div className="flex min-h-0 w-full flex-1 flex-col lg:max-w-[450px]">
          <div className="flex items-end gap-6 px-6 py-4 lg:px-0 lg:pt-5 lg:pb-12">
            <IconButton
              icon={<ArrowLeftIcon className="size-[18px]" />}
              aria-label="Voltar"
              onClick={onBack}
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <ProgressBar value={progressoAnimado} />
              <div className="flex items-end justify-between pt-2 lg:items-center">
                <p className="text-caption text-fg-subtle lg:text-body-m whitespace-nowrap">
                  {stepLabel}
                </p>
                <Badge variant="success">{alvo}%</Badge>
              </div>
            </div>
          </div>

          {children}

          {/*
            `min-h-[92px]` holds the bar's height through the single frame between the
            outgoing screen unmounting and the incoming one filling the portal, so the
            layout does not jump at the handover.
          */}
          <footer
            ref={setFooterNode}
            className="border-outline-subtle pb-safe min-h-[92px] w-full border-t px-6 pt-3 [--pb-safe:2rem] lg:border-t-0 lg:px-0 lg:[--pb-safe:4rem]"
          />
        </div>
      </div>
    </div>
  )
}

type SignUpBodyProps = {
  title: ReactNode
  subtitle?: ReactNode
  /** Rendered into the shell's fixed footer bar. */
  footer?: ReactNode
  /** Only where the bar moves with the answer; otherwise the step's own value stands. */
  progress?: number
  /**
   * Fades the title and content up as the step opens, one shortly after the other. Used on
   * the company-code step, the first screen of the form proper.
   */
  animateIn?: boolean
  children?: ReactNode
}

/**
 * The part of a Cadastro step that slides: its title and its content. The footer it
 * declares is portalled into the fixed bar, so the buttons keep the screen's own state
 * while the bar itself never moves.
 */
export function SignUpBody({
  title,
  subtitle,
  footer,
  progress,
  animateIn = false,
  children,
}: SignUpBodyProps) {
  usePublishProgress(progress ?? null)

  /*
    Each block rises 16px into place a beat after the one above it. `motion` respects
    `prefers-reduced-motion` for transforms, so this needs no media query of its own.
  */
  const surgir = (ordem: number): MotionProps =>
    animateIn
      ? {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.45,
            delay: 0.06 * ordem,
            ease: [0.22, 0.61, 0.36, 1] as const,
          },
        }
      : {}

  return (
    <>
      <motion.div className="flex flex-col gap-4 px-6 lg:gap-2 lg:px-0" {...surgir(0)}>
        {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
        <h1 className="font-display text-display-s text-fg-default lg:text-heading-xxl">{title}</h1>
        {subtitle ? <p className="text-body-s text-fg-subtle lg:text-body-m">{subtitle}</p> : null}
      </motion.div>

      <motion.div className="flex flex-1 flex-col px-6 pt-8 lg:px-0" {...surgir(1)}>
        {children}
      </motion.div>

      <StepFooter>{footer}</StepFooter>
    </>
  )
}
