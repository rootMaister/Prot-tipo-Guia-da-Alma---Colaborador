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

type Eixo = 'x' | 'y'

type Custom = { direction: 1 | -1; eixo: Eixo }

const deslocar = ({ direction, eixo }: Custom, sinal: 1 | -1) => ({
  opacity: 0,
  [eixo]: direction * sinal * DESLOCAMENTO,
})

const variantes = {
  enter: (custom: Custom) => deslocar(custom, 1),
  center: { opacity: 1, x: 0, y: 0 },
  exit: (custom: Custom) => deslocar(custom, -1),
}

type StepTransitionProps = {
  /** Changing this key is what plays the transition — pass the step slug. */
  stepKey: string
  direction: 1 | -1
  /**
   * Which way the content travels. `x` para fluxos, que são uma sequência horizontal de
   * passos; `y` para os destinos do app no desktop, onde o menu é uma régua vertical e o
   * deslize lateral contradiz a direção em que a pessoa acabou de clicar — pedido na
   * revisão de 11/09/2026. No mobile os destinos voltam para `x`, porque lá a barra é
   * horizontal.
   */
  eixo?: Eixo
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
  eixo = 'x',
  className,
  wrapperClassName,
  children,
}: StepTransitionProps) {
  const custom: Custom = { direction, eixo }

  return (
    <div className={wrapperClassName}>
      <AnimatePresence mode="wait" initial={false} custom={custom}>
        <motion.div
          key={stepKey}
          custom={custom}
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
