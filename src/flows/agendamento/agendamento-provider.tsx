import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'

import avatar from '@/assets/match/profissional-1.jpg'
import type { Profissional } from '@/components/local/profissional-resumo'

import { lerDisponibilidade } from './disponibilidade'

/**
 * The flow is drawn around one session throughout, so it is a constant rather than
 * something carried over from the Match results. Every "Ver mais" on step 7 of Match
 * lands here.
 */
export const SESSAO = {
  titulo:
    'Sessão de Psicoterapia Analítica/Junguiana | atendimento exclusivo para mulheres e pessoas LGBT+',
  duracao: '45 minutos de duração',
  /**
   * Onde a sessão acontece — entrou na confirmação e na tela de sucesso em 23/09/2026
   * (3297:2979, 3306:3344). É informação da sessão, não escolha da pessoa.
   */
  formato: 'Online, pelo Google Meet',
  profissional: {
    titulo: 'Psi.',
    nome: 'Daniele Tramontina',
    crp: 'CRP 06/123456',
    avatar,
    estrelas: 4,
    avaliacoes: 67,
    sessoesRealizadas: 980,
  } satisfies Profissional,
} as const

/**
 * The calendar is drawn on August 2026 with 1–3 greyed out and the 4th selectable, so the
 * mock treats 4 August 2026 as today. Fixing it keeps the screen matching the design
 * instead of drifting with the real clock.
 */
export const HOJE = new Date(2026, 7, 4)

export type AgendamentoData = {
  data: Date | null
  horario: string | null
  whatsapp: string
  observacoes: string
}

/**
 * WhatsApp arrives pre-filled — the design draws that field already populated, with the
 * `outline/default` border of a filled input rather than the empty `outline/subtle`.
 */
const MOCK_DEFAULTS: AgendamentoData = {
  data: null,
  horario: null,
  whatsapp: '(11) 99999-9999',
  observacoes: '',
}

/** Fallback slot when the flow is deep-linked rather than entered from a card. */
const SLOT_PADRAO = { data: HOJE, horario: '18:00' }

type AgendamentoContextValue = {
  data: AgendamentoData
  update: (patch: Partial<AgendamentoData>) => void
  reset: () => void
}

const AgendamentoContext = createContext<AgendamentoContextValue | null>(null)

type AgendamentoProviderProps = {
  children: ReactNode
}

export function AgendamentoProvider({ children }: AgendamentoProviderProps) {
  const location = useLocation()

  /*
    Whoever opened this flow can pass the slot through router state, so the scheduling step
    arrives with it already picked: a card passes its availability line, and the endings of
    the Avaliação pass the exact date of the slot button that was pressed. Read once, in the
    initialiser: navigating between steps creates history entries without state, and the
    provider outlives them all.
  */
  const [data, setData] = useState<AgendamentoData>(() => {
    const estado = location.state as {
      disponibilidade?: string
      slot?: { data: Date; horario: string }
    } | null
    const disponibilidade = estado?.disponibilidade
    const slot =
      estado?.slot ??
      ((disponibilidade && lerDisponibilidade(disponibilidade, HOJE)) || SLOT_PADRAO)

    return { ...MOCK_DEFAULTS, data: slot.data, horario: slot.horario }
  })

  const update = useCallback((patch: Partial<AgendamentoData>) => {
    setData((current) => ({ ...current, ...patch }))
  }, [])

  const reset = useCallback(() => {
    setData(MOCK_DEFAULTS)
  }, [])

  const value = useMemo(() => ({ data, update, reset }), [data, update, reset])

  return <AgendamentoContext.Provider value={value}>{children}</AgendamentoContext.Provider>
}

export function useAgendamento(): AgendamentoContextValue {
  const context = useContext(AgendamentoContext)

  if (!context) {
    throw new Error('useAgendamento must be used inside an AgendamentoProvider')
  }

  return context
}

const dataFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

/**
 * "Hoje - Terça-feira, 4 de Agosto ás 19:00" — the summary line above the footer on the
 * time step and again on the review step.
 *
 * The design capitalises the month and writes "ás" for "às"; both are reproduced, since
 * copy is the designer's call. See DS-GAPS.md.
 */
export const formatarQuando = (data: Date, horario: string): string => {
  const partes = dataFormatter.formatToParts(data)
  const texto = partes
    .map((parte) =>
      parte.type === 'weekday' || parte.type === 'month'
        ? parte.value.charAt(0).toUpperCase() + parte.value.slice(1)
        : parte.value,
    )
    .join('')

  const prefixo = data.getTime() === HOJE.getTime() ? 'Hoje - ' : ''

  return `${prefixo}${texto} ás ${horario}`
}
