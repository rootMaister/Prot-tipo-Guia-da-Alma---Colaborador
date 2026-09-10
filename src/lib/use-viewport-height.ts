import { useEffect } from 'react'

/**
 * Publishes the *visual* viewport height as `--app-height`, so the app can be sized to
 * what is actually on screen rather than to the whole window.
 *
 * On iOS the software keyboard does not shrink the layout viewport: `100dvh` still
 * measures the full screen while only a strip above the keyboard is visible. A screen
 * sized in `dvh` therefore keeps its footer somewhere under the keyboard, and the page
 * becomes scrollable just to reach the action button — which is the bug this fixes.
 *
 * `visualViewport.height` is the one measurement that does account for the keyboard. It
 * also already accounts for the browser's own bars, so it stays correct as the URL bar
 * collapses on scroll — the behaviour `dvh` was giving us before.
 *
 * Android needs no script for this: `interactive-widget=resizes-content` in the viewport
 * meta makes the keyboard shrink the layout viewport there. iOS ignores that property,
 * hence this.
 */
export function useViewportHeight() {
  useEffect(() => {
    const vv = window.visualViewport

    if (!vv) {
      return
    }

    const publicar = () => {
      document.documentElement.style.setProperty('--app-height', `${vv.height}px`)
    }

    /*
      iOS reveals the focused field when the keyboard opens, but it does that *before* this
      hook shrinks the screen — so the field it just revealed can end up out of view again
      once the layout settles. Re-revealing it after the resize is what actually keeps it on
      screen, and by then the content area is the only thing that can scroll.

      Only on `resize`, never on `scroll`: doing it on scroll would yank the view back every
      time the user panned.
    */
    const revelarCampoFocado = () => {
      const ativo = document.activeElement

      if (
        ativo instanceof HTMLInputElement ||
        ativo instanceof HTMLTextAreaElement ||
        ativo instanceof HTMLSelectElement
      ) {
        // `nearest`, not `center`: it scrolls the least amount that makes the field
        // visible, so the title and the question above it stay on screen where they fit.
        ativo.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }

    const aoRedimensionar = () => {
      publicar()
      // A frame late, so the new height is in effect before anything is measured.
      requestAnimationFrame(revelarCampoFocado)
    }

    publicar()

    // `scroll` matters as much as `resize`: iOS shifts the visual viewport when it pans to
    // reveal a focused field, and the height reported can change with it.
    vv.addEventListener('resize', aoRedimensionar)
    vv.addEventListener('scroll', publicar)

    return () => {
      vv.removeEventListener('resize', aoRedimensionar)
      vv.removeEventListener('scroll', publicar)
      document.documentElement.style.removeProperty('--app-height')
    }
  }, [])
}
