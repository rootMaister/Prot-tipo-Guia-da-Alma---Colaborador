import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import avatar from '@/assets/match/profissional-1.jpg'

export type SessaoAgendada = {
  /** Date badge exactly as the card renders it — "Hoje, 24 de Ago ás 19:00". */
  quando: string
  titulo: string
  /** Abbreviated title as drawn: "Psi." on some cards, "Psic." on others. */
  profissionalTitulo: string
  profissionalNome: string
  avatar: string
}

export type Conta = {
  nome: string
  nivel: number
  pontos: number
  moedas: number
  /** Plan allowance, as the "Seu plano" card states it. */
  agendamentosPorMes: number
  sessoes: SessaoAgendada[]
}

/**
 * Account state, mocked and shared by the whole prototype.
 *
 * It sits above the router rather than inside a flow because it is the one thing that has to
 * survive moving between them: booking a session in the Agendamento flow is what flips the
 * Home from "Descubra a melhor sessão" to "Sua próxima sessão". Flow providers are scoped to
 * their own route subtree and are torn down on the way out, so they cannot hold this.
 *
 * Starts with no sessions, so the prototype opens on the Home the design draws for someone
 * who has not booked yet (1448:7654). Walking Agendamento to the end produces the other one
 * (1429:6283).
 */
const CONTA_INICIAL: Conta = {
  nome: 'Lara',
  nivel: 1,
  pontos: 123,
  moedas: 232,
  agendamentosPorMes: 4,
  sessoes: [],
}

/** What the Agendamento flow books, matching the session that flow is drawn around. */
export const SESSAO_DEMO: Omit<SessaoAgendada, 'quando'> = {
  titulo:
    'Sessão de Psicoterapia Analítica/Junguiana | atendimento exclusivo para mulheres e pessoas LGBT+',
  profissionalTitulo: 'Psi.',
  profissionalNome: 'Daniele Tramontina',
  avatar,
}

type ContaContextValue = {
  conta: Conta
  agendar: (sessao: SessaoAgendada) => void
  reset: () => void
}

const ContaContext = createContext<ContaContextValue | null>(null)

export function ContaProvider({ children }: { children: ReactNode }) {
  const [conta, setConta] = useState<Conta>(CONTA_INICIAL)

  const agendar = useCallback((sessao: SessaoAgendada) => {
    setConta((atual) => {
      // Booking the same slot twice — re-walking the flow — should not stack duplicates.
      if (atual.sessoes.some((s) => s.quando === sessao.quando)) {
        return atual
      }

      return { ...atual, sessoes: [...atual.sessoes, sessao] }
    })
  }, [])

  const reset = useCallback(() => setConta(CONTA_INICIAL), [])

  const value = useMemo(() => ({ conta, agendar, reset }), [conta, agendar, reset])

  return <ContaContext.Provider value={value}>{children}</ContaContext.Provider>
}

export function useConta(): ContaContextValue {
  const context = useContext(ContaContext)

  if (!context) {
    throw new Error('useConta must be used inside a ContaProvider')
  }

  return context
}

/** Sessions left this month, for the "Seu plano" card. */
export const agendamentosRestantes = (conta: Conta): number =>
  Math.max(0, conta.agendamentosPorMes - conta.sessoes.length)
