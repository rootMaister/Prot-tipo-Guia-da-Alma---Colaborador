import { ThemeProvider } from '@guia-da-alma/ds'
import { RouterProvider } from 'react-router'

import { router } from './routes'

export function App() {
  return (
    // Light only: the design system ships no dark palette yet — colors.css ends at
    // "Dark mode — full dark palette is deferred". See DS-GAPS.md.
    <ThemeProvider defaultTheme="light" storageKey="prototipo-colaboradores-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
