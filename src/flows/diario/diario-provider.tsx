import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

import { HUMOR_INICIAL } from './humores'

type DiarioContextValue = {
  /** Índice na escala de `humores.ts`. */
  humor: number
  setHumor: (humor: number) => void
  motivos: string[]
  alternarMotivo: (motivo: string) => void
  complemento: string
  setComplemento: (texto: string) => void
}

const DiarioContext = createContext<DiarioContextValue | null>(null)

/**
 * O rascunho de um registro, enquanto a pessoa percorre os cinco passos.
 *
 * Fica no fluxo, e não na conta, porque só vira registro quando ela toca em "Registrar" no
 * passo 3 — é aí que o `conta-provider` recebe. Sair no meio não deixa nada para trás, que é
 * o que "Deixar para depois" promete.
 *
 * Começa em "Estável", o meio da escala, como o slider é desenhado em repouso.
 */
export function DiarioProvider({ children }: { children: ReactNode }) {
  const [humor, setHumor] = useState(HUMOR_INICIAL)
  const [motivos, setMotivos] = useState<string[]>([])
  const [complemento, setComplemento] = useState('')

  const value = useMemo(
    () => ({
      humor,
      setHumor,
      motivos,
      alternarMotivo: (motivo: string) =>
        setMotivos((atuais) =>
          atuais.includes(motivo)
            ? atuais.filter((atual) => atual !== motivo)
            : [...atuais, motivo],
        ),
      complemento,
      setComplemento,
    }),
    [humor, motivos, complemento],
  )

  return <DiarioContext.Provider value={value}>{children}</DiarioContext.Provider>
}

export function useDiario(): DiarioContextValue {
  const context = useContext(DiarioContext)

  if (!context) {
    throw new Error('useDiario precisa de um DiarioProvider acima')
  }

  return context
}
