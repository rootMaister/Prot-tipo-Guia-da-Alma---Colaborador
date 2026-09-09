import { useEffect, useState } from 'react'

/**
 * Remembers the last progress value each flow rendered, so the next screen's bar can
 * start where the previous one stopped.
 *
 * Module scope rather than context: the shells are rendered by five different screens
 * across three flows and are unmounted between steps, so there is no common React parent
 * that survives the transition. Keyed by flow so the three never bleed into each other.
 */
const ultimoValor = new Map<string, number>()

/**
 * Returns the value to hand the progress bar so it *advances* on entry instead of
 * appearing already full.
 *
 * The bar mounts at the previous step's percentage and moves to the current one on the
 * next frame — the DS `ProgressBar` transitions its width over 300ms, so that single
 * change is the whole animation. Going backwards it runs the same way, in reverse.
 */
export function useAdvancingProgress(flow: string, target: number): number {
  const [valor, setValor] = useState(() => ultimoValor.get(flow) ?? target)

  useEffect(() => {
    ultimoValor.set(flow, target)

    // Two frames: one for the bar to paint at the starting value, one to move it.
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setValor(target))
    })

    return () => cancelAnimationFrame(frame)
  }, [flow, target])

  return valor
}
