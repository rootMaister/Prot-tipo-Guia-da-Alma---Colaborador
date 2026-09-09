import { useCallback, useState, type ReactNode } from 'react'

type FieldShakeProps = {
  /**
   * Bumped every time this field should shake — pass the submit attempt number when the
   * field is in error, and `0` when it is not. Re-running the animation needs the element
   * to remount, so this doubles as the wrapper's `key`.
   */
  trigger: number
  children: ReactNode
}

/**
 * Wraps a field so it shakes when a submit attempt leaves it in error.
 *
 * Restarting a CSS animation on an element that is already mounted does not work — the
 * browser only replays it when the node is new. Keying the wrapper on the attempt number
 * gives a fresh node per failed submit, so two submits in a row both shake.
 *
 * The animation itself lives in `styles/index.css`, together with its
 * `prefers-reduced-motion` opt-out.
 */
export function FieldShake({ trigger, children }: FieldShakeProps) {
  return (
    <div key={trigger} className={trigger > 0 ? 'animate-field-shake' : undefined}>
      {children}
    </div>
  )
}

/**
 * Counts submit attempts, so `FieldShake` can tell "the same error again" from "no error".
 * Returns the current attempt and a function to register one.
 */
export function useSubmitAttempts() {
  const [attempt, setAttempt] = useState(0)

  const registerAttempt = useCallback(() => {
    setAttempt((current) => current + 1)
  }, [])

  return { attempt, registerAttempt }
}
