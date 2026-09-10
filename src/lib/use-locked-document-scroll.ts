import { useEffect } from 'react'

/**
 * Stops the document itself from scrolling, for screens that are sized to the viewport and
 * scroll their content internally.
 *
 * Without this the page stays scrollable even when it fits: when the keyboard opens, iOS
 * scrolls the *page* to reveal the focused field, which drags the header, the back button
 * and the progress bar up under the status bar — none of which are supposed to move. With
 * the document locked, the nearest scrollable ancestor is our own content area, so that is
 * what moves instead.
 *
 * `overflow: hidden` alone does not do it on iOS — Safari lets the page be dragged anyway,
 * which is the long-standing body-scroll-lock problem. Pinning the body with
 * `position: fixed` is what actually holds there, so both are applied.
 *
 * Only the fixed-height shells call it. Screens that legitimately grow past the viewport —
 * the index, the feedback screens — must keep the page scrollable.
 *
 * @param ativo pass `false` to release the lock. The shells drop it while the keyboard is
 * open: there the footer is meant to scroll away with the content, which needs a scrollable
 * page.
 */
export function useLockedDocumentScroll(ativo = true) {
  useEffect(() => {
    if (!ativo) {
      return
    }

    const { documentElement: html, body } = document

    const anterior = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyWidth: body.style.width,
      bodyTop: body.style.top,
    }

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.width = '100%'
    body.style.top = '0'

    return () => {
      // Back to the empty string, not to a value: that hands control to the stylesheet,
      // which still sets `overflow-x: hidden` for the step transition.
      html.style.overflow = anterior.htmlOverflow
      body.style.overflow = anterior.bodyOverflow
      body.style.position = anterior.bodyPosition
      body.style.width = anterior.bodyWidth
      body.style.top = anterior.bodyTop
    }
  }, [ativo])
}
