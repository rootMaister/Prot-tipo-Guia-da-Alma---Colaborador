import { useEffect, useState } from 'react'

/**
 * Whether the software keyboard is covering part of the screen.
 *
 * There is no event for this. The tell is the gap between the layout viewport, which the
 * keyboard does not shrink on iOS, and the visual viewport, which it does — so a large and
 * sudden difference between the two means a keyboard.
 *
 * The threshold is well above anything a browser toolbar accounts for and well below the
 * smallest keyboard, so a collapsing URL bar never reads as one.
 */
const LIMIAR_TECLADO = 150

export function useKeyboardOpen(): boolean {
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    const vv = window.visualViewport

    if (!vv) {
      return
    }

    const avaliar = () => {
      setAberto(window.innerHeight - vv.height > LIMIAR_TECLADO)
    }

    avaliar()
    vv.addEventListener('resize', avaliar)

    return () => {
      vv.removeEventListener('resize', avaliar)
    }
  }, [])

  return aberto
}
