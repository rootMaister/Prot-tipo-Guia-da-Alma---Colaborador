import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

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
 * Empty defaults, so a cold deep-link into any step opens the screen as the design draws
 * it: every Figma frame for this flow shows the unfilled state. The "- filled" variants
 * (1105:11501, 1119:12542) are what walking the flow and picking options produces.
 */
const MOCK_DEFAULTS: MatchData = {
  temas: [],
  especialidades: [],
  dias: [],
  horarios: [],
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
