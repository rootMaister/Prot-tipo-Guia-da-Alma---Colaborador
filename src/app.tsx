import { ThemeProvider } from '@guia-da-alma/ds'
import { RouterProvider } from 'react-router'

import { ContaProvider } from './state/conta-provider'
import { router } from './routes'

export function App() {
  return (
    // Light only: the design system ships no dark palette yet — colors.css ends at
    // "Dark mode — full dark palette is deferred". See DS-GAPS.md.
    <ThemeProvider defaultTheme="light" storageKey="prototipo-colaboradores-theme">
      {/*
        Account state sits above the router: booking a session in the Agendamento flow is
        what changes the Home, and a flow's provider is torn down on the way out.
      */}
      <ContaProvider>
        <RouterProvider router={router} />
      </ContaProvider>
    </ThemeProvider>
  )
}
