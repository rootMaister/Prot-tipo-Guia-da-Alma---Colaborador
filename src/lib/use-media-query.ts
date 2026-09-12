import { useEffect, useState } from 'react'

/**
 * Reads a media query in JS, and keeps reading it.
 *
 * Only for things CSS genuinely cannot express — today, the **direction** of the screen
 * transition, which is a `motion` variant and not a class. Anything that can be a
 * breakpoint utility should stay one; this is not a general escape hatch, and it is not for
 * measuring the viewport (see the note about `visualViewport` in CLAUDE.md).
 */
export function useMediaQuery(query: string): boolean {
  const [bate, setBate] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setBate(mql.matches)

    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return bate
}

/** `lg` do Tailwind, que é onde a régua lateral entra no lugar da barra inferior. */
export const DESKTOP = '(min-width: 64rem)'
