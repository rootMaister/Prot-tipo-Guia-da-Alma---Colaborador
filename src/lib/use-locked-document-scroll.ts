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
 * Only the fixed-height shells call it. Screens that legitimately grow past the viewport —
 * the index, the feedback screens — must keep the page scrollable.
 */
export function useLockedDocumentScroll() {
  useEffect(() => {
    const { documentElement: html, body } = document

    const anteriorHtml = html.style.overflow
    const anteriorBody = body.style.overflow

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    return () => {
      // Back to the empty string, not to a value: that hands control to the stylesheet,
      // which still sets `overflow-x: hidden` for the step transition.
      html.style.overflow = anteriorHtml
      body.style.overflow = anteriorBody
    }
  }, [])
}
