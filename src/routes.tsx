import { createBrowserRouter, Navigate } from 'react-router'

import { AgendamentoLayout } from '@/flows/agendamento/agendamento-route'
import { AvaliacaoLayout } from '@/flows/avaliacao/avaliacao-route'
import { CadastroLayout } from '@/flows/cadastro/cadastro-route'
import { MatchLayout } from '@/flows/match/match-route'
import { IndexPage } from '@/pages/index-page'
import { ShellLayout } from '@/shell/shell-route'

export const router = createBrowserRouter([
  { path: '/', element: <IndexPage /> },
  { path: '/cadastro', element: <Navigate to="/cadastro/splash" replace /> },
  {
    // O layout casa o passo direto, sem rota filha: ele mantém o estado do fluxo e o chrome
    // montados entre os passos, e resolve a tela pelo registry. Ver `cadastro-route.tsx`.
    path: '/cadastro/:step',
    element: <CadastroLayout />,
  },
  { path: '/match', element: <Navigate to="/match/inicio" replace /> },
  {
    // O layout casa o passo direto, sem rota filha: ele mantém o estado do fluxo e o chrome
    // montados entre os passos, e resolve a tela pelo registry. Ver `match-route.tsx`.
    path: '/match/:step',
    element: <MatchLayout />,
  },
  { path: '/agendamento', element: <Navigate to="/agendamento/detalhes" replace /> },
  {
    // O layout casa o passo direto, sem rota filha: ele mantém o estado do fluxo e o chrome
    // montados entre os passos, e resolve a tela pelo registry. Ver `agendamento-route.tsx`.
    path: '/agendamento/:step',
    element: <AgendamentoLayout />,
  },
  { path: '/avaliacao', element: <Navigate to="/avaliacao/realizada" replace /> },
  {
    // O layout casa o passo direto, sem rota filha: ele mantém o estado do fluxo e o chrome
    // montados entre os passos, e resolve a tela pelo registry. Ver `avaliacao-route.tsx`.
    path: '/avaliacao/:step',
    element: <AvaliacaoLayout />,
  },
  // `/app` prefixa os destinos para `/agendamento` (o fluxo, uma tarefa) e `/agendamentos`
  // (o destino, uma lista) não colidirem.
  { path: '/app', element: <Navigate to="/app/inicio" replace /> },
  { path: '/app/:destino', element: <ShellLayout /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
