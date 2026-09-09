import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

type ChromeContextValue = {
  /** The fixed footer bar's DOM node, once the shell has mounted it. */
  footerNode: HTMLElement | null
  setFooterNode: (node: HTMLElement | null) => void
  /** Overrides the step's default percentage, for steps whose bar moves with the answer. */
  progress: number | null
  setProgress: (progress: number | null) => void
}

const StepChromeContext = createContext<ChromeContextValue | null>(null)

/**
 * Lets a screen fill parts of the chrome that sit *outside* it.
 *
 * The header, back button and progress bar stay still while the content slides, so they
 * are rendered by the flow's layout route, above the `<Outlet/>`. The footer bar stays
 * still too. The screen inside the outlet therefore cannot render either of them in place,
 * and reaches out to them from here.
 *
 * The footer travels by portal rather than by state: its buttons close over the screen's
 * own state, so storing the node in context would re-render the provider on every
 * keystroke — and storing the element would loop, since JSX is a new object each render.
 * A portal keeps the buttons in the screen's React tree, where their state lives, while
 * painting them inside the fixed bar.
 */
export function StepChromeProvider({ children }: { children: ReactNode }) {
  const [footerNode, setFooterNode] = useState<HTMLElement | null>(null)
  const [progress, setProgress] = useState<number | null>(null)

  const value = useMemo(
    () => ({ footerNode, setFooterNode, progress, setProgress }),
    [footerNode, progress],
  )

  return <StepChromeContext.Provider value={value}>{children}</StepChromeContext.Provider>
}

function useStepChromeContext(): ChromeContextValue {
  const context = useContext(StepChromeContext)

  if (!context) {
    throw new Error('Step chrome is only available inside a flow layout route')
  }

  return context
}

/** Read side, for the shell: hands it the ref callback for the footer bar. */
export function useFooterSlot() {
  const { setFooterNode } = useStepChromeContext()
  return setFooterNode
}

/** Read side, for the shell: the live percentage, or null to fall back to the step's own. */
export function useChromeProgress(): number | null {
  return useStepChromeContext().progress
}

/**
 * Write side, for a screen whose progress depends on what has been answered — the time
 * step moves 50 → 60 once a slot is picked, the extra-information step 75 → 85.
 *
 * A layout effect so the bar is right before the browser paints. Nothing is cleared on
 * unmount: during a transition the outgoing screen is still mounted while it slides out,
 * and wiping the value on the way would make the bar jump.
 */
export function usePublishProgress(progress: number | null) {
  const { setProgress } = useStepChromeContext()

  useLayoutEffect(() => {
    setProgress(progress)
  }, [progress, setProgress])
}

/**
 * Renders its children into the fixed footer bar. Returns nothing until the shell has
 * mounted the bar, which is one render on the flow's first step.
 */
export function StepFooter({ children }: { children: ReactNode }) {
  const { footerNode } = useStepChromeContext()

  return footerNode ? createPortal(children, footerNode) : null
}
