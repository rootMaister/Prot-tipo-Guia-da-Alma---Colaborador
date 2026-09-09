import { useLayoutEffect } from 'react'

/**
 * Paints the browser's own chrome with the screen's background colour.
 *
 * On iOS Safari the status bar and the address bar are tinted from `<meta
 * name="theme-color">`, and the rubber-band area past the top and bottom of the page is
 * painted with the *document's* background. Both were left at the default white, while the
 * screen colour sat on an inner `min-h-dvh` element — which is what produced the hard white
 * bands above and below the lime.
 *
 * So this sets both: the background on `<html>`, and the meta tag the browser reads.
 * `theme-color` needs a resolved colour, not a custom property, hence the round trip
 * through `getComputedStyle` — the token stays the single source of truth and no hex is
 * repeated here.
 *
 * A layout effect, so the colour is right before the first paint of the new screen rather
 * than a frame later.
 *
 * Nothing is restored on unmount, on purpose: during a transition the outgoing screen is
 * still mounted while it slides out, and resetting on its way would flash the default
 * colour between steps. The next screen always sets its own.
 *
 * @param token a design-system colour token name, e.g. `surface-base`.
 */
export function useScreenSurface(token: string) {
  useLayoutEffect(() => {
    const root = document.documentElement

    root.style.backgroundColor = `var(--color-${token})`

    const resolvida = getComputedStyle(root).backgroundColor

    if (!resolvida) {
      return
    }

    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')

    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'theme-color'
      document.head.appendChild(meta)
    }

    meta.content = resolvida
  }, [token])
}
