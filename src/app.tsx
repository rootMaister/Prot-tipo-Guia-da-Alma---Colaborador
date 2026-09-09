import { ThemeProvider } from '@guia-da-alma/ds'
import { RouterProvider } from 'react-router'

import { useViewportHeight } from './lib/use-viewport-height'
import { router } from './routes'

export function App() {
  // Sizes every screen to the visible strip rather than the whole window, so the keyboard
  // never pushes the footer out of reach on iOS. See the hook for why `dvh` cannot.
  useViewportHeight()

  return (
    // Light only: the design system ships no dark palette yet — colors.css ends at
    // "Dark mode — full dark palette is deferred". See DS-GAPS.md.
    <ThemeProvider defaultTheme="light" storageKey="prototipo-colaboradores-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
