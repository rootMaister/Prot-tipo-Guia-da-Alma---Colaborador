import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import { DIAS_UTEIS, ESPECIALIDADES, HORARIOS } from './opcoes'

export type MatchData = {
  /** Step 2 — "Seu momento", multi-select. */
  temas: string[]
  /** Step 4 — "Especialidade", multi-select despite the radio-ish layer name. */
  especialidades: string[]
  /** Step 5 — weekday chips. */
  dias: string[]
  /** Step 5 — time-of-day option cards. */
  horarios: string[]
}

/**
 * O fluxo abre com escolhas já feitas, por decisão da revisão de 21/09/2026: o questionário
 * deixa de ser um formulário em branco e passa a ser uma sugestão para ajustar — dá para
 * seguir direto até o resultado, e quem quiser desmarca.
 *
 * Antes eram listas vazias, porque os frames do arquivo desenham o estado não preenchido.
 * As variantes "- filled" (1105:11501, 1119:12542) mostram o preenchido, e é delas que o
 * desenho da seleção sai.
 */
const MOCK_DEFAULTS: MatchData = {
  temas: ['Autoconhecimento'],
  especialidades: [...ESPECIALIDADES],
  dias: [...DIAS_UTEIS],
  horarios: [...HORARIOS],
}

type MatchContextValue = {
  data: MatchData
  update: (patch: Partial<MatchData>) => void
  /** Adds or removes one value from a multi-select field. */
  toggle: (field: 'temas' | 'especialidades' | 'dias' | 'horarios', value: string) => void
  reset: () => void
}

const MatchContext = createContext<MatchContextValue | null>(null)

type MatchProviderProps = {
  children: ReactNode
}

export function MatchProvider({ children }: MatchProviderProps) {
  const [data, setData] = useState<MatchData>(MOCK_DEFAULTS)

  const update = useCallback((patch: Partial<MatchData>) => {
    setData((current) => ({ ...current, ...patch }))
  }, [])

  const toggle = useCallback(
    (field: 'temas' | 'especialidades' | 'dias' | 'horarios', value: string) => {
      setData((current) => {
        const selected = current[field]
        return {
          ...current,
          [field]: selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value],
        }
      })
    },
    [],
  )

  const reset = useCallback(() => {
    setData(MOCK_DEFAULTS)
  }, [])

  const value = useMemo(() => ({ data, update, toggle, reset }), [data, update, toggle, reset])

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
}

export function useMatch(): MatchContextValue {
  const context = useContext(MatchContext)

  if (!context) {
    throw new Error('useMatch must be used inside a MatchProvider')
  }

  return context
}
