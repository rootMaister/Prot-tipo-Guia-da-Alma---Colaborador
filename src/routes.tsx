import { createBrowserRouter, Navigate } from 'react-router'

import { AgendamentoLayout, AgendamentoStepRoute } from '@/flows/agendamento/agendamento-route'
import { CadastroLayout, CadastroStepRoute } from '@/flows/cadastro/cadastro-route'
import { MatchLayout, MatchStepRoute } from '@/flows/match/match-route'
import { IndexPage } from '@/pages/index-page'

export const router = createBrowserRouter([
  { path: '/', element: <IndexPage /> },
  {
    path: '/cadastro',
    // Holds the flow state, so it survives navigation between steps.
    element: <CadastroLayout />,
    children: [
      { index: true, element: <Navigate to="splash" replace /> },
      // The screen owns the full viewport: no review chrome wraps it, so `min-h-dvh`
      // means the real thing.
      { path: ':step', element: <CadastroStepRoute /> },
    ],
  },
  {
    path: '/match',
    element: <MatchLayout />,
    children: [
      { index: true, element: <Navigate to="inicio" replace /> },
      { path: ':step', element: <MatchStepRoute /> },
    ],
  },
  {
    path: '/agendamento',
    element: <AgendamentoLayout />,
    children: [
      { index: true, element: <Navigate to="detalhes" replace /> },
      { path: ':step', element: <AgendamentoStepRoute /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
