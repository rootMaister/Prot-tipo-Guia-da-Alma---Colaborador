import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type CadastroData = {
  companyCode: string
  companyName: string
  fullName: string
  cpf: string
  email: string
  whatsapp: string
  password: string
}

/**
 * Coherent mock state so a cold deep-link into any step renders something sensible —
 * opening /cadastro/senha directly should not look broken. Walking the flow from the
 * start overwrites these with what the user actually types.
 */
const MOCK_DEFAULTS: CadastroData = {
  companyCode: '',
  companyName: 'Imobiliária Novo Lar',
  fullName: '',
  cpf: '',
  email: '',
  whatsapp: '',
  password: '',
}

type CadastroContextValue = {
  data: CadastroData
  update: (patch: Partial<CadastroData>) => void
  reset: () => void
}

const CadastroContext = createContext<CadastroContextValue | null>(null)

type CadastroProviderProps = {
  children: ReactNode
}

export function CadastroProvider({ children }: CadastroProviderProps) {
  const [data, setData] = useState<CadastroData>(MOCK_DEFAULTS)

  const update = useCallback((patch: Partial<CadastroData>) => {
    setData((current) => ({ ...current, ...patch }))
  }, [])

  const reset = useCallback(() => {
    setData(MOCK_DEFAULTS)
  }, [])

  const value = useMemo(() => ({ data, update, reset }), [data, update, reset])

  return <CadastroContext.Provider value={value}>{children}</CadastroContext.Provider>
}

export function useCadastro(): CadastroContextValue {
  const context = useContext(CadastroContext)

  if (!context) {
    throw new Error('useCadastro must be used inside a CadastroProvider')
  }

  return context
}
