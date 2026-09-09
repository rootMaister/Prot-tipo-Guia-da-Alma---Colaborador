import { useEffect, useRef, type ReactNode } from 'react'

import { AnimatePresence, motion } from 'motion/react'

/**
 * Reports whether the flow is moving forward (`1`) or backward (`-1`), by comparing the
 * step index against the one rendered previously. Read during render, updated after it,
 * so the transition that is about to play sees the direction it is playing in.
 */
export function useStepDirection(index: number): 1 | -1 {
  const anterior = useRef(index)
  const direction: 1 | -1 = index >= anterior.current ? 1 : -1

  useEffect(() => {
    anterior.current = index
  }, [index])

  return direction
}

const DESLOCAMENTO = 24

const variantes = {
  enter: (direction: 1 | -1) => ({ opacity: 0, x: direction * DESLOCAMENTO }),
  center: { opacity: 1, x: 0 },
  exit: (direction: 1 | -1) => ({ opacity: 0, x: direction * -DESLOCAMENTO }),
}

type StepTransitionProps = {
  /** Changing this key is what plays the transition — pass the step slug. */
  stepKey: string
  direction: 1 | -1
  /** Classes for the moving element. Inside a shell this is the scrolling content area. */
  className?: string
  /**
   * Classes for the wrapper, which never moves. Deliberately does not clip: the slide is
   * absorbed by `overflow-x: hidden` on `html`, so nothing near the fields cuts off the
   * design system's box-shadow focus ring.
   */
  wrapperClassName?: string
  children: ReactNode
}

/**
 * Slides one step out and the next one in: forward, the incoming screen comes from the
 * right; going back, it comes from the left.
 *
 * `mode="wait"` so the two screens never overlap — both are `min-h-dvh`, and letting them
 * coexist would double the page height and fight the scroll position. The exit is quicker
 * than the entrance, which keeps the pair feeling like one movement rather than two.
 *
 * The progress bar advancing is not part of this: it animates inside the entering shell,
 * from the previous step's value, via `useAdvancingProgress`.
 */
export function StepTransition({
  stepKey,
  direction,
  className,
  wrapperClassName,
  children,
}: StepTransitionProps) {
  return (
    <div className={wrapperClassName}>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={stepKey}
          custom={direction}
          variants={variantes}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          className={className}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
